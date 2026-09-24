const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const programmeType = document.getElementById("programmeType");
const programmeTypeText = document.getElementById("programmeTypeText");

const showTitle = document.getElementById("showTitle");
const episodeTitle = document.getElementById("episodeTitle");
const programmeDescription =
    document.getElementById("programmeDescription");

const upNext = document.getElementById("upNext");
const nextShow = document.getElementById("nextShow");
const nextEpisode = document.getElementById("nextEpisode");

const backToLive = document.getElementById("backToLive");

const scheduleNow = document.getElementById("scheduleNow");
const scheduleNext = document.getElementById("scheduleNext");


const API_URL =
    "https://justwatch-api.phil-roberts90.workers.dev/api/episodes";

const R2_URL =
    "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/";


/*
    DEL BOCA VISTA BROADCAST START
*/

const CHANNEL_START =
    new Date("2026-09-21T20:00:00+01:00").getTime();


/*
    MOVIE LIBRARY

    Adding future movies is easy:
    add another object here and another
    movie card in index.html.
*/

const movies = {

    fellowship: {

        title:
            "The Lord of the Rings: The Fellowship of the Ring",

        subtitle:
            "Extended Edition · 2001",

        description:
            "The Fellowship of the Ring · Extended Edition",

        key:
            "Movies/LOTR/LOTR-Fellowship-Extended.mp4"

    }

};


let episodes = [];
let currentEpisode = 0;


/*
    playerMode can be:

    "live"
    "movie"
*/

let playerMode = "live";


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
   R2 URL
========================================== */

function getR2URL(key) {

    return (
        R2_URL +
        key
            .split("/")
            .map(part => encodeURIComponent(part))
            .join("/")
    );

}


function getVideoURL(episode) {

    return getR2URL(episode.key);

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


    const elapsed =
        Math.max(
            0,
            (Date.now() - CHANNEL_START) / 1000
        );


    let position =
        elapsed % totalRuntime;


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
   UPDATE SCHEDULE
========================================== */

function updateSchedule(
    episode,
    nextEpisodeObject
) {

    if (scheduleNow) {

        scheduleNow.textContent =
            episodeLabel(episode);

    }


    if (scheduleNext) {

        scheduleNext.textContent =
            episodeLabel(nextEpisodeObject);

    }

}


/* ==========================================
   LIVE UI
========================================== */

function showLiveUI(
    episode,
    nextEpisodeObject
) {

    programmeType.classList.remove(
        "movie-mode"
    );


    programmeTypeText.textContent =
        "LIVE";


    showTitle.textContent =
        "Seinfeld";


    episodeTitle.textContent =
        episodeLabel(episode);


    programmeDescription.textContent =
        "You're watching the live channel.";


    nextShow.textContent =
        "Seinfeld";


    nextEpisode.textContent =
        episodeLabel(nextEpisodeObject);


    upNext.style.display =
        "";


    backToLive.hidden =
        true;


    updateSchedule(
        episode,
        nextEpisodeObject
    );

}


/* ==========================================
   LOAD CURRENT LIVE BROADCAST
========================================== */

function loadBroadcast(autoplay = false) {

    if (!episodes.length) {

        return;

    }


    playerMode =
        "live";


    const broadcast =
        getBroadcastPosition();


    currentEpisode =
        broadcast.index;


    const episode =
        episodes[currentEpisode];


    const nextIndex =
        (currentEpisode + 1) %
        episodes.length;


    const nextEpisodeObject =
        episodes[nextIndex];


    showLiveUI(
        episode,
        nextEpisodeObject
    );


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


    videoPlayer.addEventListener(
        "loadedmetadata",
        () => {

            /*
                Make sure the user hasn't
                selected a movie while this
                metadata was loading.
            */

            if (playerMode !== "live") {

                return;

            }


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


            if (autoplay) {

                videoPlayer
                    .play()
                    .catch(error => {

                        console.log(
                            "Autoplay prevented:",
                            error
                        );

                    });

            }

        },
        { once: true }
    );

}


/* ==========================================
   PLAY MOVIE
========================================== */

function playMovie(movieID) {

    const movie =
        movies[movieID];


    if (!movie) {

        console.error(
            "Movie not found:",
            movieID
        );

        return;

    }


    playerMode =
        "movie";


    /*
        Change programme information.
    */

    programmeType.classList.add(
        "movie-mode"
    );


    programmeTypeText.textContent =
        "MOVIE";


    showTitle.textContent =
        movie.title;


    episodeTitle.textContent =
        movie.subtitle;


    programmeDescription.textContent =
        movie.description;


    /*
        Movies don't have an
        "Up Next" live programme.
    */

    upNext.style.display =
        "none";


    /*
        Give the viewer a way back
        to the live channel.
    */

    backToLive.hidden =
        false;


    placeholder.style.display =
        "none";


    /*
        Load movie from beginning.
    */

    videoPlayer.src =
        getR2URL(movie.key);


    videoPlayer.load();


    videoPlayer.addEventListener(
        "loadedmetadata",
        () => {

            if (playerMode !== "movie") {

                return;

            }


            videoPlayer.currentTime =
                0;


            videoPlayer
                .play()
                .catch(error => {

                    console.log(
                        "Movie autoplay prevented:",
                        error
                    );

                });

        },
        { once: true }
    );


    /*
        Move the browser back to
        the video player.
    */

    document
        .getElementById("watch")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==========================================
   MOVIE BUTTONS
========================================== */

document
    .querySelectorAll(
        ".movie-card[data-movie]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                playMovie(
                    button.dataset.movie
                );

            }
        );

    });


/* ==========================================
   SEINFELD CHANNEL BUTTON
========================================== */

document
    .getElementById("seinfeldChannel")
    .addEventListener(
        "click",
        () => {

            loadBroadcast(true);


            document
                .getElementById("watch")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* ==========================================
   BACK TO LIVE TV
========================================== */

backToLive.addEventListener(
    "click",
    () => {

        /*
            Recalculate the live position.

            Seinfeld has continued
            broadcasting while the movie
            was being watched.
        */

        loadBroadcast(true);

    }
);


/* ==========================================
   VIDEO FINISHED
========================================== */

videoPlayer.addEventListener(
    "ended",
    () => {

        /*
            Movies simply finish.

            Live TV resynchronises with
            the broadcast clock.
        */

        if (playerMode === "movie") {

            return;

        }


        loadBroadcast(true);

    }
);


/* ==========================================
   LOAD SEINFELD LIBRARY
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


        const missingDuration =
            episodes.find(
                episode =>
                    !Number.isFinite(
                        Number(
                            episode.duration
                        )
                    ) ||
                    Number(
                        episode.duration
                    ) <= 0
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
