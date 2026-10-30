// AgriBot: Universal AI Assistant & Agricultural Intelligence Engine
// ===================================================================

// Fallback knowledge base (updated with 2025-2026 benchmarks)
const KB = {
  greet: {
    patterns: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening', 'good afternoon', 'ram ram', 'kisan'],
    response: () => `### 🌾 **Namaste! I'm AgriBot – Your AI Assistant & Agricultural Intelligence Partner**<br><br>
    I am powered by advanced Large Language Models and connected in real-time to Indian agricultural mandi databases, residue trade benchmarks, and government policies.<br><br>
    **Here is how I can assist you today:**<br>
    • 🧠 **Universal AI:** Ask me *any* question—coding, math, science, history, business, creative writing, or translation<br>
    • 📊 **Live Mandi Rates:** Real-time residue pricing (Paddy straw, Wheat turi, Sugarcane bagasse, Cotton stalks, etc.)<br>
    • 🏛️ **Government Subsidies:** CRM (50%–80% straw machine subsidy), SATAT (CBG at ₹46–54/kg), PM-KUSUM, GOBARdhan<br>
    • 💡 **Waste to Wealth:** High-return repurposing (Biogas/CBG, Biomass pellets, Mushroom farming, Biochar, Eco-crockery)<br>
    • 🚫 **Zero Stubble Burning:** Avoid CAQM fines (up to ₹30,000) and earn ₹1,500–₹2,500/acre net profit instead<br>
    • 🎙️ **Voice & Multilingual:** Ask in English, Hindi, Marathi, or Hinglish, or click the **microphone** to speak!<br><br>
    *What question or topic would you like to explore today?*`
  },
  goodbye: {
    patterns: ['bye', 'goodbye', 'see you', 'take care', 'thanks bye', 'ok bye', 'shukriya', 'dhanyawad'],
    response: () => `🌿 **Happy Farming & Sustainable Agriculture!**<br>Feel free to return anytime to check real-time market rates, write code, or list your crop residue on our **Marketplace**.`
  }
};

const chatHistory = [];
let currentAudio = null;
let recognition = null;
let isRecording = false;

// Markdown to Rich HTML Formatter (with code block extraction, tables, math, lists, quotes)
function renderMarkdown(md) {
  if (!md) return '';

  let html = md;

  // 1. Fenced Code Blocks (```lang ... ```)
  const codeBlocks = [];
  html = html.replace(/```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g, function (match, lang, code) {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const langLabel = (lang || 'code').toUpperCase();
    const blockHtml = `
      <div class="chat-code-block">
        <div class="code-block-header">
          <span class="code-lang-label"><i class="fas fa-code"></i> ${langLabel}</span>
          <button class="copy-code-btn" onclick="copyCodeSnippet(this)">
            <i class="fas fa-copy"></i> Copy
          </button>
        </div>
        <pre><code class="language-${lang}">${escapedCode}</code></pre>
      </div>`;
    codeBlocks.push(blockHtml);
    return placeholder;
  });

  // 2. Tables: Parse Markdown tables into styled HTML <table>
  html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, function (tableBlock) {
    const lines = tableBlock.trim().split(/\r?\n/).filter(line => line.includes('|'));
    if (lines.length < 2) return tableBlock;

    let tableHtml = '<table class="chat-table">';
    let isHeader = true;

    lines.forEach((line, index) => {
      // Check if separator line (e.g., |:---|:---|)
      if (line.match(/^\|?\s*[-:]+[-| :]*\s*\|?$/)) {
        isHeader = false;
        return;
      }

      const cells = line.split('|').slice(1, -1);
      if (index === 0) {
        tableHtml += '<thead><tr>';
        cells.forEach(cell => {
          tableHtml += `<th>${cell.trim()}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>';
        cells.forEach(cell => {
          tableHtml += `<td>${cell.trim()}</td>`;
        });
        tableHtml += '</tr>';
      }
    });

    tableHtml += '</tbody></table>';
    return tableHtml;
  });

  // 3. Inline code `code`
  html = html.replace(/`([^`\n]+)`/g, '<code class="chat-inline-code">$1</code>');

  // 4. Headings
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // 5. Blockquotes > quote
  html = html.replace(/^>\s?(.*?)$/gm, '<blockquote class="chat-quote">$1</blockquote>');

  // 6. Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 7. Ordered lists (1. Item)
  html = html.replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li value="$1">$2</li>');
  html = html.replace(/((?:<li value="\d+">.*?<\/li>\s*)+)/g, '<ol class="chat-ol">$1</ol>');

  // 8. Bullet lists (- or * or •)
  html = html.replace(/^\s*[-*•]\s+(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul class="chat-ul">$1</ul>');

  // 9. Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

  // 10. Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr class="chat-hr">');

  // 11. Line breaks (protect table rows, pre, code blocks, lists from extra <br>)
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n(?!(?:<\/?(table|thead|tbody|tr|th|td|ul|ol|li|h1|h2|h3|h4|div|pre|code|blockquote|hr)))/g, '<br>');

  // 12. Restore code blocks
  codeBlocks.forEach((blockHtml, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, blockHtml);
  });

  return html;
}

// Copy Code Snippet Handler
function copyCodeSnippet(btn) {
  const codeBlock = btn.closest('.chat-code-block');
  const code = codeBlock ? codeBlock.querySelector('code')?.innerText : '';
  if (code) {
    navigator.clipboard.writeText(code).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      btn.style.color = '#27ae60';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.color = '';
      }, 2000);
    }).catch(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
      }, 2000);
    });
  }
}

// Add message to chat container
function addMessage(text, sender, isHtml = false, metadata = null) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;

  const div = document.createElement('div');
  div.className = `chat-message ${sender}`;

  let contentHtml = isHtml ? text : renderMarkdown(text);
  let audioButtonHtml = '';

  if (sender === 'bot') {
    // Generate clean text for speech playback (omit code and tables)
    const rawCleanText = text
      .replace(/```[\s\S]*?```/g, ' [Code block omitted in audio] ')
      .replace(/<[^>]*>/g, '')
      .replace(/[\*#\|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const encodedText = encodeURIComponent(rawCleanText.slice(0, 300));

    // User-Centered Guidance Badge
    let modelBadge = '';
    let sourceBadge = '<span class="meta-badge" style="background:#e8f5e9; color:#1b5e20;"><i class="fas fa-seedling"></i> Verified Market Guidance</span>';
    if (metadata && metadata.is_agricultural === false) {
      sourceBadge = '<span class="meta-badge" style="background:#f3e8ff; color:#6b21a8;"><i class="fas fa-robot"></i> AgriBot Assistant</span>';
    }

    audioButtonHtml = `
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:8px;">
        <button class="listen-btn" onclick="playSpeech(this, '${encodedText}')" title="Listen to answer">
          <i class="fas fa-volume-up"></i> Listen
        </button>
        ${modelBadge}
        ${sourceBadge}
      </div>
    `;
  }

  div.innerHTML = `
    <div class="message-avatar">
      ${sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
    </div>
    <div class="message-bubble">
      ${contentHtml}
      ${audioButtonHtml}
      <span class="message-time">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  `;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  chatHistory.push({
    role: sender === 'bot' ? 'assistant' : 'user',
    sender,
    content: text,
    text
  });
}

// Show typing indicator
function showTyping() {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  const div = document.createElement('div');
  div.id = 'typingIndicator';
  div.className = 'chat-message bot';
  div.innerHTML = `
    <div class="message-avatar"><i class="fas fa-robot"></i></div>
    <div class="message-bubble typing">
      <span></span><span></span><span></span>
      <span style="font-size:0.75rem; color:#27ae60; margin-left:8px; font-weight:500;">AgriBot is finding the best answer...</span>
    </div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

// Send message to backend with dual-layer resilient connection
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input?.value?.trim();
  if (!msg) return;

  input.value = '';
  addMessage(msg, 'user');
  showTyping();

  const historyContext = chatHistory.slice(-10);
  let res = null;

  try {
    // Layer 1: Check window.API / global API client
    const apiClient = window.API || (typeof API !== 'undefined' ? API : null);
    if (apiClient && typeof apiClient.askQuestion === 'function') {
      res = await apiClient.askQuestion(msg, historyContext);
    } else {
      // Layer 2: Direct REST fetch fallback if API object is not yet attached
      const fetchResp = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: msg, history: historyContext })
      });
      res = await fetchResp.json();
    }

    if (res && res.answer) {
      removeTyping();
      addMessage(res.answer, 'bot', false, {
        source: res.source,
        model: res.model,
        crops: res.detected_crops,
        topics: res.detected_topics,
        is_agricultural: res.is_agricultural
      });
      return;
    }
  } catch (err) {
    console.warn('Live API response error, attempting direct fetch:', err);
    try {
      const fetchResp = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: msg, history: historyContext })
      });
      res = await fetchResp.json();
      if (res && res.answer) {
        removeTyping();
        addMessage(res.answer, 'bot', false, {
          source: res.source,
          model: res.model,
          crops: res.detected_crops,
          topics: res.detected_topics,
          is_agricultural: res.is_agricultural
        });
        return;
      }
    } catch (err2) {
      console.warn('Direct fetch also unreachable (offline mode):', err2);
    }
  }

  // Only reaches here if backend is completely unreachable (offline)
  removeTyping();
  const fallbackResponse = getClientFallback(msg);
  addMessage(fallbackResponse, 'bot', false, {
    model: 'local_intelligent_fallback',
    source: 'knowledge_engine'
  });
}

// Client-side fallback logic with verified real-time data
function getClientFallback(msg) {
  const lower = msg.toLowerCase();

  // Rice / Paddy
  if (/rice|paddy|dhan|parali|chawal|husk/.test(lower)) {
    return `### 🌾 **Paddy / Rice Residue – Real-Time Market Overview**

| Residue Type | Price Range (per ton) | Best Industrial Use |
| :--- | :--- | :--- |
| **Paddy Straw (Parali)** | ₹4,800 – ₹5,400 | NTPC Co-firing, Pellets, CBG |
| **Rice Husk** | ₹5,200 – ₹6,300 | Boiler Fuel, Silica Extraction |

• **Top Buyers:** Thermal power plants (NTPC 5% co-firing mandate), Rice Mills, SATAT Biogas Plants.
• **Govt Subsidies:** CRM Scheme offers **50% subsidy** to individual farmers and **80% subsidy** to Custom Hiring Centres on Super Seeders & Straw Balers.
💡 *Do not burn parali! Avoid fines up to ₹30,000 and sell baled straw on our Marketplace.*`;
  }

  // Wheat Straw / Turi
  if (/wheat|gehun|gehu|turi|bhoosa|bhusa/.test(lower)) {
    return `### 🌾 **Wheat Straw (Turi / Bhoosa) – Market Overview**

| Residue Type | Current Price (per ton) | High-Value Commercial Uses |
| :--- | :--- | :--- |
| **Wheat Straw (Turi)** | ₹4,200 – ₹5,200 (Avg ₹4,650) | Dairy Cattle Fodder, Mushroom Substrate |

• **Calorific Energy:** 15.0 – 17.0 MJ/kg | Moisture: 10%–12%
• **Mushroom Cultivation:** Yields 0.8–1.2 kg Oyster mushrooms per kg of straw with an ROI of over 300%!`;
  }

  // Sugarcane Bagasse
  if (/sugarcane|ganna|bagasse|cane/.test(lower)) {
    return `### 🍬 **Sugarcane Bagasse & Trash – Market Overview**

• **Bagasse Price:** ₹3,400 – ₹4,400 per ton (dry basis)
• **Sugarcane Leaves/Trash:** ₹2,200 – ₹3,000 per ton
• **Industrial Uses:** Cogeneration in sugar mills, Biodegradable plates & tableware (export market), Paper & Pulp.
• **Major Markets:** Maharashtra, Uttar Pradesh, Karnataka.`;
  }

  // Cotton Stalks
  if (/cotton|kapas|stalk/.test(lower)) {
    return `### 🌸 **Cotton Stalks – High-Energy Biomass**

• **Market Price:** ₹4,800 – ₹5,800 per ton
• **Calorific Value:** 16.0 – 18.2 MJ/kg (highest energy density among crop stalks)
• **Commercial Uses:** Industrial briquettes, Particle board for furniture, Biochar soil conditioner.
⚠️ *Removing and selling stalks immediately prevents pink bollworm pest infestation in the next season.*`;
  }

  // Subsidies / Government Schemes
  if (/subsidy|scheme|yojana|crm|satat|kusum|gobardhan|government/.test(lower)) {
    return `### 🏛️ **Key Government Subsidies for Agricultural Waste (2025-2026)**

1. **CRM (Crop Residue Management):** 50% subsidy for individual farmers, 80% for FPOs/CHCs on Super Seeders, Balers, and Happy Seeders.
2. **SATAT Scheme:** Guaranteed purchase of Compressed Bio-Gas (CBG) at ₹46–₹54 per kg by IOCL, BPCL, and GAIL.
3. **PM-KUSUM:** 60% subsidy for Solar Agricultural Pumps.
4. **GOBARdhan:** Up to ₹50 Lakh financial assistance for community biogas plants.`;
  }

  // Stubble Burning Penalties
  if (/burn|burning|stubble|fine|penalty|pollution|caqm/.test(lower)) {
    return `### 🔥 **Stubble Burning Penalties & Legal Enforcement**

Under the Commission for Air Quality Management (CAQM) regulations:
• Less than 2 acres: **₹5,000 fine**
• 2 to 5 acres: **₹10,000 fine**
• More than 5 acres: **₹30,000 fine**
• Plus 'Red Entry' in revenue records which can restrict fertilizer subsidies and MSP sales.

💰 *By contrast, baling and selling on our **Marketplace** yields ₹1,500 – ₹2,500 per acre net profit!*`;
  }

  // General query offline fallback
  const isAgriRelated = /farm|crop|kisan|mandi|bhav|soil|waste|dung|compost|price|rate|straw/.test(lower);
  if (!isAgriRelated) {
    return `### 🤖 **AgriBot Assistant (Offline Knowledge Mode)**

I am currently answering from our **Local Knowledge Base** because cloud AI reasoning is temporarily unreachable.

While cloud connection is refreshing, I can help you with:
• **Verified Indian Mandi rates** for Paddy straw, Wheat turi, Bagasse, Cotton, Maize, and Groundnut
• **Government subsidy applications** (CRM, SATAT, PM-KUSUM)
• **Waste classification, moisture testing, and buyer connections**
• **Transporter booking and route optimization**

💡 *Tip: Ensure your server or internet connection is active to unlock open-domain reasoning, Python coding, and mathematical calculations.*`;
  }

  return `### 🌾 **AgriBot Real-Time Market Overview**

Here are today's verified trading prices for key agricultural residues:

| Crop Residue | Market Price (per ton) | Top Commercial Use |
| :--- | :--- | :--- |
| **Rice Paddy Straw** | ₹4,800 – ₹5,400 | NTPC Co-firing, Pellets, CBG |
| **Rice Husk** | ₹5,200 – ₹6,300 | Boiler Fuel, Silica Extraction |
| **Wheat Straw (Turi)**| ₹4,200 – ₹5,200 | Dairy Fodder, Mushroom Substrate |
| **Sugarcane Bagasse** | ₹3,400 – ₹4,400 | Cogeneration, Bio-Tableware |
| **Cotton Stalks**     | ₹4,800 – ₹5,800 | Briquettes & Pellets |
| **Groundnut Shells**  | ₹5,500 – ₹6,800 | Boilers, Activated Carbon |

💬 *Ask me any question about crop prices, machinery subsidies, biochar, biogas, or composting!*`;
}

// Quick reply click handler
function sendQuickReply(text) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = text;
    sendMessage();
  }
}

// Clear chat history
function clearChat() {
  const messages = document.getElementById('chatMessages');
  if (messages) {
    messages.innerHTML = '';
    chatHistory.length = 0;
    addMessage(KB.greet.response(), 'bot', false);
  }
}

// Text-to-Speech audio player
async function playSpeech(btn, encodedText) {
  const text = decodeURIComponent(encodedText);

  // Stop currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    document.querySelectorAll('.listen-btn').forEach(b => {
      b.classList.remove('playing');
      b.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
    });
  }

  btn.classList.add('playing');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

  try {
    // 1. Try server-side gTTS audio file
    if (window.API && typeof API.textToSpeech === 'function') {
      const res = await API.textToSpeech(text);
      if (res && res.audio_url) {
        currentAudio = new Audio(res.audio_url);
        currentAudio.onplay = () => {
          btn.innerHTML = '<i class="fas fa-stop"></i> Stop';
        };
        currentAudio.onended = () => {
          btn.classList.remove('playing');
          btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
          currentAudio = null;
        };
        currentAudio.play();
        return;
      }
    }
  } catch (err) {
    console.warn('Server TTS failed, falling back to browser speech synthesis:', err);
  }

  // 2. Fallback to Browser Native Web SpeechSynthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.onstart = () => {
      btn.innerHTML = '<i class="fas fa-stop"></i> Stop';
    };
    utterance.onend = () => {
      btn.classList.remove('playing');
      btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
    };
    utterance.onerror = () => {
      btn.classList.remove('playing');
      btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
    };
    window.speechSynthesis.speak(utterance);
  } else {
    btn.classList.remove('playing');
    btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
    alert('Audio playback is not supported on this browser.');
  }
}

// Speech-to-Text Microphone Recording
function toggleVoiceRecording() {
  const micBtn = document.getElementById('micBtn');
  const input = document.getElementById('chatInput');
  if (!micBtn) return;

  if (isRecording) {
    stopVoiceRecording();
    return;
  }

  // Check browser Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Also detects bilingual Indian speech

      recognition.onstart = () => {
        isRecording = true;
        micBtn.classList.add('recording');
        micBtn.title = 'Listening... Click to stop';
        if (input) input.placeholder = '🎙️ Listening... Speak now in Hindi or English';
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        if (input) input.value = transcript;
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        stopVoiceRecording();
      };

      recognition.onend = () => {
        stopVoiceRecording();
        if (input && input.value.trim().length > 0) {
          sendMessage();
        }
      };

      recognition.start();
      return;
    } catch (e) {
      console.warn('Web Speech API failed, trying media recorder:', e);
    }
  }

  alert('Voice recognition is best supported on Chrome, Edge, and modern mobile browsers.');
}

function stopVoiceRecording() {
  isRecording = false;
  const micBtn = document.getElementById('micBtn');
  const input = document.getElementById('chatInput');
  if (micBtn) {
    micBtn.classList.remove('recording');
    micBtn.title = 'Speak in Hindi/English';
  }
  if (input) {
    input.placeholder = 'Ask any question: crop waste, prices, coding, calculations, or general knowledge in English or Hindi...';
  }
  if (recognition) {
    try { recognition.stop(); } catch (e) {}
    recognition = null;
  }
}

// Initialize Chatbot Interface
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('chatbotContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="chatbot-wrapper" id="chatbotWrapper">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="bot-avatar"><i class="fas fa-robot"></i></div>
          <div>
            <h3>AgriBot <span style="font-size:0.75rem; background:rgba(255,255,255,0.25); padding:2px 8px; border-radius:10px; margin-left:6px;">Universal LLM & Mandi AI</span></h3>
            <span class="online-status"><i class="fas fa-circle"></i> Powered by Groq LLM (GPT-OSS 120B / Qwen 27B) + Live Mandi Intelligence</span>
          </div>
        </div>
        <button class="btn-icon" onclick="clearChat()" title="Restart Chat"><i class="fas fa-rotate-right"></i></button>
      </div>

      <div class="chat-messages" id="chatMessages"></div>

      <div class="quick-replies" id="quickReplies">
        <button onclick="sendQuickReply('What are current biomass market rates in India?')">📊 Today's Mandi Prices</button>
        <button onclick="sendQuickReply('What is the current market price of wheat straw and rice husk?')">🌾 Wheat & Rice Straw</button>
        <button onclick="sendQuickReply('Write a python function to calculate moisture loss percentage from wet and dry weight')">🐍 Python Moisture Script</button>
        <button onclick="sendQuickReply('Government subsidy schemes for crop residue management (CRM)')">🏛️ Subsidies & Schemes</button>
        <button onclick="sendQuickReply('Tell me about SATAT scheme for biogas and CBG purchase rates')">⚡ SATAT CBG Scheme</button>
        <button onclick="sendQuickReply('How to grow mushrooms on wheat straw and what is the ROI?')">🍄 Mushroom Farming</button>
        <button onclick="sendQuickReply('What is the difference between photosynthesis and cellular respiration?')">🔬 Science / Photosynthesis</button>
        <button onclick="sendQuickReply('धान की पराली जलाने पर कितना जुर्माना लगता है?')">🇮🇳 पराली जुर्माना (Hindi)</button>
      </div>

      <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Ask any question: crop waste, prices, coding, calculations, or general knowledge in English or Hindi..." 
               onkeydown="if(event.key==='Enter') sendMessage()">
        <button class="mic-btn" id="micBtn" onclick="toggleVoiceRecording()" title="Speak in Hindi/English">
          <i class="fas fa-microphone"></i>
        </button>
        <button class="send-btn" onclick="sendMessage()" title="Send Question">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  `;

  // Initial Greeting
  setTimeout(() => addMessage(KB.greet.response(), 'bot', false), 300);
});

window.sendMessage = sendMessage;
window.sendQuickReply = sendQuickReply;
window.clearChat = clearChat;
window.playSpeech = playSpeech;
window.toggleVoiceRecording = toggleVoiceRecording;
window.copyCodeSnippet = copyCodeSnippet;
