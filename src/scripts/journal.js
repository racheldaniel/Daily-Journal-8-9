/*
    Main application logic that uses the functions and objects
    defined in the other JavaScript files.

*/
import API from "./data"
import DOM from "./entriesDOM"
import formFunctions from "./form"

API.getJournalEntries().then(DOM.renderJournalEntries)


// function to create entry upon submission
$(document).submit(function(e) {
  // prevent page from reloading
  e.preventDefault();
  // assign input to variables
  formFunctions.storeSubmission()
})

//add an event listener for radio buttons to filter entries


$(".filter").click( function(e) {
  let mood = e.target.value
  if (mood) {
    $("section").each(function(i, entry) {
      let moodText = $(entry).find(".mood").text()
      if (moodText.includes(mood) || mood === "all" ) {
        $(entry).removeClass("hidden")
      } else {
        $(entry).addClass("hidden")
      }
    })
  }

})