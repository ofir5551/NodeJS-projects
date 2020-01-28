const fs = require("fs");
const chalk = require('chalk');

const addNote = (title, body) => {
    const notes = loadNotes();
    const duplicateNote = notes.find((note) => note.title == title)

    if (!duplicateNote) {
        notes.push({
            title: title,
            body: body
        });
        saveNotes(notes);
        console.log(chalk.green.inverse('New note added!'));
    } else {
        console.log(chalk.red.inverse('Note title is taken!'));
    }

}

const removeNote = (title) => {
    const notes = loadNotes();
    const notesToKeep = notes.filter(function (note) {
        return note.title != title;
    });

    if (notesToKeep.length == notes.length) {
        console.log(chalk.red.inverse(`Title '${title}' not found!`));
    } else {
        saveNotes(notesToKeep);
        console.log(chalk.green.inverse(`Note '${title}' has been removed!`));
    }
}

const readNote = (title) => {
    const notes = loadNotes();
    const noteToRead = notes.find((note) => note.title == title)

    if (noteToRead) {
        console.log(chalk.inverse(noteToRead.title));
        console.log(noteToRead.body);
    }
    else
        console.log(chalk.red.inverse(`Note ${title} not found`));
}

const listNotes = () => {
    const notes = loadNotes();

    if (notes.length == 0)
        console.log(chalk.red.inverse("No notes found"));
    else {
        console.log(chalk.inverse("Your notes:"));
        notes.forEach((note, index) => console.log(index + 1, note.title))
    }
}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json', dataJSON);
}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync("notes.json");
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
};
