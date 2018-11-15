(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//pasted per journal entry 4 instructions
const API = {
  getJournalEntries() {
    return fetch("http://localhost:8088/entries").then(response => response.json());
  },

  saveJournalEntry(entryObject) {
    return fetch("http://localhost:8088/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entryObject)
    }).then(response => response.json()).then(() => this.getJournalEntries());
  }

};
var _default = API;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _entryComponent = _interopRequireDefault(require("./entryComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// DOM object will contain functions for manipulating the DOM
// renderJournalEntries function iterates through array of entries and calls component creation function to build element, then appends each to the DOM
const DOM = {
  renderJournalEntries(array) {
    $(".journal").html("");
    array.forEach(object => {
      const section = document.createElement("section");
      $(".journal").append(section);

      const html = _entryComponent.default.sectionChildren(object);

      section.innerHTML += html;
    });
  }

};
var _default = DOM;
exports.default = _default;

},{"./entryComponent":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// component object will hold functions for building dom components
//sectionChildren function takes an entry object and creates html component
const component = {
  sectionChildren(object) {
    let html = `
      <h3 class="date">Date: ${object.date}</h3>
      <p class="concepts">Concepts Covered: ${object.concepts}</p>
      <p class="entry">${object.entry}</p>
      <p class="mood">I'm Feeling: ${object.mood}</p>
      `;
    return html;
  }

};
var _default = component;
exports.default = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _data = _interopRequireDefault(require("./data"));

var _entriesDOM = _interopRequireDefault(require("./entriesDOM"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const formFunctions = {
  moodChoices: document.getElementById("moodChoices"),

  storeSubmission() {
    const journalDate = document.getElementById("journalDate");
    const concepts = document.getElementById("concepts");
    const journalEntry = document.getElementById("journalEntry");
    const dailyMood = this.moodChoices.options[this.moodChoices.selectedIndex];
    const acceptableChars = [" ", ".", ",", "!", "'", "?", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "(", ")", "{", "}", ":", ";", "\"", "-"];
    const entryChars = `${concepts.value} ${journalEntry.value} ${dailyMood.value}`;
    const entryNoPunct = entryChars.replace(/[.,\/!\^&\*;:{}()?]/g, "").toLowerCase();
    const entryWords = entryNoPunct.split(" ");
    const badWords = ["fuck", "shit", "damn", "ass", "bitch", "hell", "dammit", "goddammit", "fucking", "fucked", "asshole"];
    let correctChars = true;
    let noSwearing = true; //loop through all characters entered and check against acceptable characters

    for (let i = 0; i < entryChars.length; i++) {
      if (acceptableChars.indexOf(entryChars[i].toLowerCase()) === -1) {
        correctChars = false;
      }
    } //loop through all entered words (minus punctuation) and check for swear words


    for (let i = 0; i < entryWords.length; i++) {
      if (badWords.includes(entryWords[i])) {
        noSwearing = false;
      }
    }

    if (dailyMood.value === "select") {
      alert("Please select a current mood before submitting");
    } else if (correctChars === false) {
      alert("Please do not use non-alphabetic, non-numeric characters other than basic punctuation, (), {}, : or ;");
    } else if (noSwearing === false) {
      alert("Please don't swear-- it hurts my feelings.");
    } else {
      //create an object with the input values
      let currentEntry = {
        date: journalDate.value,
        concepts: concepts.value,
        entry: journalEntry.value,
        mood: dailyMood.value
      };

      _data.default.saveJournalEntry(currentEntry).then(_entriesDOM.default.renderJournalEntries);

      this.resetForm();
    }
  },

  resetForm() {
    journalDate.value = " ";
    concepts.value = " ";
    journalEntry.value = " ";
    this.moodChoices.selectedIndex = document.getElementById("moodChoices").firstElementChild;
  }

};
var _default = formFunctions;
exports.default = _default;

},{"./data":1,"./entriesDOM":2}],5:[function(require,module,exports){
"use strict";

var _data = _interopRequireDefault(require("./data"));

var _entriesDOM = _interopRequireDefault(require("./entriesDOM"));

var _form = _interopRequireDefault(require("./form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    Main application logic that uses the functions and objects
    defined in the other JavaScript files.

*/
_data.default.getJournalEntries().then(_entriesDOM.default.renderJournalEntries); // function to create entry upon submission


$(document).submit(function (e) {
  // prevent page from reloading
  e.preventDefault(); // assign input to variables

  _form.default.storeSubmission();
}); //add an event listener for radio buttons to filter entries

$(".filter").click(function (e) {
  let mood = e.target.value;

  if (mood) {
    $("section").each(function (i, entry) {
      let moodText = $(entry).find(".mood").text();

      if (moodText.includes(mood) || mood === "all") {
        $(entry).removeClass("hidden");
      } else {
        $(entry).addClass("hidden");
      }
    });
  }
});

},{"./data":1,"./entriesDOM":2,"./form":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNET00uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9mb3JtLmpzIiwiLi4vc2NyaXB0cy9qb3VybmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7QUFDQSxNQUFNLEdBQUcsR0FBRztBQUNWLEVBQUEsaUJBQWlCLEdBQUc7QUFDbEIsV0FBTyxLQUFLLENBQUMsK0JBQUQsQ0FBTCxDQUNKLElBREksQ0FDQyxRQUFRLElBQUksUUFBUSxDQUFDLElBQVQsRUFEYixDQUFQO0FBRUQsR0FKUzs7QUFLVixFQUFBLGdCQUFnQixDQUFDLFdBQUQsRUFBYztBQUM3QixXQUFPLEtBQUssQ0FBQywrQkFBRCxFQUFrQztBQUMzQyxNQUFBLE1BQU0sRUFBRSxNQURtQztBQUUzQyxNQUFBLE9BQU8sRUFBRTtBQUNQLHdCQUFnQjtBQURULE9BRmtDO0FBSzNDLE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsV0FBZjtBQUxxQyxLQUFsQyxDQUFMLENBT0wsSUFQSyxDQU9BLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBVCxFQVBaLEVBUUwsSUFSSyxDQVFBLE1BQU0sS0FBSyxpQkFBTCxFQVJOLENBQVA7QUFTQTs7QUFmUyxDQUFaO2VBa0JlLEc7Ozs7Ozs7Ozs7O0FDakJmOzs7O0FBRkE7QUFDQTtBQUdBLE1BQU0sR0FBRyxHQUFHO0FBQ1YsRUFBQSxvQkFBb0IsQ0FBRSxLQUFGLEVBQVM7QUFDM0IsSUFBQSxDQUFDLENBQUMsVUFBRCxDQUFELENBQWMsSUFBZCxDQUFtQixFQUFuQjtBQUNBLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBZSxNQUFELElBQVk7QUFDeEIsWUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsU0FBdkIsQ0FBaEI7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QUFBLENBQUMsQ0FBQyxLQUFELENBQUQsQ0FBUyxRQUFULENBQWtCLFFBQWxCO0FBQ0Q7QUFDRixLQVBEO0FBUUQ7QUFFRixDQWJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy9wYXN0ZWQgcGVyIGpvdXJuYWwgZW50cnkgNCBpbnN0cnVjdGlvbnNcbmNvbnN0IEFQSSA9IHtcbiAgZ2V0Sm91cm5hbEVudHJpZXMoKSB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2VudHJpZXNcIilcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgfSxcbiAgc2F2ZUpvdXJuYWxFbnRyeShlbnRyeU9iamVjdCkge1xuICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2VudHJpZXNcIiwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShlbnRyeU9iamVjdClcbiAgICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAudGhlbigoKSA9PiB0aGlzLmdldEpvdXJuYWxFbnRyaWVzKCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQVBJXG5cblxuIiwiLy8gRE9NIG9iamVjdCB3aWxsIGNvbnRhaW4gZnVuY3Rpb25zIGZvciBtYW5pcHVsYXRpbmcgdGhlIERPTVxuLy8gcmVuZGVySm91cm5hbEVudHJpZXMgZnVuY3Rpb24gaXRlcmF0ZXMgdGhyb3VnaCBhcnJheSBvZiBlbnRyaWVzIGFuZCBjYWxscyBjb21wb25lbnQgY3JlYXRpb24gZnVuY3Rpb24gdG8gYnVpbGQgZWxlbWVudCwgdGhlbiBhcHBlbmRzIGVhY2ggdG8gdGhlIERPTVxuaW1wb3J0IGNvbXBvbmVudCBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiXG5cbmNvbnN0IERPTSA9IHtcbiAgcmVuZGVySm91cm5hbEVudHJpZXMgKGFycmF5KSB7XG4gICAgJChcIi5qb3VybmFsXCIpLmh0bWwoXCJcIilcbiAgICBhcnJheS5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICAgIGNvbnN0IHNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VjdGlvblwiKVxuICAgICAgJChcIi5qb3VybmFsXCIpLmFwcGVuZChzZWN0aW9uKVxuICAgICAgY29uc3QgaHRtbCA9IGNvbXBvbmVudC5zZWN0aW9uQ2hpbGRyZW4ob2JqZWN0KVxuICAgICAgc2VjdGlvbi5pbm5lckhUTUwgKz0gaHRtbFxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRE9NXG4iLCIvLyBjb21wb25lbnQgb2JqZWN0IHdpbGwgaG9sZCBmdW5jdGlvbnMgZm9yIGJ1aWxkaW5nIGRvbSBjb21wb25lbnRzXG4vL3NlY3Rpb25DaGlsZHJlbiBmdW5jdGlvbiB0YWtlcyBhbiBlbnRyeSBvYmplY3QgYW5kIGNyZWF0ZXMgaHRtbCBjb21wb25lbnRcblxuY29uc3QgY29tcG9uZW50ID0ge1xuICBzZWN0aW9uQ2hpbGRyZW4ob2JqZWN0KSB7XG4gICAgbGV0IGh0bWwgPSBgXG4gICAgICA8aDMgY2xhc3M9XCJkYXRlXCI+RGF0ZTogJHtvYmplY3QuZGF0ZX08L2gzPlxuICAgICAgPHAgY2xhc3M9XCJjb25jZXB0c1wiPkNvbmNlcHRzIENvdmVyZWQ6ICR7b2JqZWN0LmNvbmNlcHRzfTwvcD5cbiAgICAgIDxwIGNsYXNzPVwiZW50cnlcIj4ke29iamVjdC5lbnRyeX08L3A+XG4gICAgICA8cCBjbGFzcz1cIm1vb2RcIj5JJ20gRmVlbGluZzogJHtvYmplY3QubW9vZH08L3A+XG4gICAgICBgXG4gICAgcmV0dXJuIGh0bWxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb21wb25lbnQiLCJpbXBvcnQgQVBJIGZyb20gXCIuL2RhdGFcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9lbnRyaWVzRE9NXCJcblxuY29uc3QgZm9ybUZ1bmN0aW9ucyA9IHtcbiAgbW9vZENob2ljZXM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9vZENob2ljZXNcIiksXG4gIHN0b3JlU3VibWlzc2lvbigpIHtcbiAgICBjb25zdCBqb3VybmFsRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbERhdGVcIik7XG4gICAgY29uc3QgY29uY2VwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbmNlcHRzXCIpO1xuICAgIGNvbnN0IGpvdXJuYWxFbnRyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbEVudHJ5XCIpO1xuICAgIGNvbnN0IGRhaWx5TW9vZCA9IHRoaXMubW9vZENob2ljZXMub3B0aW9uc1t0aGlzLm1vb2RDaG9pY2VzLnNlbGVjdGVkSW5kZXhdO1xuXG5cbiAgICBjb25zdCBhY2NlcHRhYmxlQ2hhcnMgPSBbIFwiIFwiLCBcIi5cIiwgXCIsXCIsIFwiIVwiLCBcIidcIiwgXCI/XCIsIFwiYVwiLCBcImJcIiwgXCJjXCIsIFwiZFwiLCBcImVcIiwgXCJmXCIsIFwiZ1wiLCBcImhcIiwgXCJpXCIsIFwialwiLCBcImtcIiwgXCJsXCIsIFwibVwiLCBcIm5cIiwgXCJvXCIsIFwicFwiLCBcInFcIiwgXCJyXCIsIFwic1wiLCBcInRcIiwgXCJ1XCIsIFwidlwiLCBcIndcIiwgXCJ4XCIsIFwieVwiLCBcInpcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiLCBcIjlcIiwgXCIwXCIsIFwiKFwiLCBcIilcIiwgXCJ7XCIsIFwifVwiLCBcIjpcIiwgXCI7XCIsIFwiXFxcIlwiLCBcIi1cIl1cblxuICAgIGNvbnN0IGVudHJ5Q2hhcnMgPSBgJHtjb25jZXB0cy52YWx1ZX0gJHtqb3VybmFsRW50cnkudmFsdWV9ICR7ZGFpbHlNb29kLnZhbHVlfWBcbiAgICBjb25zdCBlbnRyeU5vUHVuY3QgPSBlbnRyeUNoYXJzLnJlcGxhY2UoL1suLFxcLyFcXF4mXFwqOzp7fSgpP10vZyxcIlwiKS50b0xvd2VyQ2FzZSgpXG4gICAgY29uc3QgZW50cnlXb3JkcyA9IGVudHJ5Tm9QdW5jdC5zcGxpdChcIiBcIilcbiAgICBjb25zdCBiYWRXb3JkcyA9IFtcImZ1Y2tcIiwgXCJzaGl0XCIsIFwiZGFtblwiLCBcImFzc1wiLCBcImJpdGNoXCIsIFwiaGVsbFwiLCBcImRhbW1pdFwiLCBcImdvZGRhbW1pdFwiLCBcImZ1Y2tpbmdcIiwgXCJmdWNrZWRcIiwgXCJhc3Nob2xlXCJdXG4gICAgbGV0IGNvcnJlY3RDaGFycyA9IHRydWVcbiAgICBsZXQgbm9Td2VhcmluZyA9IHRydWVcblxuICAgIC8vbG9vcCB0aHJvdWdoIGFsbCBjaGFyYWN0ZXJzIGVudGVyZWQgYW5kIGNoZWNrIGFnYWluc3QgYWNjZXB0YWJsZSBjaGFyYWN0ZXJzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyeUNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWNjZXB0YWJsZUNoYXJzLmluZGV4T2YoZW50cnlDaGFyc1tpXS50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpIHtcbiAgICAgICAgY29ycmVjdENoYXJzID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL2xvb3AgdGhyb3VnaCBhbGwgZW50ZXJlZCB3b3JkcyAobWludXMgcHVuY3R1YXRpb24pIGFuZCBjaGVjayBmb3Igc3dlYXIgd29yZHNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJ5V29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChiYWRXb3Jkcy5pbmNsdWRlcyhlbnRyeVdvcmRzW2ldKSkge1xuICAgICAgICBub1N3ZWFyaW5nID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGFpbHlNb29kLnZhbHVlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICBhbGVydChcIlBsZWFzZSBzZWxlY3QgYSBjdXJyZW50IG1vb2QgYmVmb3JlIHN1Ym1pdHRpbmdcIilcbiAgICB9IGVsc2UgaWYgKGNvcnJlY3RDaGFycyA9PT0gZmFsc2UpIHtcbiAgICAgIGFsZXJ0KFwiUGxlYXNlIGRvIG5vdCB1c2Ugbm9uLWFscGhhYmV0aWMsIG5vbi1udW1lcmljIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBiYXNpYyBwdW5jdHVhdGlvbiwgKCksIHt9LCA6IG9yIDtcIilcbiAgICB9IGVsc2UgaWYgKG5vU3dlYXJpbmcgPT09IGZhbHNlKSB7XG4gICAgICBhbGVydChcIlBsZWFzZSBkb24ndCBzd2Vhci0tIGl0IGh1cnRzIG15IGZlZWxpbmdzLlwiKVxuICAgIH0gZWxzZSB7XG4gICAgIC8vY3JlYXRlIGFuIG9iamVjdCB3aXRoIHRoZSBpbnB1dCB2YWx1ZXNcbiAgICAgIGxldCBjdXJyZW50RW50cnkgPSB7XG4gICAgICAgIGRhdGU6IGpvdXJuYWxEYXRlLnZhbHVlLFxuICAgICAgICBjb25jZXB0czogY29uY2VwdHMudmFsdWUsXG4gICAgICAgIGVudHJ5OiBqb3VybmFsRW50cnkudmFsdWUsXG4gICAgICAgIG1vb2Q6IGRhaWx5TW9vZC52YWx1ZVxuICAgICAgfVxuICAgICAgQVBJLnNhdmVKb3VybmFsRW50cnkoY3VycmVudEVudHJ5KS50aGVuKERPTS5yZW5kZXJKb3VybmFsRW50cmllcylcbiAgICAgIHRoaXMucmVzZXRGb3JtKClcbiAgICB9XG4gIH0sXG4gIHJlc2V0Rm9ybSgpIHtcbiAgICBqb3VybmFsRGF0ZS52YWx1ZSA9IFwiIFwiXG4gICAgY29uY2VwdHMudmFsdWUgPSBcIiBcIlxuICAgIGpvdXJuYWxFbnRyeS52YWx1ZSA9IFwiIFwiXG4gICAgdGhpcy5tb29kQ2hvaWNlcy5zZWxlY3RlZEluZGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb29kQ2hvaWNlc1wiKS5maXJzdEVsZW1lbnRDaGlsZFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZvcm1GdW5jdGlvbnNcblxuIiwiLypcbiAgICBNYWluIGFwcGxpY2F0aW9uIGxvZ2ljIHRoYXQgdXNlcyB0aGUgZnVuY3Rpb25zIGFuZCBvYmplY3RzXG4gICAgZGVmaW5lZCBpbiB0aGUgb3RoZXIgSmF2YVNjcmlwdCBmaWxlcy5cblxuKi9cbmltcG9ydCBBUEkgZnJvbSBcIi4vZGF0YVwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2VudHJpZXNET01cIlxuaW1wb3J0IGZvcm1GdW5jdGlvbnMgZnJvbSBcIi4vZm9ybVwiXG5cbkFQSS5nZXRKb3VybmFsRW50cmllcygpLnRoZW4oRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKVxuXG5cbi8vIGZ1bmN0aW9uIHRvIGNyZWF0ZSBlbnRyeSB1cG9uIHN1Ym1pc3Npb25cbiQoZG9jdW1lbnQpLnN1Ym1pdChmdW5jdGlvbihlKSB7XG4gIC8vIHByZXZlbnQgcGFnZSBmcm9tIHJlbG9hZGluZ1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIC8vIGFzc2lnbiBpbnB1dCB0byB2YXJpYWJsZXNcbiAgZm9ybUZ1bmN0aW9ucy5zdG9yZVN1Ym1pc3Npb24oKVxufSlcblxuLy9hZGQgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHJhZGlvIGJ1dHRvbnMgdG8gZmlsdGVyIGVudHJpZXNcblxuXG4kKFwiLmZpbHRlclwiKS5jbGljayggZnVuY3Rpb24oZSkge1xuICBsZXQgbW9vZCA9IGUudGFyZ2V0LnZhbHVlXG4gIGlmIChtb29kKSB7XG4gICAgJChcInNlY3Rpb25cIikuZWFjaChmdW5jdGlvbihpLCBlbnRyeSkge1xuICAgICAgbGV0IG1vb2RUZXh0ID0gJChlbnRyeSkuZmluZChcIi5tb29kXCIpLnRleHQoKVxuICAgICAgaWYgKG1vb2RUZXh0LmluY2x1ZGVzKG1vb2QpIHx8IG1vb2QgPT09IFwiYWxsXCIgKSB7XG4gICAgICAgICQoZW50cnkpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKGVudHJ5KS5hZGRDbGFzcyhcImhpZGRlblwiKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxufSkiXX0=
