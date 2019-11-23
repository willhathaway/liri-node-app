exports.printMsg = function () {
    console.log("This is a message from the demo package");
}

require("dotenv").config();

// external file requirements assigned to universal variables:

const fs = require("fs");

const inquirer = require("inquirer");

// the keys.js file contains an object with the necessary spotify keys:

const keys = require("./keys.js");

// axios module allows for api calls to be made:

const axios = require("axios")

// moment.js:

const moment = require("moment");

// the spotify node api module allows api calls to be made to spotify:

const Spotify = require("node-spotify-api");

let spotify = new Spotify(keys.spotify);

const seperator = "\n------------------------------\n";

function logData(data) {
    fs.appendFile("log.txt", seperator + data, function (error) {

        // if an error was experienced we will log it.
        if (error) {
            console.log(error);
        }

    })
};


inquirer.prompt([{
        type: "list",
        name: "command",
        choices: ["song", "movie", "concert"]
    },
    {
        type: "input",
        name: "input",
        message: "Enter song/movie/artist",
    }
]).then(function (user) {

    // switch statement checks the command and calls the corresponding function:

    switch (user.command) {
        case "movie":
            movie(user.input);
            break;
        case "song":
            song(user.input);
            break;
        case "concert":
            concert(user.input);
            break;
        default:
            console.log("please enter a valid command");
    }

});

// movies:

function movie(input) {

    // the global input variable is assigned to the local movie variable (for clarity within the function):

    let movie = input;

    // checks for a valid movie input:

    if (movie === "") {
        console.log("If you haven't watched Mr. Nobody, you should!")
        movie = "Mr. Nobody"
    }

    // creates a query url for use in the api call to OMDB:

    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    // sends a request to OMDB using axios:

    axios.get(queryURL)

        .then(

            // takes the response and logs the relevant data to the console:



            function (response) {

                let movieData = response.data;

                let dataString = ["Title: " + movieData.Title,
                "Year: " + movieData.Year,
                "IMDB: " + movieData.imdbRating,
                "Country: " + movieData.Country,
                "Language: " + movieData.Language,
                "Plot: " + movieData.Plot,
                "Actors: " + movieData.Actors].join("\n");

                console.log("------------------------------");
                console.log("Title: " + movieData.Title)
                console.log("Year: " + movieData.Year);
                console.log("IMDB: " + movieData.imdbRating);
                console.log("Country: " + movieData.Country);
                console.log("Language: " + movieData.Language);
                console.log("Plot: " + movieData.Plot);
                console.log("Actors: " + movieData.Actors);
                console.log("------------------------------");

                logData(dataString);

            }
        )
}


// music:

function song(input) {

    // global input variable assigned to local variable song (for clarity within the function):

    let song = input;

    // checks for a valid song input:

    if (song === "") {
        console.log("Listen to this");
        song = "Mr. Brightside";
    }

    // uses the spotify object (created from the keys object in keys.js) to .search() for a song:

    spotify.search({
        type: "track",
        query: song
    }, function (error, data) {
        if (error) {
            return console.log("Error occurred: " + error);
        }

        let songData = data.tracks.items[0];

        // logs the relevant data from the response object:

        console.log("------------------------------");
        console.log("Track: " + songData.name);
        console.log("Artist: " + songData.artists[0].name);
        console.log("Album: " + songData.album.name);
        console.log("Spotify Link: " + songData.album.external_urls.spotify);
        console.log("------------------------------");

        let dataString = ["Track: " + songData.name,
        "Artist: " + songData.artists[0].name,
        "Album: " + songData.album.name,
        "Spotify Link: " + songData.album.external_urls.spotify].join("\n");
        
        logData(dataString);

    });
}


// concerts:

function concert(input) {

    // global input variable assigned to local artist variable (for clarity within the function):

    let artist = input;

    // checks for a valid artist input:

    if (movie === "") {
        console.log("Please enter an artist")
    } else {

        // creates a query url using the artist input by the user:

        let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        // uses axios to call the bandsintown api with the artist:

        axios.get(queryURL).then(
            function (response) {

                // append the text into the "log.txt" file. if the file doesn"t exist, then it gets created

                // loops through the events, limiting the number to 10 and logging the relevant information to the console:

                for (let i = 0; i < 9; i++) {

                    let dataString = ["Artist: " + artist.charAt(0).toUpperCase() + artist.slice(1),
                    "Venue: " + response.data[i].venue.name,
                    "Datetime: " + response.data[i].datetime].join("\n");

                    console.log("------------------------------");
                    // first letter uppercase code taken from https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
                    console.log("Artist: " + artist.charAt(0).toUpperCase() + artist.slice(1));
                    console.log("Venue: " + response.data[i].venue.name);

                    logData(dataString);

                    // TO DO: display the datetime formatted with moment.js

                    // let date = response.data[i].datetime.moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
                    // console.log(date);
                    // console.log("Event date: " + response.data[i].datetime);

                }

            }
        )
    }
}

// TO DO:

// moment.js the datetime
// do-what-it-says
