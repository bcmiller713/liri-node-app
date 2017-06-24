//-----------KEYS/GLOBAL VARIABLES------------//
var keys = require("./keys.js");
var twitterKeysObject = keys.twitterKeys;
var spotifyKeysObject = keys.spotifyKeys;
var nodeInput = process.argv.slice(2);

//--------------TWITTER FUNCTION---------------//
function twitter() {
	var Twitter = require("twitter");
	var client = new Twitter({
		consumer_key: twitterKeysObject.consumer_key,
		consumer_secret: twitterKeysObject.consumer_secret,
		access_token_key: twitterKeysObject.access_token_key,
		access_token_secret: twitterKeysObject.access_token_secret
	});
	var params = {screen_name: 'bruce_bones', count: "20"};
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (error) {
			return console.log('Error occurred: ' + err);
		}
		for (i = 0; i < 20; i++) {
			console.log("-------------\n"+ "Tweet #" + parseInt(i+1) + ": " + tweets[i].text + "\nDate/Time: " + tweets[i].created_at + "(GMT)");
		}		
	});
};

//---------------SPOTIFY FUNCTION-------------//
function spotify() {
	var Spotify = require("node-spotify-api");
	var spotify = new Spotify({
		id: spotifyKeysObject.client_key,
		secret: spotifyKeysObject.client_secret
	});
	var songName = "";
	for (i = 1; i < nodeInput.length; i++) {
		if (i === 1) {
			songName += nodeInput[i];
		}
		if (i > 1 && i < nodeInput.length) {
			songName += " " + nodeInput[i]; 
		} 
	}
	if (songName === "") {
		console.log("No song selected...How about some Ace Of Base?");
		songName = "The Sign Ace of Base";
	}
	spotify.search({ type: "track", query: songName, limit: 1 }, function(err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
		}
		console.log("Song Name: " + data.tracks.items[0].name);
		console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
		console.log("Album Name: " + data.tracks.items[0].album.name);
		console.log("Preview Link: " + data.tracks.items[0].preview_url);
	});
};

//-----------OMDB FUNCTION-----------//
function omdb() {
	var request = require("request");
	var movieName = "";
	for (i = 1; i < nodeInput.length; i++) {
		if (i === 1) {
			movieName += nodeInput[i];
		}
		if (i > 1 && i < nodeInput.length) {
			movieName += "+" + nodeInput[i]; 
		} 
	}
	if (movieName === "") {
		movieName = "mr+nobody";
		console.log("No movie selected...How about Mr. Nobody?")
	}
	var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	request(queryURL, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Synopsis: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("Website: " + JSON.parse(body).Website);
		}
	});	
};

//-------------DO-WHAT-IT-SAYS-------------//
function random() {
	var fs = require("fs");
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}
		var randomArray = data.split(",");
		songName = randomArray[1];
		var Spotify = require("node-spotify-api");
		var spotify = new Spotify({
			id: spotifyKeysObject.client_key,
			secret: spotifyKeysObject.client_secret
		});
		spotify.search({ type: "track", query: songName, limit: 1 }, function(err, data) {
			if (err) {
				console.log('Error occurred: ' + err);
			}
			console.log("Song Name: " + data.tracks.items[0].name);
			console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
			console.log("Album Name: " + data.tracks.items[0].album.name);
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
		});
	});
};

//-----------BASE LOGIC-------------//
if (nodeInput[0] === "my-tweets") {
	twitter();
}
else if (nodeInput[0] === "spotify-this-song") {
	spotify();
}
else if (nodeInput[0] === "movie-this") {
	omdb();
}
else if (nodeInput[0] === "do-what-it-says") {
	random();
}