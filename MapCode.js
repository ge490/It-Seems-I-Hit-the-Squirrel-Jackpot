// Use this file to take existing Stories objects and put them onto a map. 

// Draw squares on a map of Central Park using Leaflet. Squares represent hectares. 
// Attach stories to hectares somehow. 
// Be able to filter stories by date.

// Leaflet docs: https://leafletjs.com/reference-1.5.0.html 
// Leaflet tutorial: https://leafletjs.com/examples/quick-start/
// Leaflet is in Javascript!! 

// Possible model: http://pfch.nyc/311_map/index.html, https://github.com/alanalien/MTA_artlist

// Create a map! initialize the map on the "map" div with a given center and zoom
var mymap = L.map('mapid').setView([40.7829,73.9654], 10);

// MapBox tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11'
}).addTo(mymap);

hectareKey = {}

plotSquares();
assignStoriesToSquares(results(), storiesList);

function plotSquares() {
	cornersList = findCorners();
	
	for col in cornersList {
		for row in cornersList[col] {
			var newSq = L.polygon(cornerList[row][col]);
			newSq.addTo(mymap);
			hectareKey[getHectLabel(row, col)] = newSq;
		}
	}
}

function getHectLabel(num, letr) {
	lettersKey = {"0": "A"; "1": "B"; "2":"C"; "3":"D"; "4":"E"; "5":"F"; "6":"G"; "7":"H"; "8":"I"}
	return num.toString() + lettersKey[letr];
}

function findCorners() {
	// loop through map coords & find each square's corners, store in a list

	// central park corners: [40.796869, -73.949262], [40.768078, -73.981749], 
	// [40.800391, -73.958159], [40.764318, -73.973020]
	
	var allSquares = [][];
	var currentSquare = [];
	
	var startLat = 40.768078; // bottom left corner x
	var startLong = -73.981749; // bottom left corner y
	
	var currentLat = startLat;
	var currentLong = startLong;
	
	let coordTuple = [number, number];
	
	for (col = 0; col < 9; col++) {
		for (row = 0; row < 42; row++) {
			newLat = newLat(currentLat);
			newLong = newLong(currentLong);
			
			newSq = []
			
			coordTuple bottomLeft = [startLat, startLong];
			coordTuple bottomRight = [getNewXWhenMoveSE(newLong), newLong];
			coordTuple topRight = [newLat(bottomRight[0]), getNewYWhenMoveNE(newLat(bottomRight[0]))];
			coordTuple topLeft = [newLat, getNewYWhenMoveNE(newLat)];
			
			newSq.add(bottomLeft);
			newSq.add(bottomRight);
			newSq.add(topRight);
			newSq.add(topLeft);
			
			allSquares[row][col] = newSq;
			
			currentLat = newLat;
		}
		currentLong = newLong;
	}
	
	return allSquares;
}

function newLat(x) {
	return x + 7.694*Math.exp(-4);
}

function newLong(y) {
	return y - 9.6989*Math.exp(-4);
}

function getNewYWhenMoveNE(x) {
	return (0.73004*newLat(x)-103.74435);
}

function getNewXWhenMoveSE(y) {
	return ((y-20.71441)/-2.3227);
}

// somehow get storiesList

function assignStoriesToSquares(date, storiesList) {
	for key, value in hectareKey {
		var data = "";
		for story in storiesList {
			if ((story.hectare = key && date == "all2018") || (story.hectare = key && story.date = date))  {
				data += story.date + " " + story.shift + "\n\n" + story.notes;
			}
		}
		value.bindPopUp(data);
	}
}

function results() { 
		var date = document.getElementById("Date").value;
		
		return date.toString() + "2018";
}
