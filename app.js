const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const API_URL =
    "https://justwatch-api.phil-roberts90.workers.dev/api/episodes";

const R2_URL =
    "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/";


/*
    DEL BOCA VISTA BROADCAST START

    This is the point at which S01E01
    began broadcasting.

    Keep this value fixed.
*/

const CHANNEL_START =
    new Date("2026-09-21T20:00:00+01:00").getTime();


let episodes = [];
let currentEpisode = 0;


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
   VIDEO URL
========================================== */

function getVideoURL(episode) {

    return (
        R2_URL +
        episode.key
            .split("/")
            .map(part => encodeURIComponent(part))
            .join("/")
    );

}


/* ==========================================
   FIND WHAT SHOULD BE ON NOW
========================================== */

function getBroadcastPosition() {

    const totalRuntime =
        episodes.reduce(
            (total, episode) =>
                total + Number(episode.duration),
            0
        );


    if (!totalRuntime) {

        throw new Error(
            "Episode durations are missing."
        );

    }


    /*
        Seconds elapsed since the channel
        started broadcasting.
    */

    const elapsed =
        Math.max(
            0,
            (Date.now() - CHANNEL_START) / 1000
        );


    /*
        Loop the complete Seinfeld library
        forever.
    */

    let position =
        elapsed % totalRuntime;


    /*
        Find which episode contains the
        current broadcast position.
    */

    for (let i = 0; i < episodes.length; i++) {

        const duration =
            Number(episodes[i].duration);

        if (position < duration) {

            return {
                index: i,
                time: position
            };

        }

        position -= duration;

    }


    return {
        index: 0,
        time: 0
    };

}


/* ==========================================
   LOAD CURRENT BROADCAST
========================================== */

function loadBroadcast() {

    const broadcast =
        getBroadcastPosition();


    currentEpisode =
        broadcast.index;


    const episode =
        episodes[currentEpisode];


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


    placeholder.style.display =
        "none";


    console.log(
        "Currently broadcasting:",
        episodeLabel(episode)
    );


    console.log(
        "Broadcast position:",
        Math.floor(broadcast.time),
        "seconds"
    );


    /*
        THIS IS NOW THE ONLY VIDEO FILE
        THE BROWSER LOADS.
    */

    videoPlayer.src =
        getVideoURL(episode);

    videoPlayer.load();


    /*
        Once the current video's metadata
        loads, jump to the live position.
    */

    videoPlayer.addEventListener(
        "loadedmetadata",
        () => {

            videoPlayer.currentTime =
                Math.min(
                    broadcast.time,
                    videoPlayer.duration
                );


            console.log(
                "Synced to:",
                Math.floor(broadcast.time),
                "seconds"
            );

        },
        { once: true }
    );

}


/* ==========================================
   EPISODE FINISHED
========================================== */

videoPlayer.addEventListener(
    "ended",
    () => {

        /*
            Re-check the real broadcast clock
            rather than blindly loading the
            next episode.
        */

        loadBroadcast();


        videoPlayer.addEventListener(
            "canplay",
            () => {

                videoPlayer
                    .play()
                    .catch(error => {

                        console.error(
                            "Autoplay prevented:",
                            error
                        );

                    });

            },
            { once: true }
        );

    }
);


/* ==========================================
   LOAD LIBRARY
========================================== */

async function loadLibrary() {

    try {

        placeholder.style.display =
            "flex";

        placeholder.textContent =
            "Tuning into Del Boca Vista...";


        /*
            Get the complete episode schedule
            INCLUDING durations from Worker.
        */

        const response =
            await fetch(
                API_URL,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        episodes =
            data.episodes;


        if (
            !episodes ||
            episodes.length === 0
        ) {

            throw new Error(
                "No episodes found."
            );

        }


        /*
            Make sure every episode has a
            valid duration.
        */

        const missingDuration =
            episodes.find(
                episode =>
                    !Number.isFinite(
                        Number(episode.duration)
                    ) ||
                    Number(episode.duration) <= 0
            );


        if (missingDuration) {

            throw new Error(
                `Missing duration for ${episodeLabel(missingDuration)}`
            );

        }


        console.log(
            `${episodes.length} episodes discovered`
        );


        console.log(
            "Episode schedule loaded instantly."
        );


        /*
            No buildSchedule().
            No getDuration().
            No loading every MP4.

            Work out what should be broadcasting
            and load ONLY that video.
        */

        loadBroadcast();

    }

    catch (error) {

        console.error(
            "Unable to start channel:",
            error
        );


        placeholder.style.display =
            "flex";


        placeholder.textContent =
            "Unable to tune into Del Boca Vista.";

    }

}


/* ==========================================
   START DEL BOCA VISTA
========================================== */

loadLibrary();
