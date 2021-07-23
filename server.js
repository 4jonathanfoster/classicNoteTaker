// Require Dependinces
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/notes", (req, res) => {
    console.log(`Hitting the API/Notes Route`);
    res.json(db);
})

app.post("/api/notes", (req, res) => {
    console.log(`Hitting the API/Notes Route (with post request)`);

    let noteTaken = req.body;
    noteTaken.id = uuidv4();
    db.push(noteTaken);
    fs.writeFileSync("./db/db.json", JSON.stringify(db), (err) => { if (err) throw err; });
    res.send(db)
})

app.delete("/api/notes/:id", (req, res) => {
    console.log(`Hitting the API/NOTES Route (with delete request)`);

    const trash = db.findIndex(note => note.id === req.params.id);
    db.splice(trash, 1);
    fs.writeFile("db/db.json", JSON.stringify(db), (err) => { if (err) throw err; })
    res.send(db)
})

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () => { console.log(`Listening at ${PORT}`); })