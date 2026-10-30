const fs = require('fs');
const assert = require('assert');

console.log('\n============================================================');
console.log('🌐 TESTING MULTILINGUAL UI TRANSLATION & CONTRAST REMOVAL');
console.log('============================================================\n');

// 1. Check all 7 HTML files for single language switcher and absence of sunlight contrast
const htmlFiles = [
    'index.html',
    'marketplace.html',
    'ai-analyzer.html',
    'dashboard.html',
    'logistics.html',
    'chatbot.html',
    'about.html'
];

htmlFiles.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    
    // Check no sunlightContrastBtn
    assert(!html.includes('id="sunlightContrastBtn"'), `${file} must NOT contain sunlightContrastBtn`);
    assert(!html.includes('btn-contrast-toggle'), `${file} must NOT contain btn-contrast-toggle`);
    
    // Check mainLangSwitcher exists exactly once
    const matches = (html.match(/id="mainLangSwitcher"/g) || []).length;
    assert.strictEqual(matches, 1, `${file} must contain exactly ONE #mainLangSwitcher (found ${matches})`);
    
    // Check it has EN, Hindi, and Marathi buttons
    assert(html.includes('data-lang="en"'), `${file} #mainLangSwitcher must contain EN button`);
    assert(html.includes('data-lang="hi"'), `${file} #mainLangSwitcher must contain Hindi button`);
    assert(html.includes('data-lang="mr"'), `${file} #mainLangSwitcher must contain Marathi button`);
    
    console.log(`  ✔ PASS - ${file}: Single language switcher verified, sunlight contrast confirmed removed.`);
});

// 2. Test CSS has no contrast mode and has clean lang selector styles
const css = fs.readFileSync('css/style.css', 'utf8');
assert(!css.includes('theme-sunlight-contrast'), 'css/style.css must not contain theme-sunlight-contrast');
assert(!css.includes('btn-contrast-toggle'), 'css/style.css must not contain btn-contrast-toggle');
assert(css.includes('.lang-selector-group'), 'css/style.css must style .lang-selector-group');
console.log('  ✔ PASS - css/style.css: Contrast mode purged, lang-selector-group styled cleanly.');

// 3. Test js/main.js has no sunlight contrast logic
const mainJs = fs.readFileSync('js/main.js', 'utf8');
assert(!mainJs.includes('sunlightContrastBtn'), 'js/main.js must not reference sunlightContrastBtn');
assert(!mainJs.includes('agriwaste_sunlight'), 'js/main.js must not reference agriwaste_sunlight');
console.log('  ✔ PASS - js/main.js: Sunlight contrast listeners and storage purged.');

// 4. Test i18n.js comprehensive dictionary & global switchLanguage
const i18nJs = fs.readFileSync('js/i18n.js', 'utf8');
assert(!i18nJs.includes('toggleHighContrast'), 'js/i18n.js must not define toggleHighContrast');
assert(!i18nJs.includes('injectLanguageAndContrastControls'), 'js/i18n.js must not dynamically inject duplicate bars');
assert(i18nJs.includes('window.switchLanguage'), 'js/i18n.js must define window.switchLanguage');
assert(i18nJs.includes('translateFullPageContent'), 'js/i18n.js must provide full-page content translation');

console.log('  ✔ PASS - js/i18n.js: Full-page translation engine verified without duplicate controls.');

console.log('\n------------------------------------------------------------');
console.log('ALL MULTILINGUAL & CONTRAST PURGE TESTS PASSED SUCCESSFULLY!');
console.log('------------------------------------------------------------\n');

