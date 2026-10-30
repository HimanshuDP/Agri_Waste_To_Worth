"""
Comprehensive Verification Suite for AgriWaste Live Database & Production APIs
"""

import sys
import time
import requests
import json

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = 'http://127.0.0.1:5000'
session = requests.Session()

def assert_test(name, condition, details=""):
    if condition:
        print(f"  [PASS] {name} {details}")
        return True
    else:
        print(f"  [FAIL] {name} {details}")
        return False

def run_live_tests():
    passed = 0
    total = 0

    print("\n" + "="*60)
    print("Testing AgriWaste Live Persistent Database & APIs")
    print("="*60)

    # 1. System Health & Status
    print("\n--- Group 1: Health & System Status ---")
    total += 2
    r = session.get(f"{BASE_URL}/api/health")
    passed += assert_test("GET /api/health status 200", r.status_code == 200 and r.json().get('status') == 'ok')
    
    r = session.get(f"{BASE_URL}/api/status")
    data = r.json()
    passed += assert_test("GET /api/status database connected", 'connected' in data.get('components', {}).get('database', ''))

    # 2. Authentication Flow
    print("\n--- Group 2: Persistent User Authentication ---")
    total += 4
    # Test Farmer Login
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": "farmer@agriwaste.com", "password": "farmer123"})
    farmer_user = r.json().get('user', {})
    passed += assert_test("Farmer Login (farmer@agriwaste.com)", r.status_code == 200 and farmer_user.get('user_type') == 'farmer')

    # Test Session Check
    r = session.get(f"{BASE_URL}/api/auth/me")
    passed += assert_test("Session Active /api/auth/me", r.json().get('authenticated') is True)

    # Test Registration of new user
    new_email = f"test_kisan_{int(time.time())%10000}@agriwaste.com"
    r = session.post(f"{BASE_URL}/api/auth/register", json={
        "name": "Sukhwinder Singh",
        "email": new_email,
        "password": "kisan_pass_123",
        "user_type": "farmer",
        "location": "Bathinda, Punjab"
    })
    passed += assert_test("Register New Persistent User", r.status_code == 201 and r.json().get('user', {}).get('email') == new_email)

    # Test Invalid Login Rejection
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": "farmer@agriwaste.com", "password": "wrong_password"})
    passed += assert_test("Reject Invalid Password", r.status_code == 401)

    # 3. Live Marketplace Listings
    print("\n--- Group 3: Live Marketplace Listings ---")
    total += 4
    r = session.get(f"{BASE_URL}/api/listings")
    listings = r.json()
    passed += assert_test("GET /api/listings returns seeded records", r.status_code == 200 and len(listings) >= 10, f"({len(listings)} listings found)")

    # Test category filter
    r = session.get(f"{BASE_URL}/api/listings?category=straw")
    straw_items = r.json()
    passed += assert_test("Filter by Category (straw)", r.status_code == 200 and len(straw_items) > 0 and all(i.get('category') == 'straw' for i in straw_items))

    # Test Create Listing
    r = session.post(f"{BASE_URL}/api/listings", json={
        "name": "Organic Wheat Bhusa Premium",
        "category": "straw",
        "image_key": "wheat",
        "price": 4700,
        "quantity": 120,
        "location": "Sangrur, Punjab",
        "seller": "Sukhwinder Singh",
        "moisture": "11.0%",
        "quality": 5
    })
    new_lid = r.json().get('listing', {}).get('id')
    passed += assert_test("POST /api/listings creates live listing", r.status_code == 201 and new_lid is not None)

    # Verify new listing appears in search
    r = session.get(f"{BASE_URL}/api/listings?search=Sangrur")
    passed += assert_test("Search finds newly created listing", any(i.get('id') == new_lid for i in r.json()))

    # 4. Orders, Transactions & Auto-Logistics Dispatch
    print("\n--- Group 4: Orders & Auto-Logistics Dispatch ---")
    total += 4
    # Create order checkout
    r = session.post(f"{BASE_URL}/api/transactions", json={
        "buyer_id": "USR_BUYER_201",
        "buyer_name": "GreenGrid Bio-Power Ltd",
        "seller_id": "USR_FARMER_101",
        "seller_name": "Farmer Ramesh Singh",
        "listing_id": new_lid,
        "item_name": "Organic Wheat Bhusa Premium",
        "amount": 47000,
        "quantity": 10,
        "delivery_location": "Ludhiana Biomass Plant"
    })
    txn_data = r.json().get('transaction', {})
    passed += assert_test("POST /api/transactions checkout", r.status_code == 201 and txn_data.get('id') is not None)

    # Verify Logistics Job was automatically created for transporters!
    r = session.get(f"{BASE_URL}/api/logistics/jobs")
    jobs = r.json()
    new_job = next((j for j in jobs if j.get('order_id') == txn_data.get('id')), None)
    passed += assert_test("Auto-spawned LogisticsJob in Fleet Pool", new_job is not None, f"Job ID: {new_job.get('id') if new_job else 'None'}")

    # Transporter claims the job
    if new_job:
        r = session.post(f"{BASE_URL}/api/logistics/claim", json={
            "job_id": new_job['id'],
            "transporter_id": "USR_TRANSPORTER_401",
            "transporter_name": "Desh Agro Transporters",
            "vehicle_no": "PB-10-CZ-9912"
        })
        passed += assert_test("Transporter claims hauling job", r.status_code == 200 and r.json().get('job', {}).get('status') == 'assigned')

        # Update status to in_transit with GPS
        r = session.post(f"{BASE_URL}/api/logistics/update-status", json={
            "job_id": new_job['id'],
            "status": "in_transit",
            "lat": 30.892,
            "lng": 75.845
        })
        passed += assert_test("Update fleet dispatch status to in_transit", r.status_code == 200 and r.json().get('job', {}).get('status') == 'in_transit')
    else:
        total += 2

    # 5. Live Mandi Commodity Rates
    print("\n--- Group 5: Live Mandi Intelligence ---")
    total += 2
    r = session.get(f"{BASE_URL}/api/mandi/rates")
    mandi_rates = r.json()
    passed += assert_test("GET /api/mandi/rates benchmarks", r.status_code == 200 and len(mandi_rates) >= 6)

    r = session.post(f"{BASE_URL}/api/mandi/estimate", json={
        "crop": "rice",
        "moisture": 11.5,
        "calorific": 15.2
    })
    val = r.json()
    passed += assert_test("POST /api/mandi/estimate fair value", r.status_code == 200 and val.get('recommended_price_per_ton', 0) > 4000, f"(Rs.{val.get('recommended_price_per_ton')}/Ton)")

    # 6. Role-Based Dynamic Dashboard Analytics
    print("\n--- Group 6: Live Role-Based Dashboard Metrics ---")
    roles = ['farmer', 'buyer', 'transporter', 'admin']
    for role in roles:
        total += 1
        r = session.get(f"{BASE_URL}/api/dashboard/stats?role={role}")
        st = r.json()
        passed += assert_test(f"Live Dashboard Metrics for '{role}'", r.status_code == 200 and st.get('role') == role)

    print("\n" + "="*60)
    print(f"Results: {passed} / {total} tests passed ({round(passed/total*100, 1)}%)")
    print("="*60)

    return passed == total

if __name__ == '__main__':
    success = run_live_tests()
    sys.exit(0 if success else 1)
