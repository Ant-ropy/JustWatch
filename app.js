const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const API_URL =
    "https://justwatch-api.phil-roberts90.workers.dev/api/episodes";

const R2_URL =
    "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/";

/*
    VANDELAY TV BROADCAST START

    This is the point in time at which we pretend
    S01E01 began broadcasting.

    IMPORTANT:
    Keep this value permanently once you're happy
    with the schedule.
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
   READ VIDEO DURATION
========================================== */

function getDuration(episode) {

    return new Promise((resolve, reject) => {

        const video = document.createElement("video");

        video.preload = "metadata";

        video.src = getVideoURL(episode);


        video.addEventListener(
            "loadedmetadata",
            () => {

                const duration = video.duration;

                video.removeAttribute("src");
                video.load();

                resolve(duration);

            },
            { once: true }
        );


        video.addEventListener(
            "error",
            () => {

                reject(
                    new Error(
                        `Could not read duration for ${episodeLabel(episode)}`
                    )
                );

            },
            { once: true }
        );

    });

}


/* ==========================================
   BUILD BROADCAST SCHEDULE
========================================== */

async function buildSchedule() {

    console.log("Reading episode durations...");

    for (let i = 0; i < episodes.length; i++) {

        episodes[i].duration =
            await getDuration(episodes[i]);

        console.log(
            episodeLabel(episodes[i]),
            Math.round(episodes[i].duration),
            "seconds"
        );

    }

}


/* ==========================================
   FIND WHAT SHOULD BE ON NOW
========================================== */

function getBroadcastPosition() {

    const totalRuntime =
        episodes.reduce(
            (total, episode) =>
                total + episode.duration,
            0
        );


    /*
        How many seconds have passed since
        Vandelay TV started broadcasting?
    */

    const elapsed =
        Math.max(
            0,
            (Date.now() - CHANNEL_START) / 1000
        );


    /*
        Loop the entire series forever.
    */

    let position =
        elapsed % totalRuntime;


    /*
        Work through the episodes until we find
        which one contains the current position.
    */

    for (let i = 0; i < episodes.length; i++) {

        if (position < episodes[i].duration) {

            return {
                index: i,
                time: position
            };

        }

        position -= episodes[i].duration;

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


    videoPlayer.src =
        getVideoURL(episode);

    videoPlayer.load();


    /*
        Once we know the video's metadata,
        jump to the LIVE broadcast position.
    */

    videoPlayer.addEventListener(
        "loadedmetadata",
        () => {

            videoPlayer.currentTime =
                broadcast.time;

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
            Don't simply assume the next episode.

            Ask the clock what Vandelay TV should
            currently be broadcasting.
        */

        loadBroadcast();


        videoPlayer.addEventListener(
            "canplay",
            () => {

                videoPlayer.play()
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


        console.log(
            `${episodes.length} episodes discovered`
        );


        /*
            Temporarily read the duration
            of each MP4.
        */

        await buildSchedule();


        /*
            Work out what's broadcasting NOW.
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
   START VANDELAY TV
========================================== */

loadLibrary();
