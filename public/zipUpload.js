// Import face-api.js.  This assumes it's available via a script tag or module import.
// If using a module import, adjust as needed for your specific setup.
// import * as faceapi from "face-api.js"

// Check if faceapi is loaded
const checkFaceApiLoaded = () => {
  if (!faceapi) {
    throw new Error("faceapi is not defined. Make sure to include face-api.js.")
  }
}

// Clear the matching images container
const clearMatchingImages = () => {
  const matchingImages = document.getElementById("matchingImages")
  matchingImages.innerHTML = ""
}

// Show notification
const showNotification = (id, message) => {
  const notification = document.getElementById(id)
  notification.textContent = message
  notification.classList.add("show")
  setTimeout(() => {
    notification.classList.remove("show")
  }, 5000)
}

// Show/hide loader
const toggleLoader = (show) => {
  const loader = document.getElementById("loader")
  if (loader) {
    loader.style.display = show ? "flex" : "none"
  }
}

// Load face-api models
const loadFaceApiModels = async () => {
  toggleLoader(true)
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  ])
  toggleLoader(false)
}

// Create face matcher from reference image
const createFaceMatcher = async (file) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img")
    img.src = URL.createObjectURL(file)
    img.onload = async () => {
      toggleLoader(true)
      const refFaceAiData = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      toggleLoader(false)
      if (!refFaceAiData) {
        showNotification("face-matcher-failed", "No face detected in the uploaded reference image.")
        reject("No face detected in the uploaded reference image.")
      } else {
        const faceMatcher = new faceapi.FaceMatcher(refFaceAiData)
        showNotification("face-matcher-success", "Reference image successfully loaded.")
        resolve(faceMatcher)
      }
    }
  })
}

// Handle ZIP file upload and search for matching images
const handleZipUpload = async (faceMatcher) => {
  const zipFile = document.getElementById("zipUpload").files[0]
  if (!zipFile) {
    alert("Please upload a ZIP file with images.")
    return []
  }

  clearMatchingImages()
  toggleLoader(true)
  const zip = new JSZip()
  const zipContent = await zip.loadAsync(zipFile)
  const matchingImagesContainer = document.getElementById("matchingImages")
  matchingImagesContainer.innerHTML = ""

  const loadingBarContainer = document.getElementById("loadingBarContainer")
  const loadingBar = document.getElementById("loadingBar")
  loadingBarContainer.style.display = "block"
  loadingBar.style.width = "0"

  const entries = Object.entries(zipContent.files)
  const matchingImages = []

  for (const [index, [relativePath, zipEntry]] of entries.entries()) {
    if (!zipEntry.dir && zipEntry.name.match(/\.(jpe?g|png)$/i)) {
      const imageBlob = await zipEntry.async("blob")
      const imageUrl = URL.createObjectURL(imageBlob)
      const img = document.createElement("img")
      img.src = imageUrl
      await new Promise((resolve) => (img.onload = resolve))
      const imgFaceData = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      if (imgFaceData) {
        const bestMatch = faceMatcher.findBestMatch(imgFaceData.descriptor)
        if (bestMatch.label !== "unknown") {
          const matchedImage = document.createElement("img")
          matchedImage.src = imageUrl
          matchingImagesContainer.appendChild(matchedImage)
          matchingImages.push({ name: zipEntry.name, blob: imageBlob })
        }
      }

      // Update loading bar
      const progress = ((index + 1) / entries.length) * 100
      loadingBar.style.width = `${progress}%`
    }
  }

  loadingBarContainer.style.display = "none"
  toggleLoader(false)
  showNotification("face-matcher-success", "ZIP file processed successfully.")

  if (matchingImages.length > 0) {
    document.getElementById("downloadZip").style.display = "block"
  }

  return matchingImages
}

// Download matching images as a ZIP file
const downloadMatchingImages = async (matchingImages, zipFileName) => {
  if (matchingImages.length === 0) {
    alert("No matching images found to download.")
    return
  }
  const zip = new JSZip()
  matchingImages.forEach((img) => zip.file(img.name, img.blob))
  const content = await zip.generateAsync({ type: "blob" })
  saveAs(content, `${zipFileName}.zip`)
}

const run = async () => {
  try {
    checkFaceApiLoaded()
    await loadFaceApiModels()

    let faceMatcher
    let matchingImages = []
    let zipFileName = "matching_images"

    document.getElementById("referenceImageUpload").addEventListener("change", async function () {
      clearMatchingImages()
      if (this.files && this.files[0]) {
        faceMatcher = await createFaceMatcher(this.files[0])
      }
    })

    document.getElementById("zipUpload").addEventListener("change", async function () {
      if (this.files && this.files[0]) {
        showNotification("face-matcher-success", "ZIP file uploaded successfully.")
      }
    })

    document.getElementById("searchAndCreateZip").addEventListener("click", async () => {
      if (!faceMatcher) {
        alert("Please upload a reference image first.")
        return
      }
      matchingImages = await handleZipUpload(faceMatcher)
      zipFileName = document.getElementById("zipFileName").value || "matching_images"
      document.getElementById("downloadZip").style.display = "block"
    })

    document.getElementById("downloadZip").style.display = "none"
    document.getElementById("downloadZip").addEventListener("click", async () => {
      downloadMatchingImages(matchingImages, zipFileName)
    })
  } catch (error) {
    console.error("Error in face detection:", error)
  }
}

document.addEventListener("DOMContentLoaded", run)

