require("dotenv").config();


const axios = require("axios");
// // require axios

const keys = require("./keys.js");
// // require import of keys.js file

var Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);


// spotify
console.log(spotify);

const inquirer = require("inquirer");
// inquirer

const moment = require('moment');
// moment
moment().format();

const liri = function() {
    inquirer.prompt([{
            // list for user to make a selection
            type: "list",
            message: "What would you like to do?",
            choices: ["concert-this", "spotify-this-song", "movie-this"],
            name: "choice"
        },

        {
            type: "input",
            message: "What would you like search?",
            name: "search",
            validate: function(user) {
                // validate if user input something
                if (user.choice === 'movie-this' && user.search === undefined) {
                    // if user choice is movie this and input was blank

                    user.search = 'mr nobody'
                        // change the input to mr nobody
                }
                return true;
            },
            consolelog: function(user) {
                if (user.choice !== "") {
                    console.log(`this is what you searched: ${user.search}`);
                }
            }
        },

    ]).then(function(user) {

        var userInput = JSON.stringify(user.choice);
        console.log(userInput);
        // pull userinput
        var searchInput = user.search;
        console.log(searchInput);
        // pull user search term


        const getConcertInfo = async function() {
            let queryURLConcert = (`https://rest.bandsintown.com/artists/${searchInput}/events?app_id=codingbootcamp`);

            try {
                const response = await axios.get(queryURLConcert);
                // PULLS response:
                console.log(JSON.stringify(response.data[0].venue.name));
                // name of the venue
                console.log(`${response.data[0].venue.city},${response.data[0].venue.region}`);
                // venue location
                // console.log(`${response.data[0].datetime}`);
                StartDate = moment(response.data[0].datetime).format('MM-DD-YYYY');
                console.log(StartDate);
                // date of the event using moment to format as "MM/DD/YYYY"
            } catch (e) {
                console.log(e);
            }
        };

        const getSpotifyInfo = function() {
            if (searchInput.length < 0) {
                searchInput === 'i want it that way'
            }
            spotify.search({ type: 'track', query: searchInput, limit: 1 }).then(function(response) {
                    // default the sign ace of base
                    // PULLS response:
                    console.log(JSON.stringify(response));

                    // artist(s)
                    console.log(`ARTIST: ${JSON.parse(response[0])}`);
                    console.log(`ITEMS: ${response.tracks.items}`);

                    // the song's name
                    console.log(`SONG NAME: ${response.album}`);
                    console.log(`SONG NAME2: ${JSON.stringify(response.album)}`);

                 
                })
                .catch(function(err) {
                    console.log(err);
                });

        };

        let queryURLMovie = (`http://www.omdbapi.com/?t=${searchInput}&y=&plot=short&apikey=trilogy`);

        const getMovieInfo = async function() {

            try {
                const response = await axios.get(queryURLMovie);
                // PULLS response:
                // pulls:
                console.log("Title: " + response.data.Title);
                // Title of the movie
                console.log("Year released: " + response.data.Year);
                // Year the movie came out
                console.log("Rated: " + response.data.Rated);
                // IMDB Rating of the movie
                console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
                // Rotten tomatoes rating of the movie
                console.log("Country: " + response.data.Country);
                // country where the movie was produced
                console.log("Language(s): " + response.data.Language);
                // language of the movie
                console.log("Plot: " + response.data.Plot);
                // plot of the movie
                console.log("Actors: " + response.data.Actors);
                // actors in the movie

              
            } catch (e) {
                console.log(e);
            }

        };

        if (user.choice === 'concert-this') {
            console.log(`Concert Details`);
            getConcertInfo();
        } else if (user.choice === 'spotify-this-song') {
            getSpotifyInfo();
            console.log(`Song Details`)
        } else if (user.choice === 'movie-this') {
         
            getMovieInfo();
            // console.log(searchInput);
            console.log(`Movie Details`)
                // }
        }


    });
}
liri();
