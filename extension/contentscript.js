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
  if (request) {
    presentData(request);
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
  
  if (data[course]) {
    for (i = 0; i < outputArr.length; i++) {
      key = outputArr[i][1];
      val = data[course][key];
      courseNames = [];

      for (j = 0; j < val.length; j++){
        courseNames = courseNames.concat([data[val[j]]['English title']]);
      }
      console.log("Here are the course names...");
      console.log(courseNames);

      console.log("Checking if list is empty... ");
      console.log(val.length);
      console.log("Here's what's in val...");
      console.log(val);

      if (val.length >= 1) {
        addRowWithHref(
          $("<span/>", { text: outputArr[i][0] }),
          val,
          courseNames
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
    }).append($("<label/>", { text: "Further courses..?", title: 'DTU Course Qualification adds "prerequisite for courses" to course information' }))
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
    tdIndex++;
  }

  function addRowWithHref(
    td1Elem,
    td2val = "",
    courseNames = "",
    colored = true,
    maxValue = 1
    ) 
    {
      id = "dca-td-" + tdIndex;

      temp = $("<td/>")
      for (i = 0; i < td2val.length; i++) {
        temp.append($("<a/>", { id: id, text: td2val[i], href: "https://kurser.dtu.dk/course/" + td2val[i], title: courseNames[i] }))
        if (i < td2val.length -1 ){
          temp.append($("<span/>",{text:", "}))
        }
      }

      $("#DTU-Course-Qualification").append(
        $("<tr/>")
        .append($("<td/>").append($("<b/>").append(td1Elem)))
        .append(temp)
      );

      tdIndex++;
    }