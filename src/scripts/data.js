//pasted per journal entry 4 instructions
const API = {
  getJournalEntries() {
    return fetch("http://localhost:8088/entries")
      .then(response => response.json())
  },
  saveJournalEntry(entryObject) {
   return fetch("http://localhost:8088/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entryObject)
    })
    .then(response => response.json())
    .then(() => this.getJournalEntries())
  }
}

export default API


