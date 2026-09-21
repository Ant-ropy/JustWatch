const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const BASE_URL =
    "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/";

const episodes = [
    {
        season: 1,
        episode: 1,
        title: "The Seinfeld Chronicles",
        file: "Seinfeld.S01E01.The.Seinfeld.Chronicles.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv"
    },
    {
        season: 1,
        episode: 2,
        title: "The Stake Out",
        file: "Seinfeld.S01E02.The.Stake.Out.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv"
    },
    {
        season: 1,
        episode: 3,
        title: "The Robbery",
        file: "Seinfeld.S01E03.The.Robbery.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv"
    },
    {
        season: 1,
        episode: 4,
        title: "Male-Unbonding",
        file: "Seinfeld.S01E04.Male-Unbonding.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv"
    },
    {
        season: 1,
        episode: 5,
        title: "The Stock Tip",
        file: "Seinfeld.S01E05.The.Stock.Tip.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv"
    }
];

let currentEpisode = 0;


/* ------------------------------
   LOAD EPISODE
--------------------------------*/

function loadEpisode(index, autoplay = false) {

    currentEpisode = index;

    const episode = episodes[currentEpisode];

    const nextIndex =
        (currentEpisode + 1) % episodes.length;

    const nextEpisode =
        episodes[nextIndex];


    // Current programme information
    document.getElementById("showTitle").textContent =
        "Seinfeld";

    document.getElementById("episodeTitle").textContent =
        `S${String(episode.season).padStart(2, "0")} ` +
        `E${String(episode.episode).padStart(2, "0")} · ` +
        episode.title;


    // Up next
    document.getElementById("nextShow").textContent =
        "Seinfeld";

    document.getElementById("nextEpisode").textContent =
        `S${String(nextEpisode.season).padStart(2, "0")} ` +
        `E${String(nextEpisode.episode).padStart(2, "0")} · ` +
        nextEpisode.title;


    // Hide offline placeholder
    placeholder.style.display = "none";


    // Build safe R2 URL
    const videoURL =
        BASE_URL +
        encodeURIComponent(episode.file);


    console.log(
        `Loading S${episode.season}E${episode.episode}:`,
        episode.title
    );


    // Load video
    videoPlayer.src = videoURL;
    videoPlayer.load();


    /*
       Browsers normally allow autoplay when we're
       continuing playback after the user already
       started watching.
    */

    if (autoplay) {

        videoPlayer.play().catch(error => {

            console.log(
                "Autoplay prevented:",
                error
            );

        });

    }

}


/* ------------------------------
   EPISODE FINISHED
--------------------------------*/

videoPlayer.addEventListener("ended", () => {

    const nextEpisode =
        (currentEpisode + 1) % episodes.length;

    console.log(
        "Episode finished. Loading next episode."
    );

    loadEpisode(nextEpisode, true);

});


/* ------------------------------
   ERROR HANDLING
--------------------------------*/

videoPlayer.addEventListener("error", () => {

    console.error("VIDEO ERROR");

    if (videoPlayer.error) {

        console.error(
            "Code:",
            videoPlayer.error.code
        );

        console.error(
            "Message:",
            videoPlayer.error.message
        );

    }

});


/* ------------------------------
   PLAYER STATUS
--------------------------------*/

videoPlayer.addEventListener("playing", () => {

    const episode =
        episodes[currentEpisode];

    console.log(
        `Playing S${episode.season}E${episode.episode}`
    );

});


/* ------------------------------
   START CHANNEL
--------------------------------*/

loadEpisode(0);
