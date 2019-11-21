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

    if (movie === '') {
        console.log("If you haven't watched Mr. Nobody, you should!")
        movie = 'Mr. Nobody'
    }

    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL)

        .then(

            function (response) {
                console.log('------------------------------');
                console.log('Title: ' + response.data.Title)
                console.log('Year: ' + response.data.Year);
                console.log('IMDB: ' + response.data.imdbRating);
                console.log('Country: ' + response.data.Country);
                console.log('Language: ' + response.data.Language);
                console.log('Plot: ' + response.data.Plot);
                console.log('Actors: ' + response.data.Actors);
                console.log('------------------------------');
            }
        )
}


// music:

function song() {

    let song = input;

    if (song === '') {
        console.log('Listen to this');
        song = 'Mr. Brightside';
    }

    spotify.search({
        type: 'track',
        query: song
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        console.log('------------------------------');
        console.log('Track: ' + data.tracks.items[0].name);
        console.log('Artist: ' + data.tracks.items[0].artists.name);
        console.log('Album: ' + data.tracks.items[0].album.name);
        console.log('Spotify Link: ' + data.tracks.items[0].album.external_urls.spotify);
        console.log('------------------------------');

    });
}


// concerts:

function concert() {

    let artist = input;

    if (movie === '') {
        console.log('Please enter an artist')
    } else {

        let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        axios.get(queryURL).then(
            function (response) {
                console.log(response);
            }
        )
    }
}