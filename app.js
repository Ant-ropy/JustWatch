const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const API_URL =
    "https://justwatch-api.phil-roberts90.workers.dev/api/episodes";

const R2_URL =
    "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/";

let episodes = [];
let currentEpisode = 0;
let shouldAutoplay = false;


/* ==========================================
   EPISODE LABEL
========================================== */

function episodeLabel(episode) {

    return (
        `S${String(episode.season).padStart(2, "0")} ` +
        `E${String(episode.episode).padStart(2, "0")} · ` +
        episode.title
    );

}


/* ==========================================
   LOAD EPISODE
========================================== */

function loadEpisode(index, autoplay = false) {

    if (episodes.length === 0) {
        return;
    }

    currentEpisode = index;
    shouldAutoplay = autoplay;

    const episode = episodes[currentEpisode];

    const nextIndex =
        (currentEpisode + 1) % episodes.length;

    const nextEpisode =
        episodes[nextIndex];


    // NOW PLAYING

    document.getElementById("showTitle").textContent =
        "Seinfeld";

    document.getElementById("episodeTitle").textContent =
        episodeLabel(episode);


    // UP NEXT

    document.getElementById("nextShow").textContent =
        "Seinfeld";

    document.getElementById("nextEpisode").textContent =
        episodeLabel(nextEpisode);


    // Hide loading/offline message

    placeholder.style.display = "none";


    // Build URL from R2 object key

    const videoURL =
        R2_URL +
        episode.key
            .split("/")
            .map(part => encodeURIComponent(part))
            .join("/");


    console.log(
        `Loading episode ${currentEpisode + 1}/${episodes.length}:`,
        episodeLabel(episode)
    );

    console.log(
        "Video URL:",
        videoURL
    );


    videoPlayer.src = videoURL;
    videoPlayer.load();

}


/* ==========================================
   VIDEO READY
========================================== */

videoPlayer.addEventListener("canplay", () => {

    console.log(
        `Ready: ${episodeLabel(episodes[currentEpisode])}`
    );

    if (shouldAutoplay) {

        shouldAutoplay = false;

        videoPlayer.play()
            .then(() => {

                console.log(
                    `Playing: ${episodeLabel(
                        episodes[currentEpisode]
                    )}`
                );

            })
            .catch(error => {

                console.error(
                    "Automatic playback prevented:",
                    error
                );

            });

    }

});


/* ==========================================
   EPISODE FINISHED
========================================== */

videoPlayer.addEventListener("ended", () => {

    console.log(
        `Finished: ${episodeLabel(
            episodes[currentEpisode]
        )}`
    );


    // Move to next episode.
    // % makes final episode loop back to episode 0.

    const nextIndex =
        (currentEpisode + 1) % episodes.length;


    console.log(
        `Moving to: ${episodeLabel(
            episodes[nextIndex]
        )}`
    );


    loadEpisode(nextIndex, true);

});


/* ==========================================
   VIDEO ERROR
========================================== */

videoPlayer.addEventListener("error", () => {

    console.error(
        `Video error: ${episodeLabel(
            episodes[currentEpisode]
        )}`
    );

    if (videoPlayer.error) {

        console.error(
            "Error code:",
            videoPlayer.error.code
        );

        console.error(
            "Error message:",
            videoPlayer.error.message
        );

    }

});


/* ==========================================
   LOAD LIBRARY FROM CLOUDFLARE
========================================== */

async function loadLibrary() {

    try {

        placeholder.style.display = "flex";

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        episodes =
            data.episodes;


        if (!episodes || episodes.length === 0) {

            throw new Error(
                "No episodes were found."
            );

        }


        console.log(
            `${episodes.length} episodes discovered`
        );

        console.table(episodes);


        // Start from first available episode

        loadEpisode(0, false);

    }

    catch (error) {

        console.error(
            "Unable to load library:",
            error
        );

        placeholder.style.display = "flex";

        placeholder.textContent =
            "Unable to load channel.";

    }

}


/* ==========================================
   START
========================================== */

loadLibrary();
