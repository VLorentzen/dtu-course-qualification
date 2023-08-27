/* 
This script is from the solution DTU Course Analyzer by the DTU Course Analyzer team.
Visit their page for source and more info at:
https://github.com/SMKIDRaadet/dtu-course-analyzer/blob/master/README.md

Date: 19/07-2023
*/

import { data } from './db/data.js'

console.log("runnung");
chrome.runtime.onMessage.addListener(parseMessage); 
console.log("got passed message");

function parseMessage(request, sender, sendResponse) {
	let course=request.getInfo
	let rtab=sender.tab.id
	
	console.log();
	var resp={};
	if(course in data){
		resp[course]=data[course]

		//chrome.storage.local.set(data[course]);
	} else{
		resp[course]=false
		//chrome.storage.local.set(data[course]);
	}
	console.log("parsing message:", resp);
	chrome.tabs.query({active: true, lastFocusedWindow: true}, async function(tabs) {
		//const {data} = await chrome.storage.local.get(["data"])
		chrome.tabs.sendMessage(rtab,resp);

	});
	console.log("parsed message");
}

chrome.action.onClicked.addListener(function(tab) {
	chrome.tabs.create({ url: chrome.runtime.getURL('db.html') });
});
