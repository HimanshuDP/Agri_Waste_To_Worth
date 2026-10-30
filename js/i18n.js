// Multi-Language (EN / HI / MR) Engine & Voice Assistant
// AgriWaste to Worth — User-Centered Multilingual Localization
// ==============================================================================

const I18n = {
    currentLang: localStorage.getItem('appLang') || 'en',
    translations: {},
    observer: null,
    isTranslating: false,

    // Comprehensive translation dictionary for UI phrases
    phrases: {
        hi: {
            // Navigation & Global Header
            "Home": "होम",
            "Marketplace": "मंडी / बाज़ार",
            "AI Analyzer": "एआई फसल जांच",
            "AgriBot": "कृषि बॉट",
            "Dashboard": "डैशबोर्ड",
            "Logistics Fleet": "लॉजिस्टिक्स फ्लीट",
            "About": "हमारे बारे में",
            "Login": "लॉगिन",
            "Sign Up": "पंजीकरण",
            "Logout": "लॉगआउट",
            "Share on WhatsApp": "व्हाट्सएप पर साझा करें",
            "Guest": "अतिथि",
            "Farmer": "किसान",
            "Buyer": "खरीदार",
            "Transporter": "परिवहनकर्ता",
            "Admin": "प्रशासक",

            // Hero & Home Page
            "Transform Agricultural Stubble & Residue Into Guaranteed Profit": "फसल अवशेष और पराली को बनाएं मुनाफे का साधन",
            "Stop stubble burning. Connect directly with 20+ verified industrial biomass power plants, paper mills, and bio-CNG refineries with zero middlemen commission.": "पराली जलाना बंद करें। बिना किसी बिचौलिए के सीधे 20+ सत्यापित बायोमास बिजली संयंत्रों, पेपर मिलों और बायो-सीएनजी रिफाइनरियों से जुड़ें।",
            "I'm a Farmer": "मैं किसान हूं",
            "Sell Stubble & Residue at MSP": "पराली और अवशेष सही मूल्य पर बेचें",
            "I'm a Farmer (Sell Waste)": "मैं किसान हूं (पराली बेचें)",
            "I'm an Industrial Buyer": "मैं औद्योगिक खरीदार हूं",
            "Procure Consistent Factory Biomass": "कारखाने के लिए गुणवत्तापूर्ण बायोमास खरीदें",
            "I'm a Buyer (Buy Biomass)": "मैं खरीदार हूं (बायोमास खरीदें)",
            "Tons Saved From Burning": "टन पराली जलने से बचाई",
            "Direct Farmer Payouts": "किसानों को सीधा बैंक भुगतान",
            "Tons CO₂e Offset": "टन कार्बन उत्सर्जन घटाया",
            "1. Scan & Grade": "१. फोटो से जांचें",
            "2. Verified Bids": "२. सत्यापित बोलियां पाएं",
            "3. Direct Bank DBT": "३. सीधा बैंक खाता भुगतान",
            "Aligned with National Biomass Co-Firing Policy": "राष्ट्रीय बायोमास नीति के अनुरूप",
            "List Crop Waste": "नई पराली बेचें",
            "Take Photo / Scan": "फोटो खींचें / स्कैन करें",

            // Marketplace Page & Sidebar
            "Agricultural Residue Exchange": "कृषि अवशेष मंडी एवं बायोमास बाजार",
            "Direct farm-to-industry biomass trading with verified calorific testing, moisture benchmarks, and fair Mandi parity.": "गुणवत्ता परीक्षण, नमी जांच और निष्पक्ष मंडी भाव के साथ खेतों से कारखानों को सीधी बायोमास बिक्री।",
            "Filter Residues": "अवशेष छांटें",
            "Clear All": "सभी हटाएं",
            "Search Listings": "सूचियां खोजें",
            "Filter & Search Residues": "अवशेष खोजें व छांटें",
            "Residue Category": "अवशेष श्रेणी",
            "Straw Bales (पराली / भूसा)": "पराली के बंडल (पराली / भूसा)",
            "Crop Stalks & Stems (डंठल / अवशेष)": "फसल के डंठल व अवशेष",
            "Crop Stalks & Stover": "फसल के डंठल व तने",
            "Husk & Shells (भूसी / छिलके)": "भूसी और छिलके",
            "Husk & Shells": "भूसी और छिलके",
            "Sugarcane Bagasse (खोई)": "गन्ने की खोई",
            "Sugarcane Bagasse": "गन्ने की खोई",
            "Livestock Manure (गोबर / खाद)": "गोबर व जैविक खाद",
            "Livestock Manure": "गोबर व जैविक खाद",
            "Other Biomass": "अन्य बायोमास",
            "Price Range (₹/tonne)": "मूल्य सीमा (₹/टन)",
            "Price Range": "मूल्य सीमा",
            "Minimum Lot Volume": "न्यूनतम मात्रा",
            "Agro-Climatic Zone / State": "कृषि जलवायु क्षेत्र / राज्य",
            "All Regions (Pan India)": "सभी क्षेत्र (अखिल भारतीय)",
            "Moisture Constraint": "नमी सीमा",
            "All Moisture Levels": "सभी नमी स्तर",
            "≤ 15% (Optimal Boiler Dry)": "≤ 15% (बॉयलर हेतु सर्वोत्तम सूखा)",
            "≤ 20% (Standard Baled Dry)": "≤ 20% (मानक गांठ सूखा)",
            "Mandi Weather Insights": "मंडी मौसम जानकारी",
            "Apply Filters": "फिल्टर लागू करें",
            "Available Volume": "उपलब्ध मात्रा",
            "Lab Rating": "लैब रेटिंग",
            "Specs": "विवरण",
            "Add to PO": "ऑर्डर में जोड़ें",
            "Add to Cart": "ऑर्डर में जोड़ें",
            "Quick View": "त्वरित विवरण",
            "Moisture": "नमी",
            "Energy": "ऊर्जा मान",
            "tonnes": "टन",
            "tonne": "टन",
            "/tonne": "/टन",
            "Rice Husk": "चावल की भूसी",
            "Wheat Straw": "गेहूं की पराली/भूसा",
            "Cotton Stalks": "कपास के डंठल",
            "Mustard Husk": "सरसों की तूड़ी",
            "Corn Stover": "मक्के के डंठल",
            "Soybean Straw": "सोयाबीन भूसा",
            "Groundnut Shells": "मूंगफली के छिलके",
            "Paddy Straw": "धान की पराली",
            "Northern Corridor": "उत्तरी कृषि गलियारा",

            // AI Analyzer Page
            "AI-Powered Biomass Analyzer": "एआई फसल अवशेष विश्लेषक",
            "Upload crop photos for instant quality testing, moisture estimation, today's Mandi price, and verified buyer connections.": "फसल की फोटो अपलोड करें और तुरंत गुणवत्ता जांच, नमी का अनुमान, आज का मंडी भाव तथा सत्यापित खरीदार पाएं।",
            "Instant Crop Quality Scanner": "त्वरित फसल गुणवत्ता स्कैनर",
            "Fast crop identification, moisture estimation, and quality verification": "तेज फसल पहचान, नमी अनुमान और गुणवत्ता प्रमाणीकरण",
            "Drag & Drop Crop Photo Here": "फसल की फोटो यहां खींचकर लाएं",
            "or browse from files": "या डिवाइस से फोटो चुनें",
            "or browse files from device": "या डिवाइस से फोटो चुनें",
            "Supports JPG, PNG, WEBP (Max 10MB)": "JPG, PNG, WEBP समर्थित (अधिकतम 10MB)",
            "Analyze Crop Waste": "फसल अवशेष की जांच करें",
            "Select from Verified Sample Crops": "सत्यापित नमूना फसलों में से चुनें",
            "Detected Crop Residue": "पहचाना गया अवशेष",
            "Estimated Moisture": "अनुमानित नमी",
            "Calorific Energy Value": "ऊर्जा मान (Calorific)",
            "Quality Grade": "गुणवत्ता ग्रेड",
            "Today's Mandi Benchmark": "आज का मंडी भाव",
            "Recommended Buyer Uses": "अनुशंसित औद्योगिक उपयोग",
            "Create Direct Listing": "मंडी में बिक्री के लिए लगाएं",
            "List in Marketplace": "मंडी में बिक्री के लिए लगाएं",

            // Dashboard
            "Farmer Portal": "किसान पोर्टल",
            "Industrial Buyer Portal": "औद्योगिक खरीदार पोर्टल",
            "Transporter Biomass Hauling": "ट्रांसपोर्टर बायोमास फ्लीट",
            "Platform Governance Admin": "प्रशासक ऑडिट पोर्टल",
            "Overview": "अवलोकन",
            "Total Waste Diverted": "कुल बचाया गया अवशेष",
            "Total Farmer Earnings": "किसानों की कुल कमाई",
            "Active Lots on Offer": "सक्रिय बिक्री सूचियां",
            "Pending Industrial Orders": "लंबित औद्योगिक ऑर्डर",
            "Live Mandi Benchmarks": "लाइव मंडी भाव",
            "Recent Listings": "हाल की सूचियां",
            "Crop Type": "फसल प्रकार",
            "Quantity": "मात्रा",
            "Price": "मूल्य",
            "Location": "स्थान",
            "Status": "स्थिति",
            "Action": "कार्रवाई",
            "Active": "सक्रिय",
            "Pending": "लंबित",
            "In Transit": "पारगमन में",
            "Delivered": "पहुंच गया",
            "Completed": "पूर्ण",
            "Add New Waste Listing": "नई पराली सूची जोड़ें",

            // Logistics Fleet
            "Logistics Fleet Operations": "लॉजिस्टिक्स व वाहन संचालन",
            "Active Vehicles": "सक्रिय वाहन",
            "Delivered Today": "आज वितरित",
            "Available Capacity": "उपलब्ध क्षमता",
            "Assign Transporter": "ट्रांसपोर्टर नियुक्त करें",
            "Vehicle Number": "गाड़ी संख्या",
            "Driver Contact": "ड्राइवर संपर्क",

            // Chatbot & About
            "AgriBot - Agricultural Assistant": "एग्रीबॉट - कृषि सहायक",
            "Ask anything about crop waste, prices, logistics...": "फसल अवशेष, भाव या परिवहन के बारे में कुछ भी पूछें...",
            "Send": "भेजें",
            "Clear Chat": "चैट साफ करें",
            "About AgriWaste to Worth": "एग्रीवेस्ट टू वर्थ के बारे में",
            "Our Mission": "हमारा उद्देश्य",
            "Why Choose Us": "हमें क्यों चुनें",
            "Frequently Asked Questions": "अक्सर पूछे जाने वाले सवाल"
        },
        mr: {
            // Navigation & Global Header
            "Home": "मुख्यपृष्ठ",
            "Marketplace": "बाजारपेठ",
            "AI Analyzer": "एआय कचरा तपासणी",
            "AgriBot": "कृषी मित्र बॉट",
            "Dashboard": "डॅशबोर्ड",
            "Logistics Fleet": "वाहतूक व्यवस्था",
            "About": "माहिती",
            "Login": "लॉगिन",
            "Sign Up": "नोंदणी",
            "Logout": "लॉगआउट",
            "Share on WhatsApp": "व्हॉट्सॲपवर शेअर करा",
            "Guest": "पाहुणे",
            "Farmer": "शेतकरी",
            "Buyer": "खरेदीदार",
            "Transporter": "वाहतूकदार",
            "Admin": "प्रशासक",

            // Hero & Home Page
            "Transform Agricultural Stubble & Residue Into Guaranteed Profit": "शेती कचऱ्याचे रूपांतर करा हमखास नफ्यात",
            "Stop stubble burning. Connect directly with 20+ verified industrial biomass power plants, paper mills, and bio-CNG refineries with zero middlemen commission.": "कचरा जाळणे थांबवा. कोणत्याही मध्यस्थांशिवाय थेट २०+ बायोमास वीज प्रकल्प, कागद कारखाने आणि बायो-सीएनजी प्रकल्पांशी जोडा.",
            "I'm a Farmer": "मी शेतकरी आहे",
            "Sell Stubble & Residue at MSP": "कचरा आणि पेंढा योग्य भावात विका",
            "I'm a Farmer (Sell Waste)": "मी शेतकरी आहे (कचरा विका)",
            "I'm an Industrial Buyer": "मी औद्योगिक खरेदीदार आहे",
            "Procure Consistent Factory Biomass": "कारखान्यासाठी दर्जेदार बायोमास खरेदी करा",
            "I'm a Buyer (Buy Biomass)": "मी खरेदीदार आहे (बायोमास खरेदी करा)",
            "Tons Saved From Burning": "टन कचरा जाळण्यापासून वाचवला",
            "Direct Farmer Payouts": "शेतकऱ्यांना थेट मोबदला",
            "Tons CO₂e Offset": "टन कार्बन उत्सर्जन घटवले",
            "1. Scan & Grade": "१. फोटोद्वारे तपासणी",
            "2. Verified Bids": "२. वाजवी दर मिळवा",
            "3. Direct Bank DBT": "३. थेट बँक खात्यात पैसे",
            "Aligned with National Biomass Co-Firing Policy": "राष्ट्रीय बायोमास धोरणास सुसंगत",
            "List Crop Waste": "कचऱ्याची नोंदणी करा",
            "Take Photo / Scan": "फोटो काढा / तपासा",

            // Marketplace Page & Sidebar
            "Agricultural Residue Exchange": "शेती कचरा व बायोमास बाजारपेठ",
            "Direct farm-to-industry biomass trading with verified calorific testing, moisture benchmarks, and fair Mandi parity.": "प्रयोगशाळा तपासणी, ओलावा निकष आणि हमीभावासह शेतकऱ्यांकडून कारखान्यांना थेट बायोमास विक्री.",
            "Filter Residues": "कचरा निवडा",
            "Clear All": "सर्व हटवा",
            "Search Listings": "नोंदी शोधा",
            "Filter & Search Residues": "कचरा शोधा व निवडा",
            "Residue Category": "कचरा प्रकार / वर्ग",
            "Straw Bales (पराली / भूसा)": "पेंढ्याचे गठ्ठे (पराली / भुसा)",
            "Crop Stalks & Stems (डंठल / अवशेष)": "पिकांचे देठ व अवशेष",
            "Crop Stalks & Stover": "पिकांचे देठ व ताटे",
            "Husk & Shells (भूसी / छिलके)": "भुसा व टरफले",
            "Husk & Shells": "भुसा व टरफले",
            "Sugarcane Bagasse (खोई)": "उसाची मळी (खोई)",
            "Sugarcane Bagasse": "उसाची मळी (खोई)",
            "Livestock Manure (गोबर / खाद)": "शेणखत / सेंद्रिय खत",
            "Livestock Manure": "शेणखत / सेंद्रिय खत",
            "Other Biomass": "इतर बायोमास",
            "Price Range (₹/tonne)": "किंमत श्रेणी (₹/टन)",
            "Price Range": "किंमत श्रेणी",
            "Minimum Lot Volume": "किमान लॉट आकार",
            "Agro-Climatic Zone / State": "कृषी हवामान विभाग / राज्य",
            "All Regions (Pan India)": "सर्व राज्ये (भारतभर)",
            "Moisture Constraint": "ओलावा मर्यादा",
            "All Moisture Levels": "सर्व ओलावा पातळी",
            "≤ 15% (Optimal Boiler Dry)": "≤ 15% (बॉयलरसाठी उत्तम कोरडा)",
            "≤ 20% (Standard Baled Dry)": "≤ 20% (प्रमाणित गाठी कोरड्या)",
            "Mandi Weather Insights": "बाजार हवामान अंदाज",
            "Apply Filters": "फिल्टर लावा",
            "Available Volume": "उपलब्ध प्रमाण",
            "Lab Rating": "प्रयोगशाळा मानांकन",
            "Specs": "तपशील",
            "Add to PO": "ऑर्डर जोडा",
            "Add to Cart": "ऑर्डर जोडा",
            "Quick View": "तपशील पहा",
            "Moisture": "ओलावा",
            "Energy": "ऊर्जा मूल्य",
            "tonnes": "टन",
            "tonne": "टन",
            "/tonne": "/टन",
            "Rice Husk": "भाताचा कोंडा / भुसा",
            "Wheat Straw": "गव्हाचा पेंढा / भुसा",
            "Cotton Stalks": "कापसाची पराटी / देठ",
            "Mustard Husk": "मोहरीचा भुसा",
            "Corn Stover": "मक्याचे अवशेष",
            "Soybean Straw": "सोयाबीनचा भुसा",
            "Groundnut Shells": "भुईमुगाची टरफले",
            "Paddy Straw": "भाताचा पेंढा",
            "Northern Corridor": "उत्तर कृषी पट्टा",

            // AI Analyzer Page
            "AI-Powered Biomass Analyzer": "एआय पीक कचरा विश्लेषक",
            "Upload crop photos for instant quality testing, moisture estimation, today's Mandi price, and verified buyer connections.": "पिकाचा फोटो अपलोड करा आणि त्वरित गुणवत्ता, ओलावा, आजचा बाजारभाव व खात्रीशीर खरेदीदार मिळवा.",
            "Instant Crop Quality Scanner": "त्वरित पीक गुणवत्ता स्कॅनर",
            "Fast crop identification, moisture estimation, and quality verification": "जलद पीक ओळख, ओलावा अंदाज आणि गुणवत्ता प्रमाणीकरण",
            "Drag & Drop Crop Photo Here": "पिकाचा फोटो येथे टाका",
            "or browse from files": "किंवा डिव्हाइसमधून निवडा",
            "or browse files from device": "किंवा डिव्हाइसमधून निवडा",
            "Supports JPG, PNG, WEBP (Max 10MB)": "JPG, PNG, WEBP समर्थित (कमाल 10MB)",
            "Analyze Crop Waste": "कचऱ्याची तपासणी करा",
            "Select from Verified Sample Crops": "सत्यापित नमुना पिकांमधून निवडा",
            "Detected Crop Residue": "शोधलेला शेती कचरा",
            "Estimated Moisture": "अंदाजे ओलावा",
            "Calorific Energy Value": "ऊर्जा मूल्य (Calorific)",
            "Quality Grade": "गुणवत्ता श्रेणी",
            "Today's Mandi Benchmark": "आजचा बाजारभाव",
            "Recommended Buyer Uses": "शिफारस केलेले औद्योगिक उपयोग",
            "Create Direct Listing": "बाजारपेठेत विक्रीसाठी नोंदवा",
            "List in Marketplace": "बाजारपेठेत विक्रीसाठी नोंदवा",

            // Dashboard
            "Farmer Portal": "शेतकरी पोर्टल",
            "Industrial Buyer Portal": "औद्योगिक खरेदीदार पोर्टल",
            "Transporter Biomass Hauling": "वाहतूकदार फ्लीट पोर्टल",
            "Platform Governance Admin": "प्रशासक पोर्टल",
            "Overview": "आढावा",
            "Total Waste Diverted": "एकूण वाचवलेला कचरा",
            "Total Farmer Earnings": "शेतकऱ्यांची एकूण कमाई",
            "Active Lots on Offer": "सध्या उपलब्ध साठे",
            "Pending Industrial Orders": "प्रलंबित औद्योगिक ऑर्डर्स",
            "Live Mandi Benchmarks": "थेट बाजार भाव",
            "Recent Listings": "नुकत्याच नोंदवलेल्या नोंदी",
            "Crop Type": "पिकाचा प्रकार",
            "Quantity": "प्रमाण",
            "Price": "किंमत",
            "Location": "ठिकाण",
            "Status": "स्थिती",
            "Action": "कृती",
            "Active": "सक्रिय",
            "Pending": "प्रलंबित",
            "In Transit": "मार्गावर",
            "Delivered": "वितरित",
            "Completed": "पूर्ण",
            "Add New Waste Listing": "नवीन कचरा नोंदणी करा",

            // Logistics Fleet
            "Logistics Fleet Operations": "वाहतूक व्यवस्था व कामकाज",
            "Active Vehicles": "सक्रिय वाहने",
            "Delivered Today": "आज वितरित",
            "Available Capacity": "उपलब्ध क्षमता",
            "Assign Transporter": "वाहतूकदार नेमा",
            "Vehicle Number": "गाडी क्रमांक",
            "Driver Contact": "चालक संपर्क",

            // Chatbot & About
            "AgriBot - Agricultural Assistant": "अॅग्रीबॉट - कृषी सहाय्यक",
            "Ask anything about crop waste, prices, logistics...": "कचरा, भाव किंवा वाहतुकीबद्दल काहीही विचारा...",
            "Send": "पाठवा",
            "Clear Chat": "संभाषण साफ करा",
            "About AgriWaste to Worth": "आमच्याविषयी माहिती",
            "Our Mission": "आमचे ध्येय",
            "Why Choose Us": "आम्हाला का निवडावे",
            "Frequently Asked Questions": "सतत विचारले जाणारे प्रश्न"
        }
    },

    // Placeholders mapping
    placeholders: {
        hi: {
            "Search rice straw, bagasse, wheat turi...": "चावल की पराली, भूसा, खोई खोजें...",
            "Search by crop, district, seller...": "फसल, जिला या विक्रेता अनुसार खोजें...",
            "Min": "न्यूनतम",
            "Max": "अधिकतम",
            "Ask anything about crop waste, prices, logistics...": "फसल अवशेष, भाव या परिवहन के बारे में कुछ भी पूछें..."
        },
        mr: {
            "Search rice straw, bagasse, wheat turi...": "भाताचा पेंढा, उसाची मळी, भुसा शोधा...",
            "Search by crop, district, seller...": "पीक, जिल्हा किंवा विक्रेत्यानुसार शोधा...",
            "Min": "किमान",
            "Max": "कमाल",
            "Ask anything about crop waste, prices, logistics...": "कचरा, भाव किंवा वाहतुकीबद्दल काहीही विचारा..."
        }
    },

    async init() {
        try {
            const res = await fetch('data/translations.json');
            this.translations = await res.json();
        } catch (e) {
            console.warn('I18n: translations.json fetch failed, using internal dictionary fallback');
        }

        // Expose global language switch function
        window.switchLanguage = (lang) => this.setLanguage(lang);

        this.applyLanguage(this.currentLang);
        this.bindSwitcherControls();
        this.initializeVoiceSearch();
        this.setupMutationObserver();
    },

    setLanguage(lang) {
        if (!['en', 'hi', 'mr'].includes(lang)) return;
        this.currentLang = lang;
        localStorage.setItem('appLang', lang);
        document.documentElement.lang = lang;
        this.applyLanguage(lang);

        // Toast feedback
        if (window.showNotification) {
            const msgs = {
                en: 'Language set to English',
                hi: 'भाषा बदलकर हिंदी कर दी गई',
                mr: 'भाषा बदलून मराठी केली'
            };
            window.showNotification(msgs[lang], 'info');
        }
    },

    bindSwitcherControls() {
        document.querySelectorAll('.lang-btn, .btn-lang-toggle').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.setLanguage(lang);
                };
            }
        });
    },

    applyLanguage(lang) {
        this.isTranslating = true;

        // 1. Update language switcher button states
        document.querySelectorAll('.lang-btn, .btn-lang-toggle').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Translate explicit [data-i18n] elements
        const dict = (this.translations && this.translations[lang]) || {};
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (!el.dataset.origPlaceholder) el.dataset.origPlaceholder = el.placeholder;
                    el.placeholder = dict[key];
                } else {
                    if (!el.dataset.origText) el.dataset.origText = el.textContent;
                    el.textContent = dict[key];
                }
            } else if (lang === 'en' && el.dataset.origText) {
                el.textContent = el.dataset.origText;
            }
        });

        // 3. Full-page phrase translation for user interface elements
        this.translateFullPageContent(lang);

        this.isTranslating = false;
    },

    translateFullPageContent(lang) {
        const phraseMap = this.phrases[lang] || {};
        const placeholderMap = this.placeholders[lang] || {};

        // A. Translate Input Placeholders
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
            if (!input.dataset.origPlaceholder) {
                input.dataset.origPlaceholder = input.placeholder;
            }
            if (lang === 'en') {
                input.placeholder = input.dataset.origPlaceholder;
            } else {
                const orig = input.dataset.origPlaceholder.trim();
                if (placeholderMap[orig]) {
                    input.placeholder = placeholderMap[orig];
                } else if (phraseMap[orig]) {
                    input.placeholder = phraseMap[orig];
                }
            }
        });

        // B. Translate Select Options
        document.querySelectorAll('select option').forEach(opt => {
            if (!opt.dataset.origText) {
                opt.dataset.origText = opt.textContent;
            }
            if (lang === 'en') {
                opt.textContent = opt.dataset.origText;
            } else {
                const orig = opt.dataset.origText.trim();
                if (phraseMap[orig]) {
                    opt.textContent = phraseMap[orig];
                }
            }
        });

        // C. Target UI text containers (headings, buttons, links, labels, table headers, spans, small)
        const selectors = 'h1, h2, h3, h4, h5, h6, button, a, label, th, td, p, span, small, strong, .badge, .quality-pill';
        document.querySelectorAll(selectors).forEach(el => {
            // Skip elements inside scripts, style, or raw code
            if (['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(el.tagName)) return;
            // Skip elements that have specific data-i18n already handled
            if (el.hasAttribute('data-i18n')) return;

            // Only translate leaf or near-leaf elements (children length <= 1)
            const childElements = el.children;
            if (childElements.length === 0) {
                this.translateElementText(el, lang, phraseMap);
            } else if (childElements.length === 1 && childElements[0].tagName === 'I') {
                // Element with an icon (e.g. <button><i class="..."></i> Add to PO</button>)
                this.translateElementWithIcon(el, lang, phraseMap);
            }
        });
    },

    translateElementText(el, lang, phraseMap) {
        const text = el.textContent.trim();
        if (!text) return;

        if (!el.dataset.origText) {
            el.dataset.origText = text;
        }

        if (lang === 'en') {
            el.textContent = el.dataset.origText;
            return;
        }

        const orig = el.dataset.origText.trim();
        if (phraseMap[orig]) {
            el.textContent = phraseMap[orig];
            return;
        }

        // Substring / units translations (e.g. "200 tonnes", "12% Moisture")
        if (orig.includes('tonnes')) {
            el.textContent = orig.replace('tonnes', phraseMap['tonnes'] || 'टन');
        } else if (orig.includes('/tonne')) {
            el.textContent = orig.replace('/tonne', phraseMap['/tonne'] || '/टन');
        } else if (orig.includes('Moisture')) {
            el.textContent = orig.replace('Moisture', phraseMap['Moisture'] || 'नमी');
        } else if (orig.includes('Energy')) {
            el.textContent = orig.replace('Energy', phraseMap['Energy'] || 'ऊर्जा');
        }
    },

    translateElementWithIcon(el, lang, phraseMap) {
        const icon = el.querySelector('i');
        const iconHtml = icon ? icon.outerHTML : '';
        
        if (!el.dataset.origText) {
            // Extract text without icon HTML
            const clone = el.cloneNode(true);
            const cloneIcon = clone.querySelector('i');
            if (cloneIcon) cloneIcon.remove();
            el.dataset.origText = clone.textContent.trim();
        }

        const orig = el.dataset.origText.trim();
        if (lang === 'en') {
            el.innerHTML = iconHtml + (orig ? ' ' + orig : '');
            return;
        }

        const translated = phraseMap[orig] || orig;
        el.innerHTML = iconHtml + (translated ? ' ' + translated : '');
    },

    setupMutationObserver() {
        // Observe dynamic container updates (e.g. marketplace productsGrid, tables)
        const targetNodes = [
            document.getElementById('listingsGrid'),
            document.getElementById('farmerListingsTableBody'),
            document.getElementById('transporterTableBody'),
            document.getElementById('adminKycTableBody'),
            document.getElementById('chatMessages')
        ].filter(Boolean);

        if (targetNodes.length === 0) return;

        let debounceTimer = null;
        this.observer = new MutationObserver(() => {
            if (this.isTranslating || this.currentLang === 'en') return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.applyLanguage(this.currentLang);
            }, 80);
        });

        targetNodes.forEach(node => {
            this.observer.observe(node, { childList: true, subtree: false });
        });
    },

    translatePage() {
        this.applyLanguage(this.currentLang);
    },

    initializeVoiceSearch() {
        const searchInputs = document.querySelectorAll('.search-box input, input[name="search"], #searchInput, #listingSearch');
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        searchInputs.forEach(input => {
            if (input.parentElement && !input.parentElement.querySelector('.btn-voice-search')) {
                const voiceBtn = document.createElement('button');
                voiceBtn.type = 'button';
                voiceBtn.className = 'btn-voice-search';
                voiceBtn.title = 'Speak crop name (बोलकर खोजें)';
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';

                voiceBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const recognition = new SpeechRecognition();
                    recognition.lang = this.currentLang === 'hi' ? 'hi-IN' : (this.currentLang === 'mr' ? 'mr-IN' : 'en-IN');
                    recognition.interimResults = false;

                    voiceBtn.classList.add('recording');
                    if (window.showNotification) {
                        window.showNotification('Listening... बोलिए (Crop name/location)', 'info');
                    }

                    recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        input.value = transcript;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        voiceBtn.classList.remove('recording');
                        if (window.showNotification) {
                            window.showNotification(`Recognized: "${transcript}"`, 'success');
                        }
                    };

                    recognition.onerror = () => {
                        voiceBtn.classList.remove('recording');
                    };

                    recognition.onend = () => {
                        voiceBtn.classList.remove('recording');
                    };

                    recognition.start();
                });

                input.parentElement.style.position = 'relative';
                input.parentElement.appendChild(voiceBtn);
            }
        });
    }
};

window.I18n = I18n;

document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});
