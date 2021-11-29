import Timer from "./timer.js"
// const baseURL = `http://localhost:4004/api/timers`
// const errCallback = err => console.log(err.response.data)


new Timer(document.getElementById("rinse"), " Rinse Timer");
new Timer(document.getElementById("dev"), " Developer Timer");
new Timer(document.getElementById("fixer"), " Fixer Timer");
new Timer(document.getElementById("soak"), " Soak Timer");
new Timer(document.getElementById("stbl"), " Stabilizer Timer");