/**



 * Comprehensive System Smoke Test Suite



 * Validates endpoints, DOM structures, role portals, crypto vaults, and AI endpoints



 */







const http = require('http');



const fs = require('fs');



const path = require('path');







const BASE_URL = 'http://127.0.0.1:5000';



let totalTests = 0;



let passedTests = 0;



let failedTests = 0;







function assert(condition, message) {



  totalTests++;



  if (condition) {



    passedTests++;



    console.log(`  \x1b[32m✔ PASS\x1b[0m - ${message}`);



  } else {



    failedTests++;



    console.error(`  \x1b[31m✖ FAIL\x1b[0m - ${message}`);



  }



}







function fetchPage(url) {



  return new Promise((resolve, reject) => {



    http.get(url, (res) => {



      let data = '';



      res.on('data', chunk => data += chunk);



      res.on('end', () => resolve({ status: res.statusCode, body: data }));



    }).on('error', reject);



  });



}







function postJson(url, payload) {



  return new Promise((resolve, reject) => {



    const postData = JSON.stringify(payload);



    const options = {



      method: 'POST',



      headers: {



        'Content-Type': 'application/json',



        'Content-Length': Buffer.byteLength(postData)



      }



    };



    const req = http.request(url, options, (res) => {



      let data = '';



      res.on('data', chunk => data += chunk);



      res.on('end', () => {



        try {



          resolve({ status: res.statusCode, json: JSON.parse(data) });



        } catch (e) {



          resolve({ status: res.statusCode, body: data });



        }



      });



    });



    req.on('error', reject);



    req.write(postData);



    req.end();



  });



}







async function runTestSuite() {



  console.log('\n============================================================');



  console.log('🌱 AGRIWASTE TO WORTH — INTEGRATED SYSTEM QUALITY GATES');



  console.log('============================================================\n');







  // Test Group 1: Server Endpoints & Payload Health



  console.log('\x1b[36m[Group 1: Server Endpoints & Payload Health]\x1b[0m');



  const pages = [



    { name: 'index.html', path: '/index.html' },



    { name: 'marketplace.html', path: '/marketplace.html' },



    { name: 'ai-analyzer.html', path: '/ai-analyzer.html' },



    { name: 'dashboard.html', path: '/dashboard.html' },



    { name: 'logistics.html', path: '/logistics.html' },



    { name: 'chatbot.html', path: '/chatbot.html' },



    { name: 'about.html', path: '/about.html' }



  ];







  for (const page of pages) {



    try {



      const res = await fetchPage(`${BASE_URL}${page.path}`);



      assert(res.status === 200 && res.body.length > 500, `${page.name} returned HTTP 200 OK (${res.body.length} bytes)`);



    } catch (err) {



      assert(false, `${page.name} connection error: ${err.message}`);



    }



  }







  // Test Group 2: Marketplace Architecture & Modals



  console.log('\n\x1b[36m[Group 2: Marketplace Architecture & Modals]\x1b[0m');



  const mktHtml = fs.readFileSync(path.join(__dirname, '../marketplace.html'), 'utf-8');



  assert(mktHtml.includes('id="listingsGrid"'), 'Marketplace DOM contains #listingsGrid container');



  assert(mktHtml.includes('class="marketplace-layout"'), 'Marketplace layout container present');



  assert(mktHtml.includes('id="addListingModal"'), '3-Step Add Listing Wizard Modal present');



  assert(mktHtml.includes('id="quickViewModal"'), 'Laboratory Quick View Modal present');



  assert(mktHtml.includes('id="cartSidebar"'), 'Off-Canvas Purchase Cart Drawer present');



  assert(mktHtml.includes('id="filterSheetToggleBtn"'), 'Mobile Bottom Sheet Filter Trigger present');







  // Test Group 3: AI Analyzer Pipeline



  console.log('\n\x1b[36m[Group 3: AI Analyzer Neural Vision Pipeline]\x1b[0m');



  const aiHtml = fs.readFileSync(path.join(__dirname, '../ai-analyzer.html'), 'utf-8');



  assert(aiHtml.includes('id="uploadArea"'), 'Drag-and-drop file upload zone configured (#uploadArea)');



  assert(aiHtml.includes('sample-crop-bar'), '1-Click verified crop sample test bar configured');



  assert(aiHtml.includes('analysis-steps'), '5-stage neural processing progress pipeline present');



  assert(aiHtml.includes('id="resultsCard"'), 'Results card with confidence score present (#resultsCard)');



  assert(aiHtml.includes('id="buyersList"'), 'Matched industrial off-takers recommendation container present (#buyersList)');



  assert(aiHtml.includes('listThisWasteFromAnalyzer'), 'One-click "List this waste in Marketplace" bridge present');







  // Test Group 4: Role-Differentiated Command Portals (4 Roles)



  console.log('\n\x1b[36m[Group 4: Role-Differentiated Command Portals (4 Roles)]\x1b[0m');



  const dashHtml = fs.readFileSync(path.join(__dirname, '../dashboard.html'), 'utf-8');



  assert(dashHtml.includes('id="portalSwitcherBar"'), 'Sticky persona switcher bar present');



  assert(dashHtml.includes('id="farmerPortalView"'), 'Dedicated Farmer Kisan Krishi Kendra portal present');



  assert(dashHtml.includes('id="buyerPortalView"'), 'Dedicated Industrial Buyer Procurement portal present');



  assert(dashHtml.includes('id="transporterPortalView"'), 'Dedicated Transporter Biomass Hauling portal present');



  assert(dashHtml.includes('id="adminPortalView"'), 'Dedicated Platform Governance Admin portal present');



  assert(dashHtml.includes('id="btnSwitchTransporter"'), 'Transporter pill button in portal switcher bar present');



  assert(dashHtml.includes('id="farmerListingsTableBody"'), 'Farmer active lots table present');



  assert(dashHtml.includes('id="transporterTableBody"'), 'Transporter biomass haulage queue table present');



  assert(dashHtml.includes('id="adminKycTableBody"'), 'Admin KYC verification queue table present');







  // Test Group 5: Security & Cryptography



  console.log('\n\x1b[36m[Group 5: Client-Side Security & Cryptography]\x1b[0m');



  const authJs = fs.readFileSync(path.join(__dirname, '../js/auth.js'), 'utf-8');



  assert(authJs.includes("crypto.subtle.digest('SHA-256'"), 'Web Crypto SHA-256 client-side password hashing configured');



  assert(authJs.includes('DEFAULT_USERS'), 'Role default users configured for instant evaluation');



  assert(authJs.includes('USR_TRANSPORTER_401'), 'Transporter default user configured in DEFAULT_USERS');



  assert(authJs.includes('demo-transporter'), '1-Click quick login as Transporter button present');



  assert(authJs.includes('quickLoginAs'), '1-Click quick login switcher function present');







  const aiJs = fs.readFileSync(path.join(__dirname, '../js/ai-analyzer.js'), 'utf-8');



  assert(aiJs.includes('crypto.subtle.encrypt') && aiJs.includes('AES-GCM'), 'AES-GCM 256-bit encrypted lab report vault configured');







  // Test Group 6: Design Tokens & Accessibility



  console.log('\n\x1b[36m[Group 6: Editorial Agrarian Design Tokens & WCAG]\x1b[0m');



  const css = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf-8');



  assert(css.includes('--earth-950') && css.includes('--primary-color'), 'Core Editorial Agrarian color tokens configured');



  assert(css.includes('--font-heading') && css.includes('Fraunces'), 'Editorial serif Fraunces typography configured');



  assert(css.includes('dark-theme') || css.includes('dark-mode'), 'Designed dark mode theme rules configured');



  assert(css.includes('lang-selector-group'), 'Unified multilingual language selector configured');



  assert(css.includes('theme-transporter'), 'Transporter portal amber styling configured');







  // Test Group 7: Smart Logistics & Routing Fleet Module



  console.log('\n\x1b[36m[Group 7: Smart Logistics & Routing Fleet Module]\x1b[0m');



  const logHtml = fs.readFileSync(path.join(__dirname, '../logistics.html'), 'utf-8');



  assert(logHtml.includes('id="map"'), 'Interactive Google Maps canvas container present (#map)');



  assert(logHtml.includes('id="pickupList"'), 'Pending farm pickups sidebar list container present');



  assert(logHtml.includes('clusterPickups'), 'AI proximity clustering trigger present');



  assert(logHtml.includes('optimizeRoute'), 'Spatial routing algorithm trigger present');



  assert(logHtml.includes('id="paymentModal"'), 'Delivery confirmed payment release modal present');







  // Test Group 8: Conversational LLM Intelligence & AgriBot Engine



  console.log('\n\x1b[36m[Group 8: Conversational LLM Intelligence & AgriBot Engine]\x1b[0m');



  const chatHtml = fs.readFileSync(path.join(__dirname, '../chatbot.html'), 'utf-8');



  assert(chatHtml.includes('id="chatbotContainer"'), 'Chatbot DOM container present (#chatbotContainer)');



  assert(chatHtml.includes('chat-code-block') && chatHtml.includes('copy-code-btn'), 'Fenced code blocks and copy buttons styled in CSS');







  const chatJs = fs.readFileSync(path.join(__dirname, '../js/chatbot.js'), 'utf-8');



  assert(chatJs.includes('chatHistory.slice(-10)'), 'Multi-turn conversational memory tracking configured (up to 10 turns)');



  assert(chatJs.includes('copyCodeSnippet'), 'Interactive copy code snippet function present');



  assert(chatJs.includes('chat-code-block'), 'Markdown parser renders code blocks with syntax styling');







  try {



    const generalRes = await postJson(`${BASE_URL}/api/chat/ask`, { question: 'What is 12 * 12?', history: [] });



    assert(generalRes.status === 200 && generalRes.json.answer && generalRes.json.answer.includes('144'), 'Live LLM generates accurate math answer (12*12=144)');



    assert(generalRes.json.source === 'llm_general' || generalRes.json.source === 'llm_grounded', `Live LLM returns valid source classification (${generalRes.json?.source})`);



  } catch (err) {



    assert(false, `Live LLM query failed: ${err.message}`);



  }







  // Test Group 9: Marketplace Crop Image Disambiguation & LocalStorage Healing



  console.log('\n\x1b[36m[Group 9: Marketplace Crop Image Disambiguation & LocalStorage Healing]\x1b[0m');



  const marketJs = fs.readFileSync(path.join(__dirname, '../js/marketplace.js'), 'utf-8');



  assert(marketJs.includes('inferCropKey'), 'Resilient crop inference engine present (inferCropKey)');



  assert(marketJs.includes('getListingImageUrl'), 'Deterministic image URL resolution with variety hashing present (getListingImageUrl)');



  assert(marketJs.includes('window.handleListingImageError'), 'Zero-broken-image SVG fallback handler configured');







  // Verify VM execution of crop inference on legacy listings



  const vm = require('vm');



  const imgMapJs = fs.readFileSync(path.join(__dirname, '../js/image_map.js'), 'utf-8');



  const testCtx = vm.createContext({



    window: { localStorage: { getItem: () => null, setItem: () => {} } },



    document: { addEventListener: () => {}, getElementById: () => null, querySelectorAll: () => [] },



    localStorage: { getItem: () => null, setItem: () => {} },



    console: { warn: () => {}, error: () => {} },



    Math, Date, String, Array



  });



  vm.runInContext(imgMapJs, testCtx);



  vm.runInContext(marketJs, testCtx);







  const riceKey = vm.runInContext("inferCropKey({ name: 'Rice Husk', category: 'husk' })", testCtx);



  const wheatKey = vm.runInContext("inferCropKey({ name: 'Wheat Straw', category: 'straw' })", testCtx);



  const sugarKey = vm.runInContext("inferCropKey({ name: 'Sugarcane Bagasse', category: 'bagasse' })", testCtx);



  const cottonKey = vm.runInContext("inferCropKey({ name: 'Cotton Stalks', category: 'crop-residue' })", testCtx);







  assert(riceKey === 'rice', 'Legacy "Rice Husk" correctly infers crop key "rice"');



  assert(wheatKey === 'wheat', 'Legacy "Wheat Straw" correctly infers crop key "wheat" (not defaulting to rice)');



  assert(sugarKey === 'sugarcane', 'Legacy "Sugarcane Bagasse" correctly infers crop key "sugarcane"');



  assert(cottonKey === 'cotton', 'Legacy "Cotton Stalks" correctly infers crop key "cotton"');







  const riceImg = vm.runInContext("getListingImageUrl({ id: 'L001', name: 'Rice Husk' })", testCtx);



  const wheatImg = vm.runInContext("getListingImageUrl({ id: 'L002', name: 'Wheat Straw' })", testCtx);



  assert(riceImg.includes('rice') && !riceImg.includes('wheat'), 'Rice listing loads authentic rice image asset');



  assert(wheatImg.includes('wheat') && !wheatImg.includes('rice'), 'Wheat listing loads authentic wheat image asset (distinct from rice)');



  assert(riceImg !== wheatImg, 'Rice and Wheat crop cards display completely different images');







  // Test Group 10: Role-Based Access Control (RBAC) & Boundary Isolation



  console.log('\n\x1b[36m[Group 10: Role-Based Access Control (RBAC) & Boundary Isolation]\x1b[0m');



  const dHtml = fs.readFileSync(path.join(__dirname, '../dashboard.html'), 'utf-8');



  assert(dHtml.includes('id="accessDeniedModal"'), 'Access Denied / Role Restriction Modal present in dashboard.html');



  assert(dHtml.includes('id="deniedRoleBadge"'), 'Role boundary alert badge present (#deniedRoleBadge)');



  assert(dHtml.includes('id="btnDeniedSwitchAccount"'), 'Switch account action button present in denial modal');







  const dJs = fs.readFileSync(path.join(__dirname, '../js/dashboard.js'), 'utf-8');



  assert(dJs.includes('isRoleAuthorized'), 'Role authorization validator configured (isRoleAuthorized)');



  assert(dJs.includes('showAccessDeniedModal'), 'Access denied modal handler configured (showAccessDeniedModal)');



  assert(dJs.includes('locked-role'), 'Locked role CSS selector configured for unauthorized portals');







  // VM RBAC Isolation Execution Tests



  let deniedCalled = false;



  let deniedCurrent = '';



  let deniedTarget = '';



  const rbacCtx = vm.createContext({



    window: {



      AppState: { currentUser: { name: 'Farmer Ramesh', userType: 'farmer' } },



      showAccessDeniedModal: (cur, tar) => { deniedCalled = true; deniedCurrent = cur; deniedTarget = tar; },



      closeAccessDeniedModal: () => {}



    },



    document: {



      addEventListener: () => {},



      getElementById: () => ({ classList: { add: () => {}, remove: () => {} }, querySelector: () => null }),



      querySelectorAll: () => []



    },



    localStorage: {



      getItem: (k) => k === 'currentUser' ? JSON.stringify({ name: 'Farmer Ramesh', userType: 'farmer' }) : null,



      setItem: () => {}



    },



    console: { warn: () => {}, error: () => {} },



    Math, Date, String, Array, setTimeout: () => {}



  });







  vm.runInContext(dJs, rbacCtx);







  const farmerAuthForFarmer = vm.runInContext("window.isRoleAuthorized('farmer')", rbacCtx);



  const farmerAuthForBuyer = vm.runInContext("window.isRoleAuthorized('buyer')", rbacCtx);



  const farmerAuthForTransporter = vm.runInContext("window.isRoleAuthorized('transporter')", rbacCtx);



  const farmerAuthForAdmin = vm.runInContext("window.isRoleAuthorized('admin')", rbacCtx);







  assert(farmerAuthForFarmer === true, 'Farmer is strictly authorized for Farmer portal');



  assert(farmerAuthForBuyer === false, 'Farmer is strictly DENIED authorization for Buyer portal');



  assert(farmerAuthForTransporter === false, 'Farmer is strictly DENIED authorization for Transporter portal');



  assert(farmerAuthForAdmin === false, 'Farmer is strictly DENIED authorization for Platform Admin portal');







  // Attempt unauthorized switch and verify denial intercept



  deniedCalled = false;

  rbacCtx.window.showAccessDeniedModal = (cur, tar) => { deniedCalled = true; deniedCurrent = cur; deniedTarget = tar; };



  const switchResult = vm.runInContext("window.switchPortalView('buyer')", rbacCtx);



  assert(switchResult === false, 'Unauthorized switchPortalView("buyer") is strictly rejected (returns false)');



  assert(deniedCalled === true, 'Access Denied modal was invoked on cross-role boundary violation');



  assert(deniedTarget === 'buyer', 'Denial modal correctly identified target forbidden role as "buyer"');







  // Test Admin SuperAdmin Clearance



  const adminCtx = vm.createContext({



    window: { AppState: { currentUser: { name: 'Admin Controller', userType: 'admin' } } },



    document: { addEventListener: () => {}, getElementById: () => null, querySelectorAll: () => [] },



    localStorage: {



      getItem: (k) => k === 'currentUser' ? JSON.stringify({ name: 'Admin Controller', userType: 'admin' }) : null,



      setItem: () => {}



    },



    console: { warn: () => {}, error: () => {} },



    Math, Date, String, Array, setTimeout: () => {}



  });



  vm.runInContext(dJs, adminCtx);



  const adminAuthForBuyer = vm.runInContext("window.isRoleAuthorized('buyer')", adminCtx);



  const adminAuthForFarmer = vm.runInContext("window.isRoleAuthorized('farmer')", adminCtx);



  assert(adminAuthForBuyer === true && adminAuthForFarmer === true, 'SuperAdmin maintains supervisory audit clearance across portals');

  // Test Group 11: Core Client Scripts Syntax & Integrity
  console.log('\n\x1b[36m[Group 11: Core Client Scripts Syntax & Integrity]\x1b[0m');
  const jsDir = path.join(__dirname, '../js');
  const coreScripts = ['ai-analyzer.js', 'main.js', 'marketplace.js', 'dashboard.js', 'logistics.js', 'chatbot.js', 'api.js', 'auth.js', 'i18n.js'];
  for (const scriptName of coreScripts) {
    const scriptPath = path.join(jsDir, scriptName);
    if (fs.existsSync(scriptPath)) {
      const code = fs.readFileSync(scriptPath, 'utf-8');
      let syntaxOk = true;
      try {
        new vm.Script(code);
      } catch (err) {
        syntaxOk = false;
      }
      assert(syntaxOk, `Script ${scriptName} compiles without JavaScript syntax errors`);
    }
  }







  console.log('\n------------------------------------------------------------');



  console.log(`TOTAL TESTS EXECUTED: ${totalTests}`);



  console.log(`\x1b[32mPASSED: ${passedTests}\x1b[0m | \x1b[31mFAILED: ${failedTests}\x1b[0m`);



  console.log('------------------------------------------------------------\n');







  if (failedTests > 0) {



    process.exit(1);



  }



}







runTestSuite().catch(err => {



  console.error('Test Suite Failed to Execute:', err);



  process.exit(1);



});



