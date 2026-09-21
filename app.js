const videoPlayer = document.getElementById("videoPlayer");
const placeholder = document.getElementById("playerPlaceholder");

const BASE_URL =
    "https://pub-0c54462e81d94754bbee0244e9ff69d7.r2.dev/";

const episodes = [
    { season: 1, episode: 1, title: "The Seinfeld Chronicles", file: "Seinfeld.S01E01.The.Seinfeld.Chronicles.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 1, episode: 2, title: "The Stake Out", file: "Seinfeld.S01E02.The.Stake.Out.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 1, episode: 3, title: "The Robbery", file: "Seinfeld.S01E03.The.Robbery.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 1, episode: 4, title: "Male-Unbonding", file: "Seinfeld.S01E04.Male-Unbonding.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 1, episode: 5, title: "The Stock Tip", file: "Seinfeld.S01E05.The.Stock.Tip.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 1, title: "The Ex-Girlfriend", file: "Seinfeld.S02E01.The.Ex-Girlfriend.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 2, title: "The Pony Remark", file: "Seinfeld.S02E02.The.Pony.Remark.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 3, title: "The Jacket", file: "Seinfeld.S02E03.The.Jacket.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 4, title: "The Phone Message", file: "Seinfeld.S02E04.The.Phone.Message.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 5, title: "The Apartment", file: "Seinfeld.S02E05.The.Apartment.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 6, title: "The Statue", file: "Seinfeld.S02E06.The.Statue.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 7, title: "The Revenge", file: "Seinfeld.S02E07.The.Revenge.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 8, title: "The Heart Attack", file: "Seinfeld.S02E08.The.Heart.Attack.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 9, title: "The Deal", file: "Seinfeld.S02E09.The.Deal.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 10, title: "The Baby Shower", file: "Seinfeld.S02E10.The.Baby.Shower.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 11, title: "The Chinese Restaurant", file: "Seinfeld.S02E11.The.Chinese.Restaurant.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" },
    { season: 2, episode: 12, title: "The Busboy", file: "Seinfeld.S02E12.The.Busboy.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mkv" }
];

let currentEpisode = 0;
let shouldAutoplay = false;


function episodeLabel(episode) {
    return (
        `S${String(episode.season).padStart(2, "0")} ` +
        `E${String(episode.episode).padStart(2, "0")} · ` +
        episode.title
    );
}


function loadEpisode(index, autoplay = false) {

    currentEpisode = index;
    shouldAutoplay = autoplay;

    const episode = episodes[currentEpisode];

    const nextIndex =
        (currentEpisode + 1) % episodes.length;

    const nextEpisode = episodes[nextIndex];

    // Update programme information
    document.getElementById("showTitle").textContent =
        "Seinfeld";

    document.getElementById("episodeTitle").textContent =
        episodeLabel(episode);

    document.getElementById("nextShow").textContent =
        "Seinfeld";

    document.getElementById("nextEpisode").textContent =
        episodeLabel(nextEpisode);

    placeholder.style.display = "none";

    // Encode filename safely for R2
    const videoURL =
        BASE_URL + encodeURIComponent(episode.file);

    console.log(
        `Loading episode ${currentEpisode + 1}:`,
        videoURL
    );

    videoPlayer.src = videoURL;
    videoPlayer.load();
}


// Wait until the NEW episode can actually play
videoPlayer.addEventListener("canplay", () => {

    console.log(
        `Episode ${currentEpisode + 1} ready`
    );

    if (shouldAutoplay) {

        shouldAutoplay = false;

        videoPlayer.play()
            .then(() => {
                console.log(
                    `Episode ${currentEpisode + 1} playing`
                );
            })
            .catch(error => {
                console.error(
                    "Automatic playback failed:",
                    error
                );
            });
    }
});


// Current episode finished
videoPlayer.addEventListener("ended", () => {

    console.log(
        `Episode ${currentEpisode + 1} finished`
    );

    const nextIndex =
        (currentEpisode + 1) % episodes.length;

    console.log(
        `Moving to episode ${nextIndex + 1}`
    );

    loadEpisode(nextIndex, true);
});


// Useful debugging
videoPlayer.addEventListener("loadstart", () => {
    console.log("Video load started");
});

videoPlayer.addEventListener("loadedmetadata", () => {
    console.log(
        "Metadata loaded. Duration:",
        videoPlayer.duration
    );
});

videoPlayer.addEventListener("error", () => {

    console.error(
        `ERROR loading episode ${currentEpisode + 1}`
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


// Start with E01
loadEpisode(0, false);
