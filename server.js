const express = require('express');
const path = require('path');
const notesData = require('./Develop/db/db.json');
const uuid = require('./Develop/helpers/uuid.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// middleware for static files
app.use('/', express.static(path.join(__dirname, './Develop/public')));

// GET route for homepage (HTML route)
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './Develop/public/index.html'))
);

// GET route for notes page (HTML route)
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
);

// GET route for stylesheet
app.get('/assets/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/assets/css/styles.css'));
});

// GET route for db.json (API route) to store saved notes
app.get('/api/notes', (req, res) =>
    res.json(notesData)
);

// POST route for save new note and return updated db.json (API route)
// TODO: give each note a unique ID when saved
app.post('/api/notes', (req, res) => {
        // log that POST request was received
        console.info(`${req.method} request received to add a note`);

        const { title, text } = req.body;

        if (title && text) {
            const newNote = {
                title,
                text,
                note_id: uuid(),
            };

            const response = {
                status: 'success',
                body: newNote,
            };

            console.log(response);
            res.status(200).json(response);
        } else {
            res.status(500).json('Error in posting note');
        }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));