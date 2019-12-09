/* Use this file to do a semantic analysis on the data.
 Download D3 (Also in Javascript!!)

 Take data and find most common words in stories. 
    # Does this exist already or do I have to write code for this?
    # Most common words: are we counting by appearances overall or only once per observation? 
    # Take all observations, put into one long string, convert into list of strings, rank words by # of appearances. Put into list. 
    #   That's the brute force way but doesn't sound efficient.
    #   Stack Overflow has code for this: https://stackoverflow.com/questions/3594514/how-to-find-most-common-elements-of-a-list
    #   Wait what about this from Bubble Chart website (it requires data from a CSV though) 
        data = d3.csvParse(await FileAttachment("flare.csv").text(), ({id, value}) => ({name: id.split(".").pop(), title: id.replace(/\./g, "/"), group: id.split(".")[1], value: +value}))
        # but this means re-downloading the data, which seems like a waste of time/energy. 
    # There's also a whole bunch of other code from this chart website but idk what it is. 

 for importing files: https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
 
 Make a bubble chart. Code from https://observablehq.com/@d3/bubble-chart. */

const mapCode = require('./MapCode');
let storiesList = mapCode.returnStoriesList();
let date = mapCode.returnDate();

module.exports = {
    returnMostPopularWords: function() {
        return mostPopularWords(date);
}

function mostPopularWords(date) {
	wordList ={};
	
	for story in storiesList {
		if ((date == "all2018") || (story.date = date)) {
			newWords = story.notes.split();
			for word in newWords {
				if (wordList.keys().includes(word)) {
					wordList[word] += 1;
				}
				else {
					wordList[word] = 1;
				}	
			}
		}
	}	
	
	wordList.sort(function(first, second) {
		return second[1] - first[1];
	});

	return worldList.splice(0, 10);
}
