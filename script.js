class Note {
    constructor(title, info, tags) {
        this.title = title;
        this.info = info;
        this.tags = tags;
    }
}

class UI {
    static displayNotes() {
        const notes = Store.getNotes();

        notes.forEach(note => UI.addNoteToList(note));
    }

    static addNoteToList(note) {
        const note_list = document.querySelector("#display_notes");
        const page = document.createElement("article");

        page.innerHTML = `
            <h1>${note.title}</h1>
            <p>${note.info}</p>
            <p>${note.tags}</p>
            <p><a href="#" class="delete"/>Delete Note</a></p>
        `;

        note_list.appendChild(page);

    }

    static deleteNote(element) {
        if(element.classList.contains("delete")) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector("body");
        const form = document.querySelector("#notes-form");
        container.insertBefore(div, form);

       setTimeout(() => document.querySelector('.alert').remove(), 3000); 
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#notes").value = "";
        document.querySelector("#tags").value = "";
    }

}

class Store {
    static getNotes() {
        let notes;
        if(localStorage.getItem('notes') === null) {
            notes = [];
        } else {
            notes = JSON.parse(localStorage.getItem('notes'));
        }
        return notes;
    }

    static addNote(note) {
        const notes = Store.getNotes();
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    static removeBook(title) {
        const notes = Store.getNotes();

        notes.forEach((note, index) => {
            if(note.title === title) {
                note.splice(index,1);
            }
        });

        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayNotes);

document.querySelector("#notes-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const info = document.querySelector("#notes").value;
    const tag = document.querySelector("#tags").value;

    if(title === '' || info === '' || tag === '') {
        UI.showAlert("Please fill in all fields", 'danger');
    } else {
        const note = new Note(title, info, tag);

        UI.addNoteToList(note);

        Store.addNote(note);

        UI.showAlert('Book Added', 'success');

        UI.clearFields();
    }
})

document.querySelector("#display_notes").addEventListener("click", (event) => {
    UI.deleteNote(event.target);
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book Removed', 'success');
})