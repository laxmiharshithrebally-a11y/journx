import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'roadmate.db')

def seed_full_cities():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cities = [
        # Andhra Pradesh & Telangana
        ("Hyderabad", "Telangana", "India", 17.3850, 78.4867, 100),
        ("Warangal", "Telangana", "India", 17.9689, 79.5941, 85),
        ("Nizamabad", "Telangana", "India", 18.6725, 78.0941, 80),
        ("Karimnagar", "Telangana", "India", 18.4386, 79.1288, 80),
        ("Khammam", "Telangana", "India", 17.2473, 80.1514, 78),
        ("Visakhapatnam (Vizag)", "Andhra Pradesh", "India", 17.6868, 83.2185, 92),
        ("Vijayawada", "Andhra Pradesh", "India", 16.5062, 80.6480, 89),
        ("Tirupati", "Andhra Pradesh", "India", 13.6288, 79.4192, 91),
        ("Kurnool", "Andhra Pradesh", "India", 15.8281, 78.0373, 82),
        ("Guntur", "Andhra Pradesh", "India", 16.3067, 80.4365, 83),
        ("Nellore", "Andhra Pradesh", "India", 14.4426, 79.9865, 81),
        ("Rajahmundry", "Andhra Pradesh", "India", 17.0005, 81.8040, 82),
        ("Kakinada", "Andhra Pradesh", "India", 16.9891, 82.2475, 80),
        ("Anantapur", "Andhra Pradesh", "India", 14.6819, 77.6006, 79),
        ("Kadapa", "Andhra Pradesh", "India", 14.4673, 78.8242, 78),

        # Maharashtra & Goa
        ("Mumbai", "Maharashtra", "India", 19.0760, 72.8777, 100),
        ("Pune", "Maharashtra", "India", 18.5204, 73.8567, 96),
        ("Goa (Panaji)", "Goa", "India", 15.4909, 73.8278, 98),
        ("Goa (Margao)", "Goa", "India", 15.2832, 73.9862, 94),
        ("Nagpur", "Maharashtra", "India", 21.1458, 79.0882, 88),
        ("Nashik", "Maharashtra", "India", 19.9975, 73.7898, 88),
        ("Aurangabad (Chhatrapati Sambhajinagar)", "Maharashtra", "India", 19.8762, 75.3433, 87),
        ("Kolhapur", "Maharashtra", "India", 16.7050, 74.2433, 86),
        ("Solapur", "Maharashtra", "India", 17.6599, 75.9064, 83),
        ("Lonavala", "Maharashtra", "India", 18.7557, 73.4091, 92),
        ("Mahabaleshwar", "Maharashtra", "India", 17.9237, 73.6586, 91),
        ("Alibaug", "Maharashtra", "India", 18.6414, 72.8722, 88),
        ("Shirdi", "Maharashtra", "India", 19.7667, 74.4762, 90),
        ("Ratnagiri", "Maharashtra", "India", 16.9902, 73.3120, 84),

        # Karnataka
        ("Bengaluru (Bangalore)", "Karnataka", "India", 12.9716, 77.5946, 100),
        ("Mysore", "Karnataka", "India", 12.2958, 76.6394, 93),
        ("Mangalore", "Karnataka", "India", 12.9141, 74.8560, 90),
        ("Udupi", "Karnataka", "India", 13.3409, 74.7421, 88),
        ("Murudeshwar", "Karnataka", "India", 14.0940, 74.4899, 87),
        ("Gokarna", "Karnataka", "India", 14.5479, 74.3188, 92),
        ("Coorg (Madikeri)", "Karnataka", "India", 12.4244, 75.7382, 94),
        ("Chikmagalur", "Karnataka", "India", 13.3161, 75.7720, 91),
        ("Hampi", "Karnataka", "India", 15.3350, 76.4600, 93),
        ("Belagavi (Belgaum)", "Karnataka", "India", 15.8497, 74.4977, 86),
        ("Hubli-Dharwad", "Karnataka", "India", 15.3647, 75.1240, 85),
        ("Hassan", "Karnataka", "India", 13.0072, 76.0963, 82),
        ("Shimoga (Shivamogga)", "Karnataka", "India", 13.9299, 75.5681, 83),
        ("Bandipur", "Karnataka", "India", 11.6664, 76.6331, 88),
        ("Kabini", "Karnataka", "India", 11.9547, 76.3218, 88),

        # Tamil Nadu & Puducherry
        ("Chennai", "Tamil Nadu", "India", 13.0827, 80.2707, 97),
        ("Coimbatore", "Tamil Nadu", "India", 11.0168, 76.9558, 90),
        ("Madurai", "Tamil Nadu", "India", 9.9252, 78.1198, 89),
        ("Pondicherry", "Puducherry", "India", 11.9416, 79.8083, 93),
        ("Ooty", "Tamil Nadu", "India", 11.4102, 76.6950, 95),
        ("Kodaikanal", "Tamil Nadu", "India", 10.2381, 77.4892, 92),
        ("Rameshwaram", "Tamil Nadu", "India", 9.2876, 79.3129, 90),
        ("Kanyakumari", "Tamil Nadu", "India", 8.0883, 77.5385, 91),
        ("Salem", "Tamil Nadu", "India", 11.6643, 78.1460, 83),
        ("Tiruchirappalli (Trichy)", "Tamil Nadu", "India", 10.7905, 78.7047, 86),
        ("Thanjavur", "Tamil Nadu", "India", 10.7870, 79.1378, 85),
        ("Yercaud", "Tamil Nadu", "India", 11.7753, 78.2093, 86),

        # Kerala
        ("Kochi (Cochin)", "Kerala", "India", 9.9312, 76.2673, 95),
        ("Munnar", "Kerala", "India", 10.0889, 77.0595, 96),
        ("Wayanad", "Kerala", "India", 11.6854, 76.1320, 94),
        ("Alleppey (Alappuzha)", "Kerala", "India", 9.4981, 76.3388, 93),
        ("Varkala", "Kerala", "India", 8.7379, 76.7163, 91),
        ("Thiruvananthapuram (Trivandrum)", "Kerala", "India", 8.5241, 76.9366, 90),
        ("Kovalam", "Kerala", "India", 8.4020, 76.9784, 89),
        ("Thekkady", "Kerala", "India", 9.6031, 77.1615, 90),
        ("Kozhikode (Calicut)", "Kerala", "India", 11.2588, 75.7804, 87),
        ("Thrissur", "Kerala", "India", 10.5276, 76.2144, 85),
        ("Vagamon", "Kerala", "India", 9.6894, 76.9056, 88),

        # North India: Delhi NCR, UP, Punjab, Haryana, Rajasthan
        ("New Delhi", "Delhi NCR", "India", 28.6139, 77.2090, 100),
        ("Noida", "Uttar Pradesh", "India", 28.5355, 77.3910, 89),
        ("Gurugram (Gurgaon)", "Haryana", "India", 28.4595, 77.0266, 92),
        ("Jaipur", "Rajasthan", "India", 26.9124, 75.7873, 97),
        ("Udaipur", "Rajasthan", "India", 24.5854, 73.7125, 95),
        ("Jodhpur", "Rajasthan", "India", 26.2389, 73.0243, 92),
        ("Jaisalmer", "Rajasthan", "India", 26.9157, 70.9083, 93),
        ("Pushkar", "Rajasthan", "India", 26.4897, 74.5511, 89),
        ("Mount Abu", "Rajasthan", "India", 24.5926, 72.7156, 88),
        ("Agra", "Uttar Pradesh", "India", 27.1767, 78.0081, 95),
        ("Varanasi", "Uttar Pradesh", "India", 25.3176, 82.9739, 95),
        ("Lucknow", "Uttar Pradesh", "India", 26.8467, 80.9462, 91),
        ("Prayagraj (Allahabad)", "Uttar Pradesh", "India", 25.4358, 81.8463, 87),
        ("Mathura & Vrindavan", "Uttar Pradesh", "India", 27.4924, 77.6737, 89),
        ("Ayodhya", "Uttar Pradesh", "India", 26.7922, 82.1998, 92),
        ("Kanpur", "Uttar Pradesh", "India", 26.4499, 80.3319, 85),
        ("Chandigarh", "Punjab / Haryana", "India", 30.7333, 76.7794, 93),
        ("Amritsar", "Punjab", "India", 31.6340, 74.8723, 92),

        # Himalayas & Mountain Passes
        ("Manali", "Himachal Pradesh", "India", 32.2396, 77.1887, 98),
        ("Shimla", "Himachal Pradesh", "India", 31.1048, 77.1734, 94),
        ("Dharamshala & McLeodGanj", "Himachal Pradesh", "India", 32.2190, 76.3234, 92),
        ("Dalhousie", "Himachal Pradesh", "India", 32.5387, 75.9707, 89),
        ("Kasol & Parvati Valley", "Himachal Pradesh", "India", 32.0100, 77.3152, 91),
        ("Spiti Valley (Kaza)", "Himachal Pradesh", "India", 32.2276, 78.0326, 93),
        ("Leh Ladakh", "Ladakh", "India", 34.1526, 77.5771, 99),
        ("Nubra Valley", "Ladakh", "India", 34.6863, 77.5673, 93),
        ("Pangong Tso", "Ladakh", "India", 33.7595, 78.6674, 94),
        ("Srinagar", "Jammu and Kashmir", "India", 34.0837, 74.7973, 94),
        ("Gulmarg", "Jammu and Kashmir", "India", 34.0484, 74.3805, 93),
        ("Pahalgam", "Jammu and Kashmir", "India", 34.0161, 75.3150, 92),
        ("Rishikesh", "Uttarakhand", "India", 30.0869, 78.2676, 95),
        ("Dehradun", "Uttarakhand", "India", 30.3165, 78.0322, 90),
        ("Mussoorie", "Uttarakhand", "India", 30.4598, 78.0644, 92),
        ("Nainital", "Uttarakhand", "India", 29.3919, 79.4542, 92),
        ("Jim Corbett (Ramnagar)", "Uttarakhand", "India", 29.3956, 79.1306, 91),
        ("Auli", "Uttarakhand", "India", 30.5293, 79.5694, 91),

        # Central & Western India
        ("Ahmedabad", "Gujarat", "India", 23.0225, 72.5714, 92),
        ("Surat", "Gujarat", "India", 21.1702, 72.8311, 88),
        ("Vadodara", "Gujarat", "India", 22.3072, 73.1812, 86),
        ("Rann of Kutch (Bhuj)", "Gujarat", "India", 23.2420, 69.6669, 91),
        ("Gir National Park (Sasan Gir)", "Gujarat", "India", 21.1243, 70.8242, 90),
        ("Dwarka", "Gujarat", "India", 22.2442, 68.9685, 89),
        ("Somnath", "Gujarat", "India", 20.8880, 70.4012, 89),
        ("Indore", "Madhya Pradesh", "India", 22.7196, 75.8577, 90),
        ("Bhopal", "Madhya Pradesh", "India", 23.2599, 77.4126, 87),
        ("Ujjain", "Madhya Pradesh", "India", 23.1765, 75.7885, 89),
        ("Gwalior", "Madhya Pradesh", "India", 26.2183, 78.1828, 86),
        ("Khajuraho", "Madhya Pradesh", "India", 24.8318, 79.9199, 90),
        ("Pachmarhi", "Madhya Pradesh", "India", 22.4674, 78.4346, 88),

        # Eastern & North-Eastern India
        ("Kolkata", "West Bengal", "India", 22.5726, 88.3639, 96),
        ("Darjeeling", "West Bengal", "India", 27.0410, 88.2663, 93),
        ("Siliguri", "West Bengal", "India", 26.7271, 88.3953, 86),
        ("Puri", "Odisha", "India", 19.8135, 85.8312, 91),
        ("Bhubaneswar", "Odisha", "India", 20.2961, 85.8245, 88),
        ("Ranchi", "Jharkhand", "India", 23.3441, 85.3096, 84),
        ("Patna", "Bihar", "India", 25.5941, 85.1376, 86),
        ("Bodh Gaya", "Bihar", "India", 24.6961, 84.9869, 89),
        ("Guwahati", "Assam", "India", 26.1445, 91.7362, 90),
        ("Kaziranga", "Assam", "India", 26.5775, 93.1711, 91),
        ("Shillong", "Meghalaya", "India", 25.5788, 91.8933, 93),
        ("Cherrapunji (Sohra)", "Meghalaya", "India", 25.2702, 91.7323, 92),
        ("Gangtok", "Sikkim", "India", 27.3389, 88.6065, 92),
        ("Pelling", "Sikkim", "India", 27.3164, 88.2372, 88),

        # Worldwide Travel Corridors & Road Trip Meccas
        ("Dubai", "Emirate of Dubai", "United Arab Emirates", 25.2048, 55.2708, 98),
        ("Abu Dhabi", "Emirate of Abu Dhabi", "United Arab Emirates", 24.4539, 54.3773, 92),
        ("Singapore", "Singapore", "Singapore", 1.3521, 103.8198, 96),
        ("Kuala Lumpur", "Federal Territory", "Malaysia", 3.1390, 101.6869, 90),
        ("Bangkok", "Central Thailand", "Thailand", 13.7563, 100.5018, 94),
        ("Phuket", "Phuket Province", "Thailand", 7.8804, 98.3923, 93),
        ("Bali (Denpasar)", "Bali", "Indonesia", -8.6705, 115.2126, 96),
        ("Tokyo", "Kanto", "Japan", 35.6762, 139.6503, 98),
        ("Kyoto", "Kansai", "Japan", 35.0116, 135.7681, 95),
        ("London", "Greater London", "United Kingdom", 51.5074, -0.1278, 98),
        ("Edinburgh", "Scotland", "United Kingdom", 55.9533, -3.1883, 91),
        ("Paris", "Île-de-France", "France", 48.8566, 2.3522, 98),
        ("Nice (French Riviera)", "Provence-Alpes-Côte d'Azur", "France", 43.7102, 7.2620, 93),
        ("Zurich", "Canton of Zurich", "Switzerland", 47.3769, 8.5417, 96),
        ("Interlaken", "Bernese Oberland", "Switzerland", 46.6863, 7.8632, 95),
        ("Munich", "Bavaria", "Germany", 48.1351, 11.5820, 94),
        ("Rome", "Lazio", "Italy", 41.9028, 12.4964, 97),
        ("Milan", "Lombardy", "Italy", 45.4642, 9.1900, 93),
        ("Amalfi Coast", "Campania", "Italy", 40.6340, 14.6027, 95),
        ("Barcelona", "Catalonia", "Spain", 41.3879, 2.1699, 95),
        ("Madrid", "Community of Madrid", "Spain", 40.4168, -3.7038, 93),
        ("Amsterdam", "North Holland", "Netherlands", 52.3676, 4.9041, 95),
        ("Vienna", "Vienna", "Austria", 48.2082, 16.3738, 93),
        ("Prague", "Prague", "Czech Republic", 50.0755, 14.4378, 92),
        ("San Francisco", "California", "United States", 37.7749, -122.4194, 96),
        ("Lake Tahoe", "California / Nevada", "United States", 39.0968, -120.0324, 93),
        ("Los Angeles", "California", "United States", 34.0522, -118.2437, 95),
        ("Las Vegas", "Nevada", "United States", 36.1699, -115.1398, 94),
        ("New York City", "New York", "United States", 40.7128, -74.0060, 98),
        ("Toronto", "Ontario", "Canada", 43.6532, -79.3832, 93),
        ("Vancouver", "British Columbia", "Canada", 49.2827, -123.1207, 94),
        ("Sydney", "New South Wales", "Australia", -33.8688, 151.2093, 95),
        ("Melbourne", "Victoria", "Australia", -37.8136, 144.9631, 94),
        ("Auckland", "North Island", "New Zealand", -36.8485, 174.7633, 92),
        ("Queenstown", "South Island", "New Zealand", -45.0312, 168.6626, 94),
        ("Cape Town", "Western Cape", "South Africa", -33.9249, 18.4241, 92),
        ("Kathmandu", "Bagmati", "Nepal", 27.7172, 85.3240, 90),
        ("Colombo", "Western Province", "Sri Lanka", 6.9271, 79.8612, 89)
    ]

    cursor.executemany('''
        INSERT OR REPLACE INTO cities (name, state, country, lat, lng, popularity)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', cities)

    conn.commit()
    conn.close()
    print(f"Successfully seeded {len(cities)} real cities into SQLite database.")

if __name__ == '__main__':
    seed_full_cities()
