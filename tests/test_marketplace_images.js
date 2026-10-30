const fs = require('fs');
const vm = require('vm');

// Mock browser window and DOM
const windowMock = {
    addEventListener: () => {},
    localStorage: {
        getItem: (k) => null,
        setItem: () => {}
    }
};

const context = vm.createContext({
    window: windowMock,
    document: {
        addEventListener: () => {},
        getElementById: () => null,
        querySelectorAll: () => []
    },
    localStorage: windowMock.localStorage,
    console: console,
    Math: Math,
    Date: Date,
    String: String,
    Array: Array
});

// Load image_map.js
const imgMapCode = fs.readFileSync('js/image_map.js', 'utf8');
vm.runInContext(imgMapCode, context);

// Load marketplace.js
const marketplaceCode = fs.readFileSync('js/marketplace.js', 'utf8');
vm.runInContext(marketplaceCode, context);

// Test legacy listings without imageKey
const legacyListings = [
    { id: 'L001', name: 'Rice Husk', category: 'husk', price: 5500, quantity: 150, location: 'Punjab' },
    { id: 'L002', name: 'Wheat Straw', category: 'straw', price: 4200, quantity: 200, location: 'Haryana' },
    { id: 'L003', name: 'Sugarcane Bagasse', category: 'bagasse', price: 3800, quantity: 300, location: 'Uttar Pradesh' },
    { id: 'L004', name: 'Cotton Stalks', category: 'crop-residue', price: 2500, quantity: 180, location: 'Maharashtra' },
    { id: 'L005', name: 'Corn Stover', category: 'crop-residue', price: 3200, quantity: 220, location: 'Karnataka' },
    { id: 'L006', name: 'Peanut Shells', category: 'husk', price: 4800, quantity: 120, location: 'Tamil Nadu' }
];

console.log("\n--- Testing Crop Image Resolution for Legacy Listings ---");
let allPass = true;
const expectedMap = {
    'L001': 'rice',
    'L002': 'wheat',
    'L003': 'sugarcane',
    'L004': 'cotton',
    'L005': 'maize',
    'L006': 'groundnut'
};

legacyListings.forEach(item => {
    const inferred = vm.runInContext(`inferCropKey(${JSON.stringify(item)})`, context);
    const html = vm.runInContext(`getListingImageHtml(${JSON.stringify(item)})`, context);
    const url = vm.runInContext(`getListingImageUrl(${JSON.stringify(item)})`, context);
    const expected = expectedMap[item.id];

    console.log(`[${item.id}] ${item.name} -> Inferred: ${inferred} | Image URL: ${url.substring(0, 50)}...`);

    if (inferred !== expected) {
        console.error(`  FAIL: Expected ${expected}, got ${inferred}`);
        allPass = false;
    }
    if (!url.toLowerCase().includes(expected)) {
        console.error(`  FAIL: Image URL does not contain crop name '${expected}': ${url}`);
        allPass = false;
    }
    if (!html.includes('<img src="') || !html.includes(expected)) {
        console.error(`  FAIL: HTML markup mismatch: ${html}`);
        allPass = false;
    }
});

if (allPass) {
    console.log("\n✔ SUCCESS: All legacy and current crop listings now resolve to distinct, accurate images!\n");
} else {
    process.exit(1);
}

