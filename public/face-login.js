document.addEventListener("DOMContentLoaded", async function () {
    const startLoginBtn = document.getElementById("start-login-btn");
    const registerSection = document.getElementById("register-section");
    const loginSection = document.getElementById("login-section");
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");
    const registerVideo = document.getElementById("register-video");
    const loginVideo = document.getElementById("login-video");
    const statusMsg = document.getElementById("status");

    await loadModels(); // Ensure models are loaded before capturing faces

    startLoginBtn.addEventListener("click", function () {
        startLoginBtn.style.display = "none"; // Hide the button

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

        const descriptor = await captureFace(registerVideo);
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

    loginBtn.addEventListener("click", async function () {
        console.log("Attempting login...");

        let storedData = localStorage.getItem("faceDescriptors");
        if (!storedData) {
            showMessage("No registered face found! Register first.", "red");
            return;
        }

        const storedDescriptors = new Float32Array(JSON.parse(storedData)); // Convert back to Float32Array
        console.log("Stored Descriptor:", storedDescriptors);

        const capturedDescriptor = await captureFace(loginVideo);
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
