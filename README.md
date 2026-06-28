# 🤖 AI-MOM

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini_API-8E75B2?style=flat&logo=google&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> **AI-MOM** is a full-stack AI-powered web application that allows users to chat with Google Gemini AI and generate AI images using Google's latest Gemini API.

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Technologies](#-technologies)
- [Features](#-features)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🌟 About the Project

AI-MOM features a modern React frontend, Node.js/Express backend, MongoDB database, secure authentication, and a responsive UI. It harnesses the power of Google's Gemini models to provide an intuitive AI chat assistant and a powerful AI image generator in one unified platform.

---

## 💻 Technologies

### Frontend
- **React** & **Vite** for fast, modern UI development
- **React Router** for seamless navigation
- **Axios** for API requests
- **CSS** for responsive and custom styling

### Backend
- **Node.js** & **Express.js** for robust server architecture
- **MongoDB** & **Mongoose** for flexible database management
- **JWT Authentication** for secure user sessions
- **Multer** for file handling

### AI Integration
- **Google Gemini API**
- **@google/genai SDK**
- **Gemini 3.5 Flash** (Chat interactions)
- **Gemini Flash Image Model** (Image Generation)

---

## ✨ Features

- 💬 **AI Chat Assistant:** Engage in real-time, context-aware conversations powered by Gemini 3.5 Flash.
- 🎨 **AI Image Generator:** Create stunning images from text prompts using the Gemini Flash Image Model.
- 🔒 **Secure Authentication:** Robust user registration and login with JSON Web Tokens (JWT).
- 📊 **User Dashboard:** Personalized space to manage interactions and view generated content.
- ⬇️ **Image Download:** Easily save AI-generated images directly to your device.
- 📱 **Responsive Design:** A fully optimized UI that looks great on desktop, tablet, and mobile.
- 🧠 **Google Gemini Integration:** Built on the latest and most capable AI models from Google.
- 🔌 **REST API:** Clean, well-documented backend endpoints.
- 🗄️ **MongoDB Database:** Secure and scalable data storage.
- ⚡ **Fast React UI:** Smooth, seamless user experience powered by Vite.

---

## 📁 Folder Structure

```text
AI-MOM/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── package.json
└── README.md
```

---

## 🚀 Installation

Follow these steps to get the project running locally.

```bash
# 1. Clone the repository
git clone https://github.com/tharsan1305/AI-MOM.git

# 2. Navigate to the project directory
cd AI-MOM

# 3. Install root dependencies (if any)
npm install

# 4. Install frontend dependencies
cd client
npm install

# 5. Install backend dependencies
cd ../server
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the `server` directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

> ⚠️ **IMPORTANT:** Your `.env` file contains sensitive information. **Never commit it to version control.** It should be added to your `.gitignore`.

---

## 🏃‍♂️ How to Run This Website

To start the application, you can run the frontend, backend, and admin components using the following commands:

**Run the Backend Server (Node/Express):**
```bash
cd server
npm run dev
```

**Run the Frontend (React):**
```bash
cd client
npm run dev
```

**Run the Admin Dashboard:**
```bash
cd admin
npm run dev
```

*(Note: You can also run both the frontend and backend concurrently from the root directory using `npm run dev`)*

---

## 📡 API Endpoints

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| `POST` | `/api/chat`         | AI Chat completion      |
| `POST` | `/api/generate-image` | Generate AI Image       |
| `POST` | `/api/auth/login`   | Authenticate User       |
| `POST` | `/api/auth/register`| Register New User       |

---

## 📸 Screenshots

### Home
*(Add Screenshot here)*

### AI Chat
*(Add Screenshot here)*

### AI Image Generator
*(Add Screenshot here)*

### Dashboard
*(Add Screenshot here)*

---

## 🚀 Future Improvements

- [ ] Image editing capabilities
- [ ] Image generation history
- [ ] Chat conversation history
- [ ] Dark mode toggle
- [ ] Voice chat integration
- [ ] PDF report generation
- [ ] Pre-built AI templates
- [ ] Prompt history tracking
- [ ] Dedicated mobile application
- [ ] Cloud storage integration for assets

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Developer:** Tharsan  
**GitHub:** [tharsan1305](https://github.com/tharsan1305)
