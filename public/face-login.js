document.addEventListener("DOMContentLoaded", async function () {
    const startLoginBtn = document.getElementById("start-login-btn");
    const initialSection = document.getElementById("initial-section");
    const registerSection = document.getElementById("register-section");
    const loginSection = document.getElementById("login-section");
    const registerBtn = document.getElementById("register-btn");
    const reRegisterBtn = document.getElementById("reRegister-btn");
    const loginBtn = document.getElementById("login-btn");
    const registerVideo = document.getElementById("register-video");
    const loginVideo = document.getElementById("login-video");
    const statusMsg = document.getElementById("status");
    const loader = document.getElementById("loader"); // Loader element

    await loadModels(); // Ensure models are loaded before capturing faces

    startLoginBtn.addEventListener("click", function () {
        initialSection.style.display = "none"; // Hide the button

        let storedData = localStorage.getItem("faceDescriptors");
        if (storedData) {
            loginSection.classList.add("show");
            loginSection.classList.remove("hidden");
            startWebcam(loginVideo);
        } else {
            registerSection.classList.add("show");
            registerSection.classList.remove("hidden");
            startWebcam(registerVideo);
        }
    });

    registerBtn.addEventListener("click", async function () {
        console.log("Registering face...");
        showLoader(true); // Show loader

        const descriptor = await captureFace(registerVideo);
        
        showLoader(false); // Hide loader

        if (descriptor) {
            console.log("Captured Face Descriptor:", descriptor);
            localStorage.setItem("faceDescriptors", JSON.stringify(Array.from(descriptor))); // Convert to array and store

            showMessage("Face Registered Successfully! 🎉", "green");

            setTimeout(() => {
                registerSection.classList.add("hidden");
                loginSection.classList.remove("hidden");
                startWebcam(loginVideo);
            }, 1000);
        } else {
            showMessage("Face not detected! Try again.", "red");
        }
    });

    reRegisterBtn.addEventListener("click",async function(){
        localStorage.removeItem("faceDescriptors");
        loginSection.classList.add("hidden");
        registerSection.classList.remove("hidden");
        showMessage("Register a new face!","black")
        startWebcam(registerVideo);
    })


    loginBtn.addEventListener("click", async function () {
        console.log("Attempting login...");
        showLoader(true); // Show loader

        let storedData = localStorage.getItem("faceDescriptors");
        if (!storedData) {
            showLoader(false);
            showMessage("No registered face found! Register first.", "red");
            return;
        }

        const storedDescriptors = new Float32Array(JSON.parse(storedData)); // Convert back to Float32Array
        console.log("Stored Descriptor:", storedDescriptors);

        const capturedDescriptor = await captureFace(loginVideo);
        showLoader(false); // Hide loader

        if (!capturedDescriptor) {
            showMessage("No face detected! Try again.", "red");
            return;
        }

        console.log("Captured Descriptor:", capturedDescriptor);

        if (storedDescriptors.length !== capturedDescriptor.length) {
            console.error("Face descriptor length mismatch!", storedDescriptors.length, capturedDescriptor.length);
            showMessage("Face data mismatch! Try re-registering.", "red");
            return;
        }

        const distance = faceapi.euclideanDistance(capturedDescriptor, storedDescriptors);
        console.log("Face match distance:", distance);

        if (distance < 0.5) {
            showMessage("Login Successful! ✅", "blue");
            stopWebcam();
            setTimeout(() => window.location.href = "dashboard.html", 1500);
        } else {
            showMessage("Face Not Recognized! ❌", "red");
        }
    });

    async function loadModels() {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("Face-api models loaded.");
    }

    function startWebcam(videoElement) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { videoElement.srcObject = stream; })
            .catch(err => console.error("Webcam error:", err));
    }

    async function captureFace(videoElement) {
        const detection = await faceapi.detectSingleFace(videoElement)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            console.warn("No face detected!");
            return null;
        }
        return detection.descriptor;
    }

    function showMessage(msg, color) {
        statusMsg.innerText = msg;
        statusMsg.style.color = color;
    }

    function showLoader(show) {
        loader.style.display = show ? "block" : "none"; // Show or hide loader
    }

    function stopWebcam() {
        [registerVideo, loginVideo].forEach(video => {
            let stream = video.srcObject;
            if (stream) {
                let tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            video.srcObject = null;
        });
    }
});
