
---

# KnowBharat – Learn, Play and Explore India

**KnowBharat** is a vibrant and educational web platform designed to help children explore and learn about the diverse culture, geography, and heritage of Indian states. With colorful visuals, interactive games, and modular design, KnowBharat transforms traditional textbook learning into a joyful, tech-driven experience.

---

## 🎯 Objective

To create a child-friendly digital space that:

* Encourages curiosity and learning about Indian states
* Supports interactive and visual learning styles
* Bridges education with gamification
* Promotes India’s rich cultural diversity

---

## ✨ Features

### 🗺️ Interactive Map

* Hover and click on states to view details like capital, language, and interesting facts
* **Quiz Mode** to test your knowledge with hints and feedback

### 🧩 Puzzle Game

* Drag-and-drop puzzle featuring the Indian map or iconic visuals
* Boosts memory, spatial skills, and concentration

### 🔤 Spelling Game

* Image-based clue + letter tiles = fun spelling challenge
* Includes animations, feedback, and letter shuffling

### 🔗 Matching Game

* Match states with correct food, clothing, festivals, tourist places, etc.
* Features lives (❤️), animation feedback, and category selector

### 🧠 Quiz Game

* 10-question multiple-choice quiz
* Colorful buttons, emoji reactions, score summary, and replay option

### 🖼️ Dive with Pictures

* Visually explore Indian states with photo carousels and fun facts

---

## 🛠️ Tech Stack

| Layer    | Technology            |
| -------- | --------------------- |
| Frontend | React.js, CSS         |
| Backend  | Spring Boot, REST API |
| Database | PostgreSQL            |

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ArpitaBiswas4/knowbharat.git
cd knowbharat
```

### 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

### 3. Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 4. PostgreSQL Setup

* Create a database named `knowbharat`
* Import the provided `knowbharat.sql` file
* Update your DB credentials in `application.properties`

---

## 📂 Project Structure

```
knowbharat/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/         # React UI components (Map, Games, ScoreScreen, etc.)
│   │   ├── Hooks/              # Custom React hooks for data fetching
│   │   ├── Css/                # All CSS stylesheets
│   │   └── App.js              # Main application file
│
├── backend/
│   └── src/
│       └── main/
│           └── java/com/knowbharat/backend/
│               ├── controller/         # API controllers
│               ├── service/            # Business logic layer
│               ├── model/              # Entity definitions
│               ├── repository/         # JPA data access layer
│
└── database/
    └── knowbharat.sql          # Schema and sample data
```

---

## 👩‍💻 Developed By

* **Arpita Biswas**

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

Have suggestions, feedback, or need help?

📧 Email: **[biswasa13198@gmail.com](mailto:biswasa13198@gmail.com)**

---
