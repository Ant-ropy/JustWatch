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


    /* NOW PLAYING */

    document.getElementById("showTitle").textContent =
        "Seinfeld";

    document.getElementById("episodeTitle").textContent =
        episodeLabel(episode);


    /* UP NEXT */

    document.getElementById("nextShow").textContent =
        "Seinfeld";

    document.getElementById("nextEpisode").textContent =
        episodeLabel(nextEpisode);


    /* Hide loading message */

    placeholder.style.display = "none";


    /* Build R2 video URL */

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


    /*
       Load episode.

       Every newly loaded episode starts from
       the beginning.
    */

    videoPlayer.src = videoURL;
    videoPlayer.load();

}


/* ==========================================
   EPISODE METADATA LOADED
========================================== */

videoPlayer.addEventListener("loadedmetadata", () => {

    /*
       Explicitly start every episode at 00:00.
    */

    videoPlayer.currentTime = 0;

    console.log(
        `Starting from 00:00: ${episodeLabel(
            episodes[currentEpisode]
        )}`
    );

});


/* ==========================================
   VIDEO READY
========================================== */

videoPlayer.addEventListener("canplay", () => {

    console.log(
        `Ready: ${episodeLabel(
            episodes[currentEpisode]
        )}`
    );


    /*
       When an episode has automatically followed
       another episode, start playing it.
    */

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


    /*
       Move to the next episode.

       The modulo (%) causes the final episode
       to return to episode 1.

       Example:

       S01E01
          ↓
       S01E02
          ↓
       S01E03
          ↓
         ...
          ↓
       Final Episode
          ↓
       S01E01
    */

    const nextIndex =
        (currentEpisode + 1) % episodes.length;


    console.log(
        `Moving to: ${episodeLabel(
            episodes[nextIndex]
        )}`
    );


    /*
       true = automatically play the next episode.
    */

    loadEpisode(nextIndex, true);

});


/* ==========================================
   VIDEO ERROR
========================================== */

videoPlayer.addEventListener("error", () => {

    if (episodes.length === 0) {
        return;
    }

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
   LOAD EPISODE LIBRARY
========================================== */

async function loadLibrary() {

    try {

        placeholder.style.display = "flex";

        const response =
            await fetch(API_URL, {
                cache: "no-store"
            });


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


        /*
           Always start with the first episode
           when the website is opened/refreshed.

           false = don't force autoplay.
           The viewer presses Play initially.
        */

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
