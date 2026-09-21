const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const VIDEO_URL =
    "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/Seinfeld.S01E01.The.Seinfeld.Chronicles.720p.WEBrip.AAC.EN-SUB.x264-%5BMULVAcoded%5D.mkv";

// Update programme information
document.getElementById("showTitle").textContent = "Seinfeld";

document.getElementById("episodeTitle").textContent =
    "S01 E01 · The Seinfeld Chronicles";

// Hide our overlay so we can see the real HTML5 player
placeholder.style.display = "none";

// Attach video
videoPlayer.src = VIDEO_URL;
videoPlayer.load();


// DEBUGGING

videoPlayer.addEventListener("loadstart", () => {
    console.log("VIDEO: load started");
});

videoPlayer.addEventListener("loadedmetadata", () => {
    console.log("VIDEO: metadata loaded");
    console.log("Duration:", videoPlayer.duration);
});

videoPlayer.addEventListener("canplay", () => {
    console.log("VIDEO: ready to play");
});

videoPlayer.addEventListener("playing", () => {
    console.log("VIDEO: playing");
});

videoPlayer.addEventListener("error", () => {

    console.error("VIDEO ERROR");

    if (videoPlayer.error) {
        console.error("Code:", videoPlayer.error.code);
        console.error("Message:", videoPlayer.error.message);
    }

});
