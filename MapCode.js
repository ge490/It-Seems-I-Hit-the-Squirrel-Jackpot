storiesList = new Array();

class Story {
	constructor(hect, shift, date, notes) {
	    this.hectare = hect
        this.shift = shift
        this.date = date
        this.notes = notes
	}
}

function dataDownload() { 
	$.ajax({
		url: "https://data.cityofnewyork.us/resource/gfqj-f768.json",
		type: "GET",
		async: false,
		data: {
		  "$limit" : 900,
		  "$$app_token" : "TkRdzZxXZww7Khfwq84rH02To"
		}
	}).done(function(data) {
		for (key in data) {
			var value = data[key];
			var hect = value["hectare"];
			
			var newStory = new Story(hect, value["shift"], value["date"], value["note_squirrel_park_stories"]);
			
			var storiesListKeys = Object.keys(storiesList);

			if (!storiesListKeys.includes(hect)){
				storiesList[hect] = [];
			}
							
			storiesList[hect].push(newStory);
		}
	});
}

var mymap = L.map('mapid').setView([40.7829,-73.9654], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11'
}).addTo(mymap);

var popup = L.popup();

hectareKey = {}

dataDownload();
plotSquares();
addStories("all2018");
displayPopularWords("all2018");

function plotSquares() {
	var cornersList = findCorners();
	
	for (var col = 0; col < 9; col++) {
		for (var row = 0; row < 42; row++) {
			var sqLatLngs = cornersList[row][col];
			var newSq = L.polygon(sqLatLngs).addTo(mymap);
			
			var r = row+1;
			if (row < 9) {
				r = "0" + r;
			}
			
			var hectLabel = getHectLabel(r, col);
			hectareKey[hectLabel] = newSq;
		}
	}
}

function getHectLabel(num, letr) {
	lettersKey = {"0": "A", "1": "B", "2":"C", "3":"D", "4":"E", "5":"F", "6":"G", "7":"H", "8":"I"};
	return num.toString() + lettersKey[letr];
}

function newLatFormula(oldLat) {
	return (oldLat + 0.00076935714);
}

function newLongFormula(oldLong) {
	return (oldLong + 0.00096988888);
}

function getNewLongWhenMoveNE(bottomCorner, thisLat) {
	return 0.73004673041817*(thisLat - bottomCorner.lat) + bottomCorner.lng;
}

function getNewLatWhenMoveSE(lng) {
	return ((lng-20.663078888708)/-(2.3215425531885));
}

function findCorners() {
	var allSquares = new Array(42).fill(0).map(() => new Array(9).fill(0));;
	var currentSquare = [];
	
	var startLat = 40.768078;
	var startLong = -73.981749;

	var initSq = [L.latLng(0,0), L.latLng(0,0), L.latLng(startLat, startLong), L.latLng(0,0)];
	var currentSq = [L.latLng(0,0), L.latLng(0,0), L.latLng(startLat, startLong), L.latLng(0,0)];
	
	var indexBottomLeft = 0;
	var indexBottomRight = 1;
	var indexTopRight = 2;
	var indexTopLeft = 3;
	
	for (col = 0; col < 9; col++) {
		for (row = 0; row < 42; row++) {	 
			newSq = [];
			
			var bottomLeftCorner = L.latLng(currentSq[indexTopRight].lat, currentSq[indexTopRight].lng);

			var bottomRightCorner = L.latLng(currentSq[indexTopLeft].lat, currentSq[indexTopLeft].lng);
			
			if (bottomRightCorner.lat == 0) {
				bottomRightCorner.lng = newLongFormula(bottomLeftCorner.lng);
				bottomRightCorner.lat = getNewLatWhenMoveSE(bottomRightCorner.lng);			
			}
			
			var newTopLeftLat = newLatFormula(bottomLeftCorner.lat);
			var newTopLeftLng = getNewLongWhenMoveNE(bottomLeftCorner, newTopLeftLat);
			var topLeftCorner = L.latLng(newTopLeftLat, newTopLeftLng);

			var topRightLat = newLatFormula(bottomRightCorner.lat);
			var topRightLong = getNewLongWhenMoveNE(bottomRightCorner, topRightLat);
			
			var topRightCorner = L.latLng(topRightLat, topRightLong);
			
			if (row == 0) {
				initSq[indexTopRight].lat = bottomRightCorner.lat;
				initSq[indexTopRight].lng = bottomRightCorner.lng;
			}
			
			newSq.push(bottomLeftCorner);
			newSq.push(bottomRightCorner);
			newSq.push(topRightCorner);
			newSq.push(topLeftCorner);
						
			allSquares[row][col] = newSq;
			
			currentSq = newSq;
		}
		currentSq = initSq;
	}
	
	return allSquares;
}

function addStories(date) {
	for (key of Object.keys(hectareKey)) {
		var value = hectareKey[key];
		var data = "HECTARE: " + key;
		var hectareStoryArr = storiesList[key]

		if (hectareStoryArr != undefined) {
			for (story of hectareStoryArr) {
				if ((date == "all2018") || (story.date == date)) {
					data += " DATE: " + story.date + " " + story.shift + " NOTES: " + story.notes;
				}
			}
			value.bindPopup(data);

		}
	}
}

const form = document.querySelector("form");

$("#dateform").submit(function( event ) {
	event.preventDefault();
	
	var date = convertDate(form.elements[0].value);
		
	addStories(date);
	displayPopularWords(date);
});

function convertDate(filterResult) { 
		var date = "";
		
		if (filterResult != "all2018") {
			date = filterResult + "2018"
		}

		return date;
}

function mostPopularWords(date) {
	var wordList = {};
	var commonWords = [",", "—", "", "of", "in", "for", "on", "with",
		"at", "by", "from", "up", "about", "into", "over", "after", "the",
		"and", "a", "that", "I", "it", "not", "he", "as", "you", "this", 
		"but", "his", "they", "her", "she", "or", "an", "will", "my", "one",
		"all", "would", "there", "their", "to", "was", "were", "is", "are", "be",
		"The", "-", "A"];
	
	for (key of Object.keys(hectareKey)) {
		var hectareStoryArr = storiesList[key]
		
		if (hectareStoryArr != undefined) {
			for (story of hectareStoryArr) {
				if ((date == "all2018") || (story.date == date)) {
					var words = story.notes;
					var newWords = words.split(" ");
					for (word of newWords) {
						if (Object.keys(wordList).includes(word) && !commonWords.includes(word)) {
							wordList[word] += 1;
						}
						else {
							wordList[word] = 1;
						}	
					}
				}
			}
		}
	}	
	
	var sortedWordList = Object.keys(wordList).map(function(key) {
		return [key, wordList[key]];
	});
	
	sortedWordList.sort(function(first, second) {
		return second[1] - first[1];
	});

	var popWords = sortedWordList.splice(0, 10);
	var finalList = "";
	var idx = 1;
	
	for (word of popWords) {
		finalList += "<p>" + idx + ". " + word[0] + " (" + word[1] + " occurrences).<\p>";
		idx++;
	}
	return finalList;
}

function displayPopularWords(date) {
	var ele = document.getElementById("PopWordsList");
	ele.innerHTML = mostPopularWords(date);
	return;
}