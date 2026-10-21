import sqlite3
import os
import hashlib
import json

DB_PATH = os.path.join(os.path.dirname(__file__), 'journx.db')

def hash_pw(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def init_journx_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. Profiles Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            home_city TEXT DEFAULT 'Hyderabad',
            preferred_style TEXT DEFAULT 'Comfort',
            default_budget REAL DEFAULT 60000,
            currency TEXT DEFAULT '₹',
            vehicle_type TEXT DEFAULT 'Diesel SUV',
            fuel_type TEXT DEFAULT 'Diesel',
            vehicle_mileage REAL DEFAULT 13.5,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # 3. Journeys Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS journeys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            origin_lat REAL,
            origin_lng REAL,
            dest_lat REAL,
            dest_lng REAL,
            days INTEGER NOT NULL,
            travelers INTEGER NOT NULL,
            target_budget REAL NOT NULL,
            currency TEXT DEFAULT '₹',
            selected_mode TEXT DEFAULT 'ROAD',
            status TEXT DEFAULT 'PLANNING',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # 4. Journey Options (Multimodal Strategies)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS journey_options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            journey_id INTEGER NOT NULL,
            mode_type TEXT NOT NULL,
            title TEXT NOT NULL,
            total_cost REAL NOT NULL,
            duration_hours REAL NOT NULL,
            comfort_rating TEXT NOT NULL,
            risk_rating TEXT NOT NULL,
            co2_kg REAL NOT NULL,
            summary TEXT,
            breakdown_json TEXT,
            is_recommended INTEGER DEFAULT 0,
            FOREIGN KEY (journey_id) REFERENCES journeys(id)
        )
    ''')

    # 5. Itineraries Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS itineraries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            journey_id INTEGER NOT NULL,
            day_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            stops_json TEXT,
            estimated_spend REAL,
            FOREIGN KEY (journey_id) REFERENCES journeys(id)
        )
    ''')

    # 6. Expenses Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            journey_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            item_text TEXT NOT NULL,
            amount REAL NOT NULL,
            is_planned INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (journey_id) REFERENCES journeys(id)
        )
    ''')

    # 7. Saved Places Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS saved_places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            category TEXT NOT NULL,
            rating REAL DEFAULT 4.8,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # 8. Geocoding / Location Cache (Accelerates worldwide search)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS location_cache (
            query_key TEXT PRIMARY KEY,
            display_name TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            city TEXT,
            state TEXT,
            country TEXT,
            type TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seed Demo User
    demo_pw = hash_pw("JournX2026!")
    cursor.execute('''
        INSERT OR IGNORE INTO users (id, name, email, password_hash)
        VALUES (1, 'Harshith (Verified Traveler)', 'traveler@journx.ai', ?)
    ''', (demo_pw,))

    # Seed Demo Profile
    cursor.execute('''
        INSERT OR IGNORE INTO profiles (user_id, home_city, preferred_style, default_budget, currency, vehicle_type, fuel_type, vehicle_mileage)
        VALUES (1, 'Hyderabad', 'Comfort', 60000, '₹', 'Diesel SUV', 'Diesel', 13.5)
    ''')

    # Seed Location Cache with major global hubs and landmarks
    seed_locations = [
        # Indian Hubs & Destinations
        ("hyderabad", "Hyderabad, Telangana, India", 17.3850, 78.4867, "Hyderabad", "Telangana", "India", "city"),
        ("goa", "Goa (Panaji), India", 15.4909, 73.8278, "Panaji", "Goa", "India", "city"),
        ("mumbai", "Mumbai, Maharashtra, India", 19.0760, 72.8777, "Mumbai", "Maharashtra", "India", "city"),
        ("bengaluru", "Bengaluru (Bangalore), Karnataka, India", 12.9716, 77.5946, "Bengaluru", "Karnataka", "India", "city"),
        ("delhi", "New Delhi, Delhi NCR, India", 28.6139, 77.2090, "New Delhi", "Delhi", "India", "city"),
        ("pune", "Pune, Maharashtra, India", 18.5204, 73.8567, "Pune", "Maharashtra", "India", "city"),
        ("jaipur", "Jaipur, Rajasthan, India", 26.9124, 75.7873, "Jaipur", "Rajasthan", "India", "city"),
        ("manali", "Manali, Himachal Pradesh, India", 32.2396, 77.1887, "Manali", "Himachal Pradesh", "India", "city"),
        ("leh ladakh", "Leh Ladakh, Ladakh, India", 34.1526, 77.5771, "Leh", "Ladakh", "India", "city"),
        ("coorg", "Coorg (Madikeri), Karnataka, India", 12.4244, 75.7382, "Madikeri", "Karnataka", "India", "city"),
        ("munnar", "Munnar, Kerala, India", 10.0889, 77.0595, "Munnar", "Kerala", "India", "city"),
        ("ooty", "Ooty, Tamil Nadu, India", 11.4102, 76.6950, "Ooty", "Tamil Nadu", "India", "city"),
        ("varanasi", "Varanasi, Uttar Pradesh, India", 25.3176, 82.9739, "Varanasi", "Uttar Pradesh", "India", "city"),
        ("kolkata", "Kolkata, West Bengal, India", 22.5726, 88.3639, "Kolkata", "West Bengal", "India", "city"),
        ("chennai", "Chennai, Tamil Nadu, India", 13.0827, 80.2707, "Chennai", "Tamil Nadu", "India", "city"),
        ("agra", "Agra, Uttar Pradesh, India", 27.1767, 78.0081, "Agra", "Uttar Pradesh", "India", "city"),
        ("charminar", "Charminar, Hyderabad, Telangana, India", 17.3616, 78.4747, "Hyderabad", "Telangana", "India", "landmark"),
        ("eiffel tower", "Eiffel Tower, Paris, France", 48.8584, 2.2945, "Paris", "Île-de-France", "France", "landmark"),
        ("colosseum", "Colosseum, Rome, Italy", 41.8902, 12.4922, "Rome", "Lazio", "Italy", "landmark"),
        ("taj mahal", "Taj Mahal, Agra, Uttar Pradesh, India", 27.1751, 78.0421, "Agra", "Uttar Pradesh", "India", "landmark"),

        # Global Travel Meccas & Corridors
        ("dubai", "Dubai, United Arab Emirates", 25.2048, 55.2708, "Dubai", "Dubai", "United Arab Emirates", "city"),
        ("london", "London, Greater London, United Kingdom", 51.5074, -0.1278, "London", "England", "United Kingdom", "city"),
        ("paris", "Paris, Île-de-France, France", 48.8566, 2.3522, "Paris", "Île-de-France", "France", "city"),
        ("new york", "New York City, New York, United States", 40.7128, -74.0060, "New York", "New York", "United States", "city"),
        ("washington dc", "Washington, District of Columbia, United States", 38.9072, -77.0369, "Washington", "DC", "United States", "city"),
        ("san francisco", "San Francisco, California, United States", 37.7749, -122.4194, "San Francisco", "California", "United States", "city"),
        ("lake tahoe", "Lake Tahoe, California / Nevada, United States", 39.0968, -120.0324, "Lake Tahoe", "California", "United States", "natural"),
        ("tokyo", "Tokyo, Kanto, Japan", 35.6762, 139.6503, "Tokyo", "Tokyo", "Japan", "city"),
        ("kyoto", "Kyoto, Kansai, Japan", 35.0116, 135.7681, "Kyoto", "Kyoto", "Japan", "city"),
        ("singapore", "Singapore, Singapore", 1.3521, 103.8198, "Singapore", "Singapore", "Singapore", "city"),
        ("kuala lumpur", "Kuala Lumpur, Malaysia", 3.1390, 101.6869, "Kuala Lumpur", "Federal Territory", "Malaysia", "city"),
        ("bangkok", "Bangkok, Thailand", 13.7563, 100.5018, "Bangkok", "Bangkok", "Thailand", "city"),
        ("zurich", "Zurich, Switzerland", 47.3769, 8.5417, "Zurich", "Zurich", "Switzerland", "city"),
        ("munich", "Munich, Bavaria, Germany", 48.1351, 11.5820, "Munich", "Bavaria", "Germany", "city"),
        ("rome", "Rome, Lazio, Italy", 41.9028, 12.4964, "Rome", "Lazio", "Italy", "city"),
        ("sydney", "Sydney, New South Wales, Australia", -33.8688, 151.2093, "Sydney", "New South Wales", "Australia", "city")
    ]

    for item in seed_locations:
        cursor.execute('''
            INSERT OR REPLACE INTO location_cache (query_key, display_name, lat, lng, city, state, country, type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', item)

    # Seed Sample Saved Journey (Hyderabad -> Goa)
    cursor.execute('''
        INSERT OR IGNORE INTO journeys (id, user_id, title, origin, destination, origin_lat, origin_lng, dest_lat, dest_lng, days, travelers, target_budget, currency, selected_mode, status)
        VALUES (1, 1, 'Hyderabad to Goa Coastal Expedition', 'Hyderabad', 'Goa', 17.3850, 78.4867, 15.4909, 73.8278, 7, 4, 60000, '₹', 'ROAD', 'ACTIVE')
    ''')

    # Seed Options for Sample Journey
    road_breakdown = json.dumps({
        "transport": {"name": "Fuel & NHAI Fastag Tolls", "cost": 11250, "status": "CALCULATED"},
        "lodging": {"name": "6 Nights (2 Rooms, Comfort Beach Villa)", "cost": 28800, "status": "ESTIMATED"},
        "food": {"name": "Meals & Coastal Dining Allowance", "cost": 9800, "status": "CALCULATED"},
        "local": {"name": "Local Ferry, Parking & Scooter Rentals", "cost": 2950, "status": "ESTIMATED"}
    })
    cursor.execute('''
        INSERT OR IGNORE INTO journey_options (journey_id, mode_type, title, total_cost, duration_hours, comfort_rating, risk_rating, co2_kg, summary, breakdown_json, is_recommended)
        VALUES (1, 'ROAD', 'Private SUV Road Journey via NH-748', 52800, 9.4, 'High', 'Low', 218, 'Scenic Western Ghats drive with optimal autonomy and spontaneous stops.', ?, 1)
    ''', (road_breakdown,))

    train_breakdown = json.dumps({
        "transport": {"name": "2AC Sleeper Train (Vasco Express)", "cost": 8400, "status": "ESTIMATED"},
        "lodging": {"name": "6 Nights (2 Rooms, Boutique Resort)", "cost": 28800, "status": "ESTIMATED"},
        "food": {"name": "Meals & Food Allowance", "cost": 9800, "status": "CALCULATED"},
        "local": {"name": "Station Transfers & Local Taxis", "cost": 4200, "status": "ESTIMATED"}
    })
    cursor.execute('''
        INSERT OR IGNORE INTO journey_options (journey_id, mode_type, title, total_cost, duration_hours, comfort_rating, risk_rating, co2_kg, summary, breakdown_json, is_recommended)
        VALUES (1, 'TRAIN', 'Express Rail via Kacheguda to Madgaon', 51200, 14.2, 'High', 'Very Low', 82, 'Relaxed overnight journey with zero driving fatigue.', ?, 0)
    ''', (train_breakdown,))

    flight_breakdown = json.dumps({
        "transport": {"name": "Non-Stop Flight (HYD → GOI return)", "cost": 26400, "status": "LIVE ESTIMATE"},
        "lodging": {"name": "6 Nights (2 Rooms, Resort)", "cost": 28800, "status": "ESTIMATED"},
        "food": {"name": "Meals & Dining", "cost": 9800, "status": "CALCULATED"},
        "local": {"name": "Airport Cab Transfers", "cost": 3600, "status": "ESTIMATED"}
    })
    cursor.execute('''
        INSERT OR IGNORE INTO journey_options (journey_id, mode_type, title, total_cost, duration_hours, comfort_rating, risk_rating, co2_kg, summary, breakdown_json, is_recommended)
        VALUES (1, 'FLIGHT', 'Commercial Air via IndiGo / Air India Express', 68600, 1.3, 'Very High', 'Low', 340, 'Fastest transit time, ideal for maximizing vacation hours.', ?, 0)
    ''', (flight_breakdown,))

    hybrid_breakdown = json.dumps({
        "transport": {"name": "Express Rail + Coastal Car Rental", "cost": 16200, "status": "CALCULATED"},
        "lodging": {"name": "6 Nights Comfort Accommodations", "cost": 28800, "status": "ESTIMATED"},
        "food": {"name": "Meals & Food", "cost": 9800, "status": "CALCULATED"},
        "local": {"name": "Car Fuel & Insurance", "cost": 3100, "status": "ESTIMATED"}
    })
    cursor.execute('''
        INSERT OR IGNORE INTO journey_options (journey_id, mode_type, title, total_cost, duration_hours, comfort_rating, risk_rating, co2_kg, summary, breakdown_json, is_recommended)
        VALUES (1, 'HYBRID', 'Rail Transit + Local Car Rental', 57900, 14.5, 'Very High', 'Low', 114, 'Best balance of rest on the trunk route and local mobility in Goa.', ?, 0)
    ''', (hybrid_breakdown,))

    conn.commit()
    conn.close()
    print("JOURNX SQLite database initialized successfully at:", DB_PATH)

if __name__ == '__main__':
    init_journx_database()
