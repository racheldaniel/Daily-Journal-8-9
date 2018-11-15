import API from "./data"
import DOM from "./entriesDOM"

const formFunctions = {
  moodChoices: document.getElementById("moodChoices"),
  storeSubmission() {
    const journalDate = document.getElementById("journalDate");
    const concepts = document.getElementById("concepts");
    const journalEntry = document.getElementById("journalEntry");
    const dailyMood = this.moodChoices.options[this.moodChoices.selectedIndex];


    const acceptableChars = [ " ", ".", ",", "!", "'", "?", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "(", ")", "{", "}", ":", ";", "\"", "-"]

    const entryChars = `${concepts.value} ${journalEntry.value} ${dailyMood.value}`
    const entryNoPunct = entryChars.replace(/[.,\/!\^&\*;:{}()?]/g,"").toLowerCase()
    const entryWords = entryNoPunct.split(" ")
    const badWords = ["fuck", "shit", "damn", "ass", "bitch", "hell", "dammit", "goddammit", "fucking", "fucked", "asshole"]
    let correctChars = true
    let noSwearing = true

    //loop through all characters entered and check against acceptable characters
    for (let i = 0; i < entryChars.length; i++) {
      if (acceptableChars.indexOf(entryChars[i].toLowerCase()) === -1) {
        correctChars = false
      }
    }

    //loop through all entered words (minus punctuation) and check for swear words
    for (let i = 0; i < entryWords.length; i++) {
      if (badWords.includes(entryWords[i])) {
        noSwearing = false
      }
    }

    if (dailyMood.value === "select") {
      alert("Please select a current mood before submitting")
    } else if (correctChars === false) {
      alert("Please do not use non-alphabetic, non-numeric characters other than basic punctuation, (), {}, : or ;")
    } else if (noSwearing === false) {
      alert("Please don't swear-- it hurts my feelings.")
    } else {
     //create an object with the input values
      let currentEntry = {
        date: journalDate.value,
        concepts: concepts.value,
        entry: journalEntry.value,
        mood: dailyMood.value
      }
      API.saveJournalEntry(currentEntry).then(DOM.renderJournalEntries)
      this.resetForm()
    }
  },
  resetForm() {
    journalDate.value = " "
    concepts.value = " "
    journalEntry.value = " "
    this.moodChoices.selectedIndex = document.getElementById("moodChoices").firstElementChild
  }
}

export default formFunctions

