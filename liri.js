// Will Hathaway ~ LIRI Bot ~ 2019

// NOTE: I altered the names of the functions listed in the assignment:
// "spotify-this-this" = "song"
// "movie-this" = "movie"
// "concert-this" = "concert"
// "do-what-it-says" = "random"

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

// global seperator variable declared to use when appending to log.txt:

const seperator = "\n------------------------------\n";

// logData function appends the data to log.txt file:

function logData(data) {
    fs.appendFile("log.txt", seperator + command + data, function (error) {
        // if an error was experienced we will log it.
        if (error) {
            console.log(error);
        }
    })
};

// inquirer asks the user for a command and input, then runs a function:

inquirer.prompt([{
        type: "list",
        name: "command",
        choices: ["song", "movie", "concert", "random"]
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
            command = "MOVIE:\n";
            movie(user.input);
            break;
        case "song":
            command = "SONG:\n";
            song(user.input);
            break;
        case "concert":
            command = "CONCERT:\n";
            concert(user.input);
            break;
        case "random":
            fromFile();
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

                // shorthand for navigating through response object:

                let movieData = response.data;

                // builds a string from the various elements of the response object:

                let dataString = ["Title: " + movieData.Title,
                    "Year: " + movieData.Year,
                    "IMDB: " + movieData.imdbRating,
                    "Country: " + movieData.Country,
                    "Language: " + movieData.Language,
                    "Plot: " + movieData.Plot,
                    "Actors: " + movieData.Actors
                ].join("\n");

                // console.logs the relevant data from the response object:

                console.log("------------------------------");
                console.log("Title: " + movieData.Title)
                console.log("Year: " + movieData.Year);
                console.log("IMDB: " + movieData.imdbRating);
                console.log("Country: " + movieData.Country);
                console.log("Language: " + movieData.Language);
                console.log("Plot: " + movieData.Plot);
                console.log("Actors: " + movieData.Actors);
                console.log("------------------------------");

                // calls logData with the dataString

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

        // shorthand for navigating through response object:

        let songData = data.tracks.items[0];

        // logs the relevant data from the response object:

        console.log("------------------------------");
        console.log("Track: " + songData.name);
        console.log("Artist: " + songData.artists[0].name);
        console.log("Album: " + songData.album.name);
        console.log("Spotify Link: " + songData.album.external_urls.spotify);
        console.log("------------------------------");

        // builds a string from the various elements of the response object:

        let dataString = ["Track: " + songData.name,
            "Artist: " + songData.artists[0].name,
            "Album: " + songData.album.name,
            "Spotify Link: " + songData.album.external_urls.spotify
        ].join("\n");

        // calls logData with the dataString

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

                    // uses moment.js to format the datetime into format MM/DD/YYYY as specified in the assignment:

                    let datetime = new Date(response.data[i].datetime);
                    date = moment(datetime).format("MM/DD/YYYY");

                    // builds a string from the various elements of the response object:

                    let dataString = ["Artist: " + artist.charAt(0).toUpperCase() + artist.slice(1),
                        "Venue: " + response.data[i].venue.name,
                        "Date: " + date
                    ].join("\n");

                    console.log("------------------------------");
                    // first letter uppercase code taken from https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
                    console.log("Artist: " + artist.charAt(0).toUpperCase() + artist.slice(1));
                    console.log("Venue: " + response.data[i].venue.name);
                    console.log("Date: " + date)

                    // calls logData with the dataString

                    logData(dataString);

                }
            }
        )
    }
}

function fromFile() {
    fs.readFile('./random.txt', 'utf8', function (error, data) {

        // if the code experiences any errors it will log the error to the console:

        if (error) {
            return console.log(error);
        }

        // then split the returned data by commas (to pass to the relevant function):

        let dataArray = data.split(", ");

        // command and input taken from the random.txt file:

        command = dataArray[0];

        input = dataArray.splice(1, dataArray.length, ' ');

        // checks the data from the random.txt file and runs the corresponding function:

        // NOTE: this allows for the random.txt file to be changed. the program will still work if the file contains a movie or artist.

        switch (command) {
            case "movie":
                command = "RANDOM MOVIE:\n";
                movie(user.input);
                break;
            case "song":
                command = "RANDOM SONG:\n";
                song(user.input);
                break;
            case "concert":
                command = "RANDOM CONCERT:\n";
                concert(user.input);
                break;

        }
    });
}