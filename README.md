# Image & Video Search App

A full-stack web and mobile app to search, browse, and favorite images and videos from Unsplash and Pexels APIs. Includes user authentication with email verification, password reset, trending keywords, tutorial popup, and elegant light/dark themes.

---

## ✨ Features

- 🔍 **Image & Video Search**: Search photos and videos with filtering and trending keywords  
- 📈 **Trending Keywords**: Display popular keywords for quick searching  
- 🌟 **Favorites**: Save and manage favorite images/videos linked to your user account  
- 👤 **User Authentication**: Register, login, verify email, reset password using JWT and email verification  
- 🧠 **Tutorial Popup**: Introduction popup shown only once on first visit to homepage  
- 🌙 **Dark / Light Mode**: Elegant, subtle theme switching with MUI and Tailwind CSS  
- 📱 **Responsive UI**: Works beautifully on desktop and mobile browsers  
- 📱 **React Native Mobile App**: (Planned) reuse auth and favorites logic for mobile users  

---

## 🧰 Tech Stack

- **Frontend Web:** React, Material-UI (MUI), Tailwind CSS, React Router, Axios, Context API  
- **Mobile:** React Native (Planned)  
- **Backend:** Node.js, Express, MongoDB, JWT, Nodemailer for emails  
- **External APIs:** Unsplash API (images), Pexels API (videos)  
- **State Management:** React Context API  
- **Notifications:** react-toastify / MUI Snackbars  

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v16+ recommended)  
- npm or yarn  
- MongoDB instance (local or cloud)  

---

### ⚙️ Backend Setup

1. Clone the repository:

   git clone https://github.com/Ahmadraza4026/image-search-frontend.git
   cd image-search-frontend
2. Install dependencies:

npm install
3. Create a .env file and add:

REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
REACT_APP_PEXELS_API_KEY=your_pexels_api_key
REACT_APP_BACKEND_URL=http://localhost:5000

4. Run the frontend server:

npm start

