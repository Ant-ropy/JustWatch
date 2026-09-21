/*
    JustWatch
    Live Channel Player

    We'll add the actual channel scheduling
    and Cloudflare R2 videos here later.
*/


const videoPlayer =
    document.getElementById("videoPlayer");


const placeholder =
    document.getElementById("playerPlaceholder");


/*
    Example channel structure.

    Later we'll put all episode information
    into this structure.
*/

const channels = {

    seinfeld: {

        name: "Seinfeld",

        episodes: [

            {
                season: 1,
                episode: 1,
                title: "Good News, Bad News",
                duration: 0,
                video: ""
            },

            {
                season: 1,
                episode: 2,
                title: "The Stake Out",
                duration: 0,
                video: ""
            }

        ]

    }

};


/*
    Eventually this function will determine:

    1. How long the channel has been running
    2. Which episode should currently be playing
    3. The correct timestamp in that episode
    4. Which episode comes next

    This means everybody sees the same broadcast.
*/

function startChannel(channelName) {

    const channel =
        channels[channelName];


    if (!channel) {

        console.error(
            "Channel does not exist."
        );

        return;
    }


    console.log(
        "Starting channel:",
        channel.name
    );

}


/*
    Hide placeholder once an actual video loads.
*/

videoPlayer.addEventListener(
    "loadeddata",
    () => {

        placeholder.style.display = "none";

    }
);


/*
    Start default channel
*/

startChannel("seinfeld");
