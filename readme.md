## Face and Expression Recognition Web Applications

Welcome to our comprehensive web application repository focused on facial recognition, expression analysis, and a utility for creating a ZIP file of matching images. This repository contains two main applications, each accessible via a navigable index page with an intuitive menu. These applications leverage the powerful capabilities of the Face-API.js library, a robust tool for facial recognition and analysis.

### 1. Face Recognition and Expression, Gender Detection App

This application utilizes the Face-API.js library to perform real-time face recognition, facial landmark detection, expression analysis, and gender prediction.

**Features:**
- **Face Recognition:** Upload a reference image and match faces in real-time using your webcam. The application identifies known faces and highlights them on the video feed. The Face-API.js library's `FaceMatcher` class is used to create a model from the reference image and match faces detected in the video feed.
- **Expression Detection:** Analyze facial expressions and display probabilities for various emotions such as happiness, sadness, anger, surprise, and more. Face-API.js provides pre-trained models that can detect and classify these expressions accurately.
- **Gender Prediction:** Estimate the gender of detected faces with a confidence score. This feature uses the pre-trained gender detection model from Face-API.js to provide accurate gender predictions.
- **User-Friendly Interface:** The application features an interactive UI for uploading images, viewing real-time results, and understanding face analysis metrics. The interface is designed to be intuitive and easy to navigate, ensuring a smooth user experience.

### 2. ZIP to Matching Image ZIP File Creator App

This utility application simplifies the process of finding and extracting images that match a reference face from a ZIP file. It allows users to upload a ZIP file containing multiple images, detect faces, and create a new ZIP file containing only the matching images.

**Features:**
- **Reference Image Upload:** Upload a reference image to create a face matcher model. This model is used to compare and match faces in the uploaded ZIP file.
- **ZIP File Upload:** Upload a ZIP file containing multiple images for analysis. The application processes each image in the ZIP file to detect faces and compare them with the reference image.
- **Matching Images Extraction:** Identify and extract images that match the reference face into a new downloadable ZIP file. This feature helps users quickly isolate relevant images from large collections.
- **Progress Indicator:** A loading bar indicates the progress of the face matching process, providing visual feedback to users. This ensures users are informed about the status of the processing and can monitor the progress.

### How to Navigate

The index page serves as the central hub for accessing these applications. The menu provides direct links to:
- **Face Recognition and Expression, Gender Detection App**
- **ZIP to Matching Image ZIP File Creator App**

### Installation and Setup

1. Clone the repository to your local machine.
2. Ensure you have Node.js and npm installed.
3. Run `npm install` to install all dependencies.
4. Start the application using `nodemon "server.js"` and navigate to `http://localhost:5000` in your web browser.

### About Face-API.js

Face-API.js is a JavaScript library built on top of TensorFlow.js. It provides pre-trained models for face detection, face landmark detection, face recognition, age estimation, gender recognition, and facial expression recognition. This library is highly efficient and can run directly in the browser, making it an excellent choice for web-based facial recognition and analysis applications.

### Contributions

We welcome contributions to enhance these applications. Please fork the repository, create a feature branch, and submit a pull request with your enhancements.

Explore the power of facial recognition and streamline your image processing tasks with our web applications, built using the robust capabilities of the Face-API.js library!