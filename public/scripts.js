const run = async () => {
  try {
    if (!faceapi) {
      throw new Error(
        "faceapi is not defined. Make sure to include face-api.js."
      );
    }

    // Access user's webcam
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    const videoFeedEl = document.getElementById("video-feed");
    if (!videoFeedEl) {
      throw new Error("Element with id 'video-feed' not found.");
    }
    videoFeedEl.srcObject = stream;

    // Load face-api models
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
      faceapi.nets.ageGenderNet.loadFromUri("./models"),
      faceapi.nets.faceExpressionNet.loadFromUri("./models"),
    ]);

    
    const card = document.querySelectorAll(".card");
    const showCard = (id) => {
      if(id ==0){
        card[0].classList.add("show");
        setTimeout(() => {
        card[0].classList.remove("show");
        }, 5000); 
      }
      else
      {
        card[1].classList.add("show");
        setTimeout(() => {
        card[1].classList.remove("show");
        }, 5000); 
    };}
    // Handle image upload and faceMatcher creation
    let faceMatcher;
    document
      .getElementById("referenceImageUpload")
      .addEventListener("change", async function () {
        if (this.files && this.files[0]) {
          let img = document.createElement("img");
          img.src = URL.createObjectURL(this.files[0]);
          console.log(img.src);
          img.onload = async () => {
            const refFaceAiData = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (!refFaceAiData) {
              showCard(1);
              throw new Error("No face detected in the uploaded image.");
            }
            faceMatcher = new faceapi.FaceMatcher(refFaceAiData);
            showCard(0);
            console.log(
              "FaceMatcher created successfully with the uploaded reference image."
            );
          };
        }
      });

    const canvas = document.getElementById("canvas");
    if (!canvas) {
      throw new Error("Element with id 'canvas' not found.");
    }

    canvas.width = videoFeedEl.width;
    canvas.height = videoFeedEl.height;
    const loadingEl = document.getElementById("loading");

    // Face detection and drawing logic
    setInterval(async () => {
      const faceAIData = await faceapi
        .detectAllFaces(videoFeedEl)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()
        .withAgeAndGender();

      // Clear previous drawings
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw detections, landmarks, and expressions
      faceapi.draw.drawDetections(canvas, faceAIData);
      faceapi.draw.drawFaceLandmarks(canvas, faceAIData);
      faceapi.draw.drawFaceExpressions(canvas, faceAIData);
      loadingEl.style.display = "none";
      faceAIData.forEach((face) => {
        const { age, gender, genderProbability, detection, descriptor } = face;
        const genderText = `${gender} - ${
          (Math.round(genderProbability * 100) / 100) * 100
        }%`;
        const ageText = `${Math.round(age)} years`;

        // Draw age and gender
        const textField = new faceapi.draw.DrawTextField(
          [genderText, ageText],
          detection.box.topRight
        );
        textField.draw(canvas);

        // Match face descriptors from faceMatcher
        if (faceMatcher) {
          let bestMatch = faceMatcher.findBestMatch(descriptor);
          let label = bestMatch.toString();
          let similarityPercentage = (1 - bestMatch.distance) * 100;
          let options = {
            label: `Matched ${label} || Similarity: (${similarityPercentage.toFixed(2)}%)`,
            boxColor:'green',
          };
          if (label.includes("unknown")) {
            options = { label: "Unknown person",
              boxColor: "red" 
             };
          }
          const drawBox = new faceapi.draw.DrawBox(detection.box, options);
          drawBox.draw(canvas);
        }
      });
    }, 200);
  } catch (error) {
    console.error("Error in face detection:", error);
  }
};

run();
