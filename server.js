const express = require('express');
const path = require('path');
// I may not want to require this as it keeps changing, and loads...
// the cached version if you require changes
// const notesData = require('./Develop/db/db.json');
const uuid = require('./Develop/helpers/uuid.js');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

// function to read and parse json file
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
    jsonReader('./Develop/db/db.json', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error reading notes' });
        } else {
            res.json(data);
        }
    })
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

app.delete('/api/notes/:id', (req, res) => {
    // Get the note id from the request parameters
    const idToDelete = req.params.id;

    jsonReader('./Develop/db/db.json', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error deleting note' });
        } else {
            // Find the index of the note with the given id
            const index = data.findIndex(note => note.id === idToDelete);

            if (index !== -1) {
                // Remove the note from the array if it is found in the data array
                data.splice(index, 1);

                const updatedDataString = JSON.stringify(data, null, 2);
                fs.writeFile('./Develop/db/db.json', updatedDataString, err => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: 'Error deleting note' });
                    } else {
                        console.log('Note deleted successfully');

                        const response = {
                            status: 'success',
                            message: 'Note deleted successfully',
                        };

                        console.log(response);
                        res.status(200).json(response);
                    }
                });
            } else {
                // If the note with the given id is not found, return an error
                res.status(404).json({ error: 'Note not found' });
            }
        }
    });
});


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
