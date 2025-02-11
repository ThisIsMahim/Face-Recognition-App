# FaceFusion - Recognize, Analyze, Organize

Welcome to **FaceFusion**, a web application that allows users to register and log in using facial recognition. Built using **Face-API.js**, this system enables secure and seamless authentication through a webcam.

## Features

### 1. **Face Registration and Login System** (Index Page)
- **Face Registration:** Users register their faces, storing unique facial descriptors locally.
- **Face Login:** Users can log in by scanning their faces, matching them against stored data.
- **Real-time Face Detection:** Uses **Face-API.js** to process and recognize faces in real time.
- **Smooth Animations & UI:** Provides feedback and transitions to guide users through the login process.

### 2. **ZIP Image Matching Tool**
- **Reference Image Upload:** Users upload a reference face image.
- **ZIP File Upload:** Users upload a ZIP containing multiple images.
- **Face Matching & Extraction:** The app scans the ZIP, extracts images matching the reference face, and creates a new ZIP file for download.

## How to Navigate
- **Index Page:** Facial recognition login system.
- **ZIP Image Matcher:** Tool for extracting face-matching images from ZIP files.

## Installation and Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/ThisIsMahim/Face-Recognition-App.git
   cd Face-recognition-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   nodemon server.js
   ```
4. Open in browser:
   ```
   http://localhost:5000
   ```

## Hosting Online
To make the app accessible online:
- **Using GitHub Pages:** Only works for static files; requires backend hosting.
- **Deploying on Vercel/Netlify:** Host frontend, but backend (Node.js) requires a separate service like Render or Railway.
- **Using Firebase Hosting:** Suitable for static hosting, but Firebase Functions may be needed for backend features.
- **Using a VPS (DigitalOcean, AWS, Linode, etc.):** Full control over deployment, requires server setup.

## About Face-API.js
Face-API.js is a **TensorFlow.js-based** library that provides:
- Face detection
- Face landmark detection
- Face recognition
- Age and gender estimation
- Facial expression analysis

## Contributions
Contributions are welcome! Fork the repo, create a feature branch, and submit a pull request.

---
Explore the future of **secure facial authentication** with FaceFusion! 🚀

