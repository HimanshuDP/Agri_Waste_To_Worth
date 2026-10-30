// Dynamic Dashboard Script with Dedicated Farmer, Buyer, and Admin Portals

// ==============================================================================



// Global chart references so we can destroy and recreate on resize/toggle

const activeCharts = {

    farmerRevenue: null,

    farmerCrop: null,

    farmerMandi: null,

    buyerSpend: null,

    buyerQuality: null,

    buyerCarbon: null,

    adminGmv: null,

    adminBurn: null,

    adminUser: null

};



// Current active role & RBAC Security Engine

let currentPortalRole = 'farmer';



// Validates whether the currently authenticated session is authorized for targetRole

function isRoleAuthorized(targetRole) {

    const currentUser = (typeof window !== 'undefined' && window.AppState?.currentUser) || JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser || !currentUser.userType) return false;



    const userRole = currentUser.userType.toLowerCase();



    // Platform SuperAdmin has supervisory audit access across all portals

    if (userRole === 'admin') return true;



    let normalized = userRole;

    if (normalized === 'aggregator') normalized = 'transporter';

    if (normalized === 'processor') normalized = 'buyer';



    return normalized === targetRole.toLowerCase();

}

if (typeof window !== 'undefined') window.isRoleAuthorized = isRoleAuthorized;



document.addEventListener('DOMContentLoaded', function() {

    // 1. Determine active user role from verified session

    const currentUser = (typeof window !== 'undefined' && window.AppState?.currentUser) || JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (currentUser && currentUser.userType) {

        currentPortalRole = currentUser.userType.toLowerCase();

    } else {

        currentPortalRole = 'farmer';

    }



    // Fallback mapping for role aliases

    if (currentPortalRole === 'aggregator') {

        currentPortalRole = 'transporter';

    } else if (currentPortalRole === 'processor') {

        currentPortalRole = 'buyer';

    } else if (currentPortalRole !== 'farmer' && currentPortalRole !== 'buyer' && currentPortalRole !== 'transporter' && currentPortalRole !== 'admin') {

        currentPortalRole = 'farmer';

    }



    // 2. Render initial portal (strictly authorized)

    switchPortalView(currentPortalRole, false, true);

});



// Switches portal view with strict Role-Based Access Control (RBAC) enforcement

function switchPortalView(role, saveToUser = false, forceInitial = false) {

    const currentUser = (typeof window !== 'undefined' && window.AppState?.currentUser) || JSON.parse(localStorage.getItem('currentUser') || 'null');

    const userRole = (currentUser?.userType || 'farmer').toLowerCase();



    // Security Gate: Block unauthorized portal access

    if (!forceInitial && !isRoleAuthorized(role)) {

        console.warn(`[RBAC Access Blocked] User '${currentUser?.name || 'Guest'}' (Role: ${userRole}) attempted unauthorized access to '${role}' portal.`);

        (typeof window !== 'undefined' && window.showAccessDeniedModal ? window.showAccessDeniedModal : showAccessDeniedModal)(userRole, role);

        return false;

    }



    currentPortalRole = role;



    // 1. Update pill button states and lock badges

    updateSwitcherControls(userRole, role);



    // 2. Update portal view visibility

    const portals = document.querySelectorAll('.portal-view');

    portals.forEach(p => p.classList.remove('active-portal'));



    const targetPortal = document.getElementById(`${role}PortalView`);

    if (targetPortal) {

        targetPortal.classList.add('active-portal');

    }



    // 3. Update top switcher bar identity meta

    updateSwitcherIdentity(role);



    // 4. Initialize charts for this portal

    setTimeout(() => {

        initializeRoleCharts(role);
        syncLiveDashboard(role);
        if (typeof window !== 'undefined' && window.I18n && typeof window.I18n.translatePage === 'function') {
            window.I18n.translatePage();
        }
    }, 120);

    return true;

}

if (typeof window !== 'undefined') window.switchPortalView = switchPortalView;



window.renderActivePortal = function(role) {

    window.switchPortalView(role, false, true);

};



// Access Denied Modal Trigger

function showAccessDeniedModal(currentRole, targetRole) {

    const modal = document.getElementById('accessDeniedModal');

    const currentUser = (typeof window !== 'undefined' && window.AppState?.currentUser) || JSON.parse(localStorage.getItem('currentUser') || 'null');



    const roleNames = {

        'farmer': 'Farmer (Kisan)',

        'buyer': 'Industrial Buyer',

        'transporter': 'Transporter (Fleet)',

        'admin': 'Platform SuperAdmin',

        'guest': 'Unauthenticated Guest'

    };



    const curName = roleNames[currentRole] || currentRole.toUpperCase();

    const tarName = roleNames[targetRole] || targetRole.toUpperCase();



    const badge = document.getElementById('deniedRoleBadge');

    if (badge) {

        badge.textContent = `Current Session: ${curName} • Unauthorized for: ${tarName}`;

    }



    const msg = document.getElementById('accessDeniedMsg');

    if (msg) {

        msg.innerHTML = `You are currently authenticated as <strong>${currentUser ? currentUser.name : 'Guest'}</strong> with the role <strong>${curName}</strong>.<br><br>You are currently logged in as a <strong>${curName}</strong>. This section is reserved for <strong>${tarName}</strong> accounts to keep orders, pricing, and transport routes private and secure.`;

    }



    const switchBtn = document.getElementById('btnDeniedSwitchAccount');

    if (switchBtn) {

        switchBtn.innerHTML = `<i class="fas fa-right-to-bracket"></i> Login as ${tarName}`;

        switchBtn.onclick = function() {

            closeAccessDeniedModal();

            if (window.openAuthModal) {

                window.openAuthModal('login', targetRole);

            }

        };

    }



    if (modal) {

        modal.classList.add('active');

    } else {

        alert(`Access Denied: Your account role is ${curName}. You cannot access the ${tarName} portal. Please login with a ${tarName} account.`);

    }

}

if (typeof window !== 'undefined') window.showAccessDeniedModal = showAccessDeniedModal;



function closeAccessDeniedModal() {

    const modal = document.getElementById('accessDeniedModal');

    if (modal) modal.classList.remove('active');

}

if (typeof window !== 'undefined') window.closeAccessDeniedModal = closeAccessDeniedModal;



function capitalize(str) {

    if (!str) return '';

    return str.charAt(0).toUpperCase() + str.slice(1);

}



function updateSwitcherControls(userRole, activeRole) {

    const roles = ['farmer', 'buyer', 'transporter', 'admin'];



    roles.forEach(r => {

        const btn = document.getElementById(`btnSwitch${capitalize(r)}`);

        if (!btn) return;



        btn.classList.remove('active', 'locked-role');



        const existingLock = btn.querySelector('.pill-lock-icon');

        if (existingLock) existingLock.remove();



        if (r === activeRole) {

            btn.classList.add('active');

        } else if (userRole !== 'admin' && userRole !== r) {

            btn.classList.add('locked-role');

            btn.title = `Access Restricted: Requires ${capitalize(r)} role credentials`;

            btn.insertAdjacentHTML('beforeend', ' <i class="fas fa-lock pill-lock-icon" title="Restricted"></i>');

        }

    });

}



function updateSwitcherIdentity(role) {

    const avatar = document.getElementById('switcherAvatar');

    const name = document.getElementById('switcherName');

    const roleTitle = document.getElementById('switcherRoleTitle');

    const user = (typeof window !== 'undefined' && window.AppState?.currentUser) || JSON.parse(localStorage.getItem('currentUser') || 'null');

    const userRole = (user?.userType || 'farmer').toLowerCase();



    if (avatar) avatar.src = user?.avatar || (role === 'farmer' ? 'https://ui-avatars.com/api/?name=Ramesh+Singh&background=1B6A45&color=fff' : role === 'buyer' ? 'https://ui-avatars.com/api/?name=GreenGrid+BioPower&background=0284c7&color=fff' : role === 'transporter' ? 'https://ui-avatars.com/api/?name=Desh+Transporters&background=BA7612&color=fff' : 'https://ui-avatars.com/api/?name=Admin+Controller&background=7c3aed&color=fff');

    if (name) name.textContent = user?.name || (role === 'farmer' ? 'Farmer Ramesh Singh' : role === 'buyer' ? 'GreenGrid Bio-Power Ltd' : role === 'transporter' ? 'Desh Agro Transporters' : 'Platform Operations Admin');



    if (userRole === 'admin') {

        if (roleTitle) {

            roleTitle.innerHTML = `<span class="rbac-security-badge admin-mode"><i class="fas fa-shield-halved"></i> Platform Administrator</span> Viewing: ${capitalize(role)} Portal`;

        }

    } else {

        if (roleTitle) {

            roleTitle.innerHTML = `<span class="rbac-security-badge"><i class="fas fa-user-check"></i> Verified ${capitalize(userRole)} Account</span> ${user?.roleTitle || user?.organization || 'Active Participant'}`;

        }

    }

}



// ==============================================================================

// CHART INITIALIZERS FOR EACH ROLE

// ==============================================================================



function destroyChart(key) {

    if (activeCharts[key]) {

        try { activeCharts[key].destroy(); } catch(e) {}

        activeCharts[key] = null;

    }

}



function initializeRoleCharts(role) {

    if (typeof Chart === 'undefined') return;



    if (role === 'farmer') {

        initFarmerCharts();

    } else if (role === 'buyer') {

        initBuyerCharts();

    } else if (role === 'admin') {

        initAdminCharts();

    }

}



// 1. Farmer Charts (Emerald Green & Harvest Gold)

function initFarmerCharts() {

    // Farmer Revenue Trend

    const revCtx = document.getElementById('farmerRevenueChart')?.getContext('2d');

    if (revCtx) {

        destroyChart('farmerRevenue');

        activeCharts.farmerRevenue = new Chart(revCtx, {

            type: 'line',

            data: {

                labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar (Current)'],

                datasets: [{

                    label: 'Residue Sales (₹)',

                    data: [35000, 62000, 98000, 142000, 184500],

                    borderColor: '#059669',

                    backgroundColor: 'rgba(5, 150, 105, 0.12)',

                    tension: 0.35,

                    fill: true,

                    pointBackgroundColor: '#059669',

                    pointRadius: 5

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: { legend: { display: false } },

                scales: {

                    y: {

                        ticks: { callback: v => '₹' + (v / 1000) + 'k' },

                        grid: { color: 'rgba(0,0,0,0.05)' }

                    },

                    x: { grid: { display: false } }

                }

            }

        });

    }



    // Farmer Crop Residue Doughnut

    const cropCtx = document.getElementById('farmerCropChart')?.getContext('2d');

    if (cropCtx) {

        destroyChart('farmerCrop');

        activeCharts.farmerCrop = new Chart(cropCtx, {

            type: 'doughnut',

            data: {

                labels: ['Rice Straw', 'Wheat Stover', 'Sugarcane Bagasse', 'Cotton Stalks'],

                datasets: [{

                    data: [52, 28, 14, 6],

                    backgroundColor: ['#059669', '#f59e0b', '#8b5cf6', '#0284c7'],

                    borderWidth: 2,

                    borderColor: '#ffffff'

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }

                }

            }

        });

    }



    // Farmer Mandi Price Comparison Bar

    const mandiCtx = document.getElementById('farmerMandiChart')?.getContext('2d');

    if (mandiCtx) {

        destroyChart('farmerMandi');

        activeCharts.farmerMandi = new Chart(mandiCtx, {

            type: 'bar',

            data: {

                labels: ['Rice Straw', 'Wheat Bales', 'Bagasse', 'Cotton', 'Groundnut'],

                datasets: [{

                    label: 'Mandi Rate (₹/Ton)',

                    data: [5200, 4500, 3800, 2800, 4800],

                    backgroundColor: '#10b981',

                    borderRadius: 6

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: { legend: { display: false } },

                scales: {

                    y: {

                        ticks: { callback: v => '₹' + v },

                        grid: { color: 'rgba(0,0,0,0.05)' }

                    },

                    x: { grid: { display: false } }

                }

            }

        });

    }

}



// 2. Buyer Charts (Steel Navy & Cyan)

function initBuyerCharts() {

    // Buyer Spend Trend

    const spendCtx = document.getElementById('buyerSpendChart')?.getContext('2d');

    if (spendCtx) {

        destroyChart('buyerSpend');

        activeCharts.buyerSpend = new Chart(spendCtx, {

            type: 'line',

            data: {

                labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'],

                datasets: [{

                    label: 'Biomass Spend (₹)',

                    data: [210000, 390000, 540000, 710000, 845000],

                    borderColor: '#0284c7',

                    backgroundColor: 'rgba(2, 132, 199, 0.12)',

                    tension: 0.35,

                    fill: true,

                    pointBackgroundColor: '#0284c7',

                    pointRadius: 5

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: { legend: { display: false } },

                scales: {

                    y: {

                        ticks: { callback: v => '₹' + (v / 100000) + 'L' },

                        grid: { color: 'rgba(0,0,0,0.05)' }

                    },

                    x: { grid: { display: false } }

                }

            }

        });

    }



    // Buyer Quality Matrix (Calorific vs Moisture)

    const qualCtx = document.getElementById('buyerQualityChart')?.getContext('2d');

    if (qualCtx) {

        destroyChart('buyerQuality');

        activeCharts.buyerQuality = new Chart(qualCtx, {

            type: 'bar',

            data: {

                labels: ['Rice Straw', 'Wheat Stover', 'Bagasse', 'Groundnut', 'Cotton Stalk'],

                datasets: [

                    {

                        label: 'Calorific Value (MJ/kg)',

                        data: [15.2, 16.0, 9.8, 17.5, 15.5],

                        backgroundColor: '#0284c7',

                        borderRadius: 4

                    },

                    {

                        label: 'Moisture Content (%)',

                        data: [12.0, 13.5, 35.0, 9.5, 11.5],

                        backgroundColor: '#38bdf8',

                        borderRadius: 4

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }

                },

                scales: {

                    y: { grid: { color: 'rgba(0,0,0,0.05)' } },

                    x: { grid: { display: false } }

                }

            }

        });

    }



    // Buyer Carbon Offset

    const carbCtx = document.getElementById('buyerCarbonChart')?.getContext('2d');

    if (carbCtx) {

        destroyChart('buyerCarbon');

        activeCharts.buyerCarbon = new Chart(carbCtx, {

            type: 'line',

            data: {

                labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],

                datasets: [{

                    label: 'CO₂e Offset (Tons)',

                    data: [42, 78, 115, 154, 185],

                    borderColor: '#10b981',

                    backgroundColor: 'rgba(16, 185, 129, 0.15)',

                    tension: 0.35,

                    fill: true,

                    pointBackgroundColor: '#10b981',

                    pointRadius: 5

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: { legend: { display: false } },

                scales: {

                    y: {

                        ticks: { callback: v => v + ' T' },

                        grid: { color: 'rgba(0,0,0,0.05)' }

                    },

                    x: { grid: { display: false } }

                }

            }

        });

    }

}



// 3. Admin Charts (Dark Mode Violet & Amber)

function initAdminCharts() {

    // Admin GMV & Daily Volume

    const gmvCtx = document.getElementById('adminGmvChart')?.getContext('2d');

    if (gmvCtx) {

        destroyChart('adminGmv');

        activeCharts.adminGmv = new Chart(gmvCtx, {

            type: 'line',

            data: {

                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],

                datasets: [{

                    label: 'Total Crop Waste Traded (₹ Lakhs)',

                    data: [8.5, 14.2, 22.0, 31.4, 38.0, 42.8],

                    borderColor: '#a855f7',

                    backgroundColor: 'rgba(168, 85, 247, 0.15)',

                    tension: 0.35,

                    fill: true,

                    pointBackgroundColor: '#a855f7',

                    pointRadius: 5

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: { legend: { display: false } },

                scales: {

                    y: {

                        ticks: { color: '#94a3b8', callback: v => '₹' + v + 'L' },

                        grid: { color: 'rgba(255,255,255,0.08)' }

                    },

                    x: {

                        ticks: { color: '#94a3b8' },

                        grid: { display: false }

                    }

                }

            }

        });

    }



    // Admin Stubble Incidents Prevented

    const burnCtx = document.getElementById('adminBurnChart')?.getContext('2d');

    if (burnCtx) {

        destroyChart('adminBurn');

        activeCharts.adminBurn = new Chart(burnCtx, {

            type: 'bar',

            data: {

                labels: ['Ludhiana', 'Karnal', 'Sangrur', 'Amritsar', 'Patiala'],

                datasets: [

                    {

                        label: 'Intercepted & Traded',

                        data: [48, 36, 29, 22, 18],

                        backgroundColor: '#10b981',

                        borderRadius: 4

                    },

                    {

                        label: 'Active Heat Hotspots',

                        data: [1, 2, 1, 0, 1],

                        backgroundColor: '#ef4444',

                        borderRadius: 4

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: 'bottom',

                        labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 11 } }

                    }

                },

                scales: {

                    y: {

                        ticks: { color: '#94a3b8' },

                        grid: { color: 'rgba(255,255,255,0.08)' }

                    },

                    x: {

                        ticks: { color: '#94a3b8' },

                        grid: { display: false }

                    }

                }

            }

        });

    }



    // Admin User Ecosystem Doughnut

    const userCtx = document.getElementById('adminUserChart')?.getContext('2d');

    if (userCtx) {

        destroyChart('adminUser');

        activeCharts.adminUser = new Chart(userCtx, {

            type: 'doughnut',

            data: {

                labels: ['Farmers & Co-ops', 'Industrial Buyers', 'Transporters & Logistics', 'Aggregators'],

                datasets: [{

                    data: [1240, 84, 28, 56],

                    backgroundColor: ['#10b981', '#0284c7', '#f59e0b', '#a855f7'],

                    borderWidth: 2,

                    borderColor: '#131926'

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: 'bottom',

                        labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 11 } }

                    }

                }

            }

        });

    }

}



// ==============================================================================

// DEMO INTERACTIVE PORTAL ACTIONS

// ==============================================================================



window.requestStubblePickup = function() {

    const confirmation = confirm('Request automated stubble baler tractor dispatch to your farm coordinates?');

    if (confirmation) {

        if (window.showNotification) {

            window.showNotification('Pickup booked! Transporter PB-10 dispatched for baling & transport.', 'success');

        } else {

            alert('Pickup booked! Tractor Baler unit dispatched to your location.');

        }

    }

};



window.openPostRfqModal = function() {

    const qty = prompt('Enter required biomass volume in Metric Tons (e.g. 250):', '250');

    if (qty) {

        const material = prompt('Enter required crop residue (e.g. Sugarcane Bagasse / Rice Straw):', 'Sugarcane Bagasse');

        if (material) {

            if (window.showNotification) {

                window.showNotification(`RFQ posted for ${qty}T of ${material}! Notifying nearby farmer co-operatives.`, 'success');

            } else {

                alert(`RFQ posted for ${qty}T of ${material}! Broadcast sent to farmer co-ops.`);

            }

        }

    }

};



window.exportBuyerEsgReport = function() {

    if (window.showNotification) {

        window.showNotification('Generating Clean Air & Environmental Report (PDF)...', 'info');

    }

    setTimeout(() => {

        alert('ESG Certificate Generated: 185 Metric Tons CO2e Avoidance Verified by Bureau of Energy Efficiency (BEE).');

    }, 800);

};



window.approveKyc = function(rowId, name) {

    const row = document.getElementById(rowId);

    if (row) {

        const actionCell = row.cells[row.cells.length - 1];

        actionCell.innerHTML = `<span class="badge-status status-approved"><i class="fas fa-check"></i> Approved</span>`;

        if (window.showNotification) {

            window.showNotification(`KYC Approved for ${name}. Verification badge issued.`, 'success');

        }

    }

};



window.rejectKyc = function(rowId) {

    const row = document.getElementById(rowId);

    if (row) {

        row.style.opacity = '0.4';

        const actionCell = row.cells[row.cells.length - 1];

        actionCell.innerHTML = `<span class="badge-status status-danger"><i class="fas fa-times"></i> Rejected</span>`;

        if (window.showNotification) {

            window.showNotification('Application rejected and archived.', 'info');

        }

    }

};



window.broadcastThermalAlert = function() {

    const confirmed = confirm('Broadcast Emergency Stubble Burning Warning via SMS to 420 registered farmers in Karnal and Sangrur sectors?');

    if (confirmed) {

        if (window.showNotification) {

            window.showNotification('Emergency satellite alert dispatched! Baler subsidies promoted via SMS.', 'success');

        } else {

            alert('SMS broadcast successfully sent to 420 farmers.');

        }

    }

};



window.dispatchSmsAlert = function(location) {

    if (window.showNotification) {

        window.showNotification(`Thermal warning & free baler pickup SMS dispatched to farmers in ${location}.`, 'success');

    } else {

        alert(`Warning SMS sent to farmers in ${location}.`);

    }

};





// ==============================================================================
// LIVE REAL-TIME DATABASE DASHBOARD SYNCHRONIZATION
// ==============================================================================
async function syncLiveDashboard(role) {
    if (!window.API || typeof window.API.getDashboardStats !== 'function') return;
    try {
        const currentUser = (typeof window !== 'undefined' && window.AppState?.currentUser) || JSON.parse(localStorage.getItem('currentUser') || 'null');
        const stats = await window.API.getDashboardStats(role, currentUser?.id);
        if (!stats) return;

        if (role === 'farmer') {
            const earnEl = document.getElementById('farmerTotalEarnings');
            if (earnEl && stats.revenue) earnEl.textContent = '₹' + Number(stats.revenue).toLocaleString();

            const soldEl = document.getElementById('farmerWasteSold');
            if (soldEl && stats.tonnageTraded) soldEl.textContent = stats.tonnageTraded + ' Tons';

            const activeEl = document.getElementById('farmerActiveListings');
            if (activeEl && stats.activeLots !== undefined) activeEl.textContent = stats.activeLots + ' Lots';

            if (activeCharts.farmerRevenue && stats.revenueData) {
                activeCharts.farmerRevenue.data.datasets[0].data = stats.revenueData;
                activeCharts.farmerRevenue.update();
            }
            if (activeCharts.farmerCrop && stats.cropData) {
                activeCharts.farmerCrop.data.labels = stats.cropLabels;
                activeCharts.farmerCrop.data.datasets[0].data = stats.cropData;
                activeCharts.farmerCrop.update();
            }
        } else if (role === 'buyer') {
            const spendEl = document.getElementById('buyerTotalSpend');
            if (spendEl && stats.procurementSpend) spendEl.textContent = '₹' + Number(stats.procurementSpend).toLocaleString();

            const volEl = document.getElementById('buyerVolumeProcured');
            if (volEl && stats.tonnageProcured) volEl.textContent = stats.tonnageProcured + ' Tons';

            const ordEl = document.getElementById('buyerActiveOrders');
            if (ordEl && stats.activeOrders !== undefined) ordEl.textContent = stats.activeOrders + ' Orders';

            const co2El = document.getElementById('buyerCarbonOffset');
            if (co2El && stats.carbonOffsetEarned) co2El.textContent = stats.carbonOffsetEarned + ' Tons CO₂e';

            if (activeCharts.buyerSpend && stats.spendData) {
                activeCharts.buyerSpend.data.datasets[0].data = stats.spendData;
                activeCharts.buyerSpend.update();
            }
        } else if (role === 'admin') {
            const gmvEl = document.getElementById('adminGmv');
            if (gmvEl && stats.platformGmv) gmvEl.textContent = '₹' + (Number(stats.platformGmv)/100000).toFixed(1) + ' Lakhs';

            const countEl = document.getElementById('adminNetworkCount');
            if (countEl && stats.totalUsers) countEl.textContent = stats.totalUsers + ' Entities';

            const revEl = document.getElementById('adminRevenue');
            if (revEl && stats.platformGmv) revEl.textContent = '₹' + Math.round(Number(stats.platformGmv) * 0.02).toLocaleString();
        }
    } catch (err) {
        console.warn('[Dashboard] Live stats sync notice:', err);
    }
}
if (typeof window !== 'undefined') window.syncLiveDashboard = syncLiveDashboard;
