# FaceFusion - Recognize, Analyze, Organize

Welcome to **FaceFusion**, a web application that allows users to register and log in using facial recognition. Built using **Face-API.js**, this system enables secure and seamless authentication through a webcam.

## Applications

### 1. **Face Registration and Login System** (Index Page)
- **Face Registration:** Users register their faces, storing unique facial descriptors locally.
- **Face Login:** Users can log in by scanning their faces, matching them against stored data.
- **Real-time Face Detection:** Uses **Face-API.js** to process and recognize faces in real time.
- **Smooth Animations & UI:** Provides feedback and transitions to guide users through the login process.


### 2. Face Recognition, Expression, and Gender Detection App

This application utilizes the Face-API.js library to perform real-time face recognition, facial landmark detection, expression analysis, and gender prediction.

#### **Features:**
- **Face Recognition:** Upload a reference image and match faces in real-time using your webcam. The Face-API.js library's `FaceMatcher` class creates a model from the reference image to match faces detected in the video feed.
- **Expression Detection:** Analyze facial expressions and display probabilities for various emotions such as happiness, sadness, anger, surprise, and more using pre-trained models.
- **Gender Prediction:** Estimate the gender of detected faces with a confidence score using Face-API.js’s gender detection model.
- **User-Friendly Interface:** Intuitive UI for uploading images, viewing real-time results, and analyzing face metrics.

### 3. ZIP File Matching Image Extractor App

This utility application simplifies the process of finding and extracting images that match a reference face from a ZIP file. Users can upload a ZIP file containing multiple images, detect faces, and create a new ZIP file containing only the matching images.

#### **Features:**
- **Reference Image Upload:** Upload a reference image to create a face matcher model for comparison.
- **ZIP File Processing:** Upload a ZIP file containing multiple images for batch analysis.
- **Matching Image Extraction:** Identify and extract images that match the reference face into a new downloadable ZIP file.
- **Progress Indicator:** A visual progress bar informs users of the face matching process.

## Navigation
The dashboard page serves as the central hub for accessing these applications. The menu provides direct links to:
- **Face Recognition, Expression, and Gender Detection App**
- **ZIP File Matching Image Extractor App**


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

