// Check if faceapi is loaded
const checkFaceApiLoaded = () => {
  if (!faceapi) {
    throw new Error(
      "faceapi is not defined. Make sure to include face-api.js."
    );
  }
};

// Clear the matching images container
const clearMatchingImages = () => {
  const matchingImages = document.getElementById("matchingImages");
  matchingImages.innerHTML = "";
};

// Show success or error card
const showCard = (id) => {
  const card = document.querySelectorAll(".successCard");
  card[id].classList.add("showCard");
  setTimeout(() => {
    card[id].classList.remove("showCard");
  }, 5000);
};

// Load face-api models
const loadFaceApiModels = async () => {
  await Promise.all([
    faceapi.nets.mtcnn.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  ]);
};

// Create face matcher from reference image
const createFaceMatcher = async (file) => {
  return new Promise((resolve, reject) => {
    let img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const refFaceAiData = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!refFaceAiData) {
        showCard(1);
        reject("No face detected in the uploaded reference image.");
      } else {
        const faceMatcher = new faceapi.FaceMatcher(refFaceAiData);
        showCard(0);
        resolve(faceMatcher);
      }
    };
  });
};

// Handle ZIP file upload and search for matching images
const handleZipUpload = async (faceMatcher) => {
  const zipFile = document.getElementById("zipUpload").files[0];
  if (!zipFile) {
    alert("Please upload a ZIP file with images.");
    return [];
  }

  clearMatchingImages();
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(zipFile);
  const matchingImagesContainer = document.getElementById("matchingImages");
  matchingImagesContainer.innerHTML = "";

  const loadingBarContainer = document.getElementById("loadingBarContainer");
  const loadingBar = document.getElementById("loadingBar");
  loadingBarContainer.style.display = "block";
  loadingBar.style.width = "0";

  const entries = Object.entries(zipContent.files);
  const matchingImages = [];

  for (const [index, [relativePath, zipEntry]] of entries.entries()) {
    if (!zipEntry.dir && zipEntry.name.match(/\.(jpe?g|png)$/i)) {
      const imageBlob = await zipEntry.async("blob");
      const imageUrl = URL.createObjectURL(imageBlob);
      let img = document.createElement("img");
      img.src = imageUrl;
      await new Promise((resolve) => (img.onload = resolve));
      const imgFaceData = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (imgFaceData) {
        const bestMatch = faceMatcher.findBestMatch(imgFaceData.descriptor);
        if (bestMatch.label !== "unknown") {
          const matchedImage = document.createElement("img");
          matchedImage.src = imageUrl;
          matchingImagesContainer.appendChild(matchedImage);
          matchingImages.push({ name: zipEntry.name, blob: imageBlob });
        }
      }

      // Update loading bar
      const progress = ((index + 1) / entries.length) * 100;
      loadingBar.style.width = `${progress}%`;
    }
  }

  loadingBarContainer.style.display = "none";
  return matchingImages;
};

// Download matching images as a ZIP file
const downloadMatchingImages = async (matchingImages, zipFileName) => {
  if (matchingImages.length === 0) {
    alert("No matching images found to download.");
    return;
  }
  const zip = new JSZip();
  matchingImages.forEach((img) => zip.file(img.name, img.blob));
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${zipFileName}.zip`);
};

const run = async () => {
  try {
    checkFaceApiLoaded();
    await loadFaceApiModels();

    let faceMatcher;
    document
      .getElementById("referenceImageUpload")
      .addEventListener("change", async function () {
        clearMatchingImages();
        if (this.files && this.files[0]) {
          faceMatcher = await createFaceMatcher(this.files[0]);
        }
      });

    document
      .getElementById("searchAndCreateZip")
      .addEventListener("click", async () => {
        if (!faceMatcher) {
          alert("Please upload a reference image first.");
          return;
        }
        const matchingImages = await handleZipUpload(faceMatcher);
        const zipFileName =
          document.getElementById("zipFileName").value || "matching_images";
        downloadMatchingImages(matchingImages, zipFileName);
      });
  } catch (error) {
    console.error("Error in face detection:", error);
  }
};

document.addEventListener("DOMContentLoaded", run);
