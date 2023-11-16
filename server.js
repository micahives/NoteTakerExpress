const exp = require('constants');
const express = require('express');
const path = require('path');
const notesData = require('./Develop/db/db.json');
const uuid = require('./Develop/helpers/uuid.js');

// more research on this env object
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));

// GET route for homepage (HTML route)
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page (HTML route)
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for db.json (API route) to store saved notes
app.get('/api/notes', (req, res) =>
    res.json(notesData)
);

// POST route for save new note and return updated db.json (API route)
// TODO: give each note a unique ID when saved
app.post('/api/notes', (req, res) => {
        // log that POST request was received
        console.info(`${req.method} request received to add a note`);

        // TODO: work of the post request
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));