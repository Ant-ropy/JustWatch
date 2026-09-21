const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const channels = {
    seinfeld: {
        name: "Seinfeld",

        episodes: [
            {
                season: 1,
                episode: 1,
                title: "The Seinfeld Chronicles",
                file: "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/Seinfeld.S01E01.The.Seinfeld.Chronicles.720p.WEBrip.AAC.EN-SUB.x264-%5BMULVAcoded%5D.mkv"
            }
        ]
    }
};


function loadEpisode(channelName, episodeIndex) {

    const channel = channels[channelName];
    const episode = channel.episodes[episodeIndex];

    // Update player
    videoPlayer.src = episode.file;

    // Update page information
    document.getElementById("showTitle").textContent =
        channel.name;

    document.getElementById("episodeTitle").textContent =
        `S${episode.season} E${episode.episode} · ${episode.title}`;

    // Load video
    videoPlayer.load();
}


videoPlayer.addEventListener("loadeddata", () => {

    // Remove "Channel Offline" overlay
    placeholder.style.display = "none";

});


videoPlayer.addEventListener("error", () => {

    console.error(
        "Video failed to load:",
        videoPlayer.error
    );

});


loadEpisode("seinfeld", 0);
