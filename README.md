# 🎮 Gamedex  

**Gamedex** is a community-driven platform for gamers to **track, review, rate, and share** their gaming experiences. Inspired by Letterboxd for films, Gamedex allows players to build a digital gaming diary, discover new titles, and connect with other gamers.  

---

## 🚀 Features  

- 📚 **Game Library** – Keep track of every game you’ve played or plan to play.  
- ⭐ **Ratings & Reviews** – Share thoughts, rate games on a 5-star scale (with half-stars).  
- 📝 **Gaming Diary** – Log your playthroughs, track progress, and revisit memories.  
- 📊 **Stats & Insights** – View analytics on your playtime, ratings, and genre preferences.  
- ❤️ **Favorites & Lists** – Curate personal lists (e.g., “All-Time Favorites”, “Games I Rage Quit”).  
- 👥 **Social Features** – Follow friends, see their reviews, and discover games through the community.  
- 🔍 **Discover & Search** – Find games using the **IGDB API**, complete with cover art, release info, and platforms.  

---
<img width="1920" height="1440" alt="Your paragraph text (1)" src="https://github.com/user-attachments/assets/47107a14-bbf0-4fc3-a8ce-49f700d67b6d" />
<img width="1920" height="1440" alt="Your paragraph text (2)" src="https://github.com/user-attachments/assets/a2794ae8-6c12-4447-a2e8-f48c5654a225" />
<img width="1920" height="1440" alt="Your paragraph text (3)" src="https://github.com/user-attachments/assets/6bb896ef-272a-4aa7-be3a-e026f0fb7e1d" />
<img width="1920" height="1440" alt="Your paragraph text (4)" src="https://github.com/user-attachments/assets/922a4572-c228-4934-99e2-be306eb03b1d" />
<img width="1920" height="1440" alt="Your paragraph text (5)" src="https://github.com/user-attachments/assets/48c30183-a150-4ac5-b77c-5922f8c4c63f" />
<img width="1920" height="1440" alt="Your paragraph text" src="https://github.com/user-attachments/assets/0467fb1c-a0f8-484f-82af-7d7174b44e13" />

## 🛠️ Tech Stack  

- **Frontend:** React Native (Expo)  
- **Backend:** Node.js + Express + Convex  
- **Database:** ConvexDB (MySQL)  
- **Authentication:** Clerk  
- **API:** IGDB API (for game metadata)  

---

## 📦 Installation  

### Prerequisites  
- Node.js (>= 18)  
- npm or yarn  
- Expo CLI
- Convex Account credentials
- IGDB API credentials  
- Clerk API credentials  
- Convex CLI  

---

### 1. Install Expo CLI  
```bash
npm install -g expo-cli
```

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/gamedex.git
cd client
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
```bash
DATABASE_URL=your_neondb_connection_string
CLERK_API_KEY=your_clerk_api_key
IGDB_CLIENT_ID=your_igdb_client_id
IGDB_CLIENT_SECRET=your_igdb_client_secret
CONVEX_DEPLOYMENT=your_convex_deployment_url
```

### 5. Run the Development Server
```bash
npx expo start
```

### 6. Run Backend with Convex
```bash
npx convex dev
```
  
  
   
