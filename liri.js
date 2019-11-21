exports.printMsg = function () {
    console.log("This is a message from the demo package");
}

require("dotenv").config();

let fs = require("fs");

const keys = require("./keys.js");

const axios = require("axios")

const Spotify = require("node-spotify-api");

let spotify = new Spotify(keys.spotify);

let command = process.argv[2];

let input = process.argv.splice(3, process.argv.length).join();

switch (command) {
    case "movie":
        movie(input);
        break;
    case "song":
        song(input);
        break;
    case "concert":
        concert(input);
        break;
}


// movies:

function movie() {

    let movie = input;

    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL)

        .then(

            function (response) {
                console.log(response.data.Title)
                console.log(response.data.Year);
            }
        )
}


// music:

function song() {

    let song = input;

    spotify.search({
        type: 'track',
        query: song
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }

        console.log(data.tracks.items[0].name);

    });
}


// concerts:

function concert() {

    let artist = input;

    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function (response) {
            console.log(response.data[0]);
        }
    )
}