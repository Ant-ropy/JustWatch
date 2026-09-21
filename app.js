const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const VIDEO_URL =
    "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/Seinfeld.S01E01.The.Seinfeld.Chronicles.720p.WEBrip.AAC.EN-SUB.x264-%5BMULVAcoded%5D.mkv";

// Update page text
document.getElementById("showTitle").textContent = "Seinfeld";

document.getElementById("episodeTitle").textContent =
    "S01 E01 · The Seinfeld Chronicles";

// Remove offline overlay immediately
placeholder.style.display = "none";

// Load video
videoPlayer.src = VIDEO_URL;
videoPlayer.load();


// Diagnostics
videoPlayer.addEventListener("loadstart", () => {
    console.log("Video loading started");
});

videoPlayer.addEventListener("loadedmetadata", () => {
    console.log("Metadata loaded");
    console.log("Duration:", videoPlayer.duration);
});

videoPlayer.addEventListener("canplay", () => {
    console.log("Video can play");
});

videoPlayer.addEventListener("playing", () => {
    console.log("Video is playing");
});

videoPlayer.addEventListener("error", () => {

    console.error("VIDEO ERROR");

    if (videoPlayer.error) {
        console.error("Error code:", videoPlayer.error.code);
        console.error("Message:", videoPlayer.error.message);
    }

});
