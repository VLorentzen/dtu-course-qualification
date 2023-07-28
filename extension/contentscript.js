/* 
This script is origionally from the solution DTU Course Analyzer by the DTU Course Analyzer team.
Visit their page for source and more info at:
https://github.com/SMKIDRaadet/dtu-course-analyzer/blob/master/README.md

Changes have been made for it to fit the intended purpose of this solution

Editor: Extrillo
Date: 17/07-2023
*/


/*
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  var course = tabs[0].url.split("/").slice(-1);
  // use `url` here inside the callback because it's asynchronous!
});
console.log("star of content script Course ID:", course);
*/

course = window.location.href.match(
  /^http.:\/\/kurser.dtu.dk\/course\/(?:[0-9-]*\/)?([0-9]{5})/
)[1];

  
if (course.length == 5) {
  console.log("Course ID:", course);
  chrome.runtime.sendMessage({ getInfo: course });
}
  
chrome.runtime.onMessage.addListener(listen);
                                        
function listen(request, sender, sendResponse) {
  console.log("Attempting to add listener");
  if (request[course]) {
    presentData(request[course]);
  }
  console.log("Added listener");
}
  
outputArr = [
  ["Recommended for", "Recommended for", "", []],
  ["Mandatory for", "Mandatory for", "", []],
];

function presentData(data) {
  $(".box.information > table")
    .last()
    .before($("<table/>").append($("<tbody/>", { id: "DTU-Course-Qualification" })));
    //addRow($("<span/>").text("—DTU Course Qualification—"));
  
  if (data) {
    for (i = 0; i < outputArr.length; i++) {
      key = outputArr[i][1];
      val = data[key];

      if (true) {// typeof val != "undefined" && !isNaN(val) && outputArr[i][3] != []
        addRow(
          $("<span/>", { text: outputArr[i][0] }),
          val.join(", ")
          //val.join(', '),
          //outputArr[i][2],
          //true,
          //outputArr[i][3]
        );
      }
    }
  } else {
    addRow("No data found for this course");
  }
  addRow(
    $("<a/>", {
      href: "https://github.com/Extrillo/dtu-course-qualification/tree/main",
      target: "_blank",
    }).append($("<label/>", { text: "help" }))
  );
}
  
var tdIndex = 0;
  
function addRow(
  td1Elem,
  td2val = "",
  unitText = "",
  colored = false,
  maxValue = 1
  ) 
  {
    id = "dca-td-" + tdIndex;
  
    $("#DTU-Course-Qualification").append(
      $("<tr/>")
        .append($("<td/>").append($("<b/>").append(td1Elem)))
        .append(
          $("<td/>").append($("<span/>", { id: id, text: td2val + unitText }))
        )
    );
  
    if (colored) {
      elem = document.getElementById(id);
      elem.style.backgroundColor = getColor(1 - td2val / maxValue);
    }
    tdIndex++;
  }

/*

  function PrintCoursesHTML(value){
    element = $("<a/>", {
      href: "http://kurser.dtu.dk/course/".concat(value),
      target: "_blank",
      text: value.concat(" ")
      }
    )//.append($("<label/>", { text: value.concat(" ") }))    
    return element;
  }

function addRowHyperlink(
    td1Elem,
    td2val = "",
    unitText = "",
    colored = false,
    maxValue = 1
  ) {
    id = "dca-td-" + tdIndex;

    td2Elem = [];
    for (element in td2val){
      td2Elem.append(PrintCourseHTML(td2val));
    }
    $("#DTU-Course-Qualification").append(
      $("<tr/>")
        .append($("<td/>").append($("<b/>").append(td1Elem)))
        //.append($("<td/>").append($("<span/>", { id: id, text: td2val + unitText }))
        //.append($("<td/>").append(td2Elem))
        .append($("<td/>").append($("<b/>").append(td2Elem.join())))
    );
  
    if (colored) {
      elem = document.getElementById(id);
      elem.style.backgroundColor = getColor(1 - td2val / maxValue);
    }
    tdIndex++;
  */