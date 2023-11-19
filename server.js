const express = require('express');
const path = require('path');
// I may not want to require this as it keeps changing, and loads...
// the cached version if you require changes
const notesData = require('./Develop/db/db.json');
const uuid = require('./Develop/helpers/uuid.js');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

function jsonReader(filePath, cb) {
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    });
}

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

// GET route for db.json (API route) to store saved notes
app.get('/api/notes', (req, res) =>
    res.json(notesData)
);

// POST route for save new note and return updated db.json (API route)
app.post('/api/notes', (req, res) => {
        // log that POST request was received
        console.info(`${req.method} request received to add a note`);

        const { title, text } = req.body;

        if (title && text) {

            const newNote = {
                title,
                text,
                id: uuid(),
            };    

            jsonReader('./Develop/db/db.json', (err, data) => {
                if (err) {
                    console.log(err);
                } else {

                    data.push(newNote)

                    const newNoteString = JSON.stringify(data, null, 2);

                    fs.writeFile('./Develop/db/db.json', newNoteString, err => {
                        if (err) {
                            console.log(err);
                            res.status(500).json('Error in posting note');
                        } else {
                            console.log('New data added');

                            const response = {
                                status: 'success',
                                body: newNote,
                            };

                            console.log(response);
                            res.status(200).json(response);
                        }
                    });
                }
            });

        } else {
            res.status(500).json('Error in posting note');
        }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
