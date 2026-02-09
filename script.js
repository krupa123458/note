// DevOps Notes Sharing App Script

document.addEventListener('DOMContentLoaded', function() {
    const noteForm = document.getElementById('note-form');
    const notesContainer = document.getElementById('notes-container');

    // Load and display existing notes
    loadNotes();

    // Handle form submission
    noteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        addNote(title, content);
        noteForm.reset();
    });

    function addNote(title, content) {
        const notes = getNotes();
        const note = {
            id: Date.now(),
            title: title,
            content: content
        };
        notes.push(note);
        saveNotes(notes);
        displayNote(note);
    }

    function displayNote(note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.dataset.id = note.id;
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        notesContainer.appendChild(noteDiv);

        // Add event listeners for edit and delete
        noteDiv.querySelector('.edit-btn').addEventListener('click', () => editNote(note.id));
        noteDiv.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id));
    }

    function editNote(id) {
        const notes = getNotes();
        const note = notes.find(n => n.id === id);
        if (!note) return;

        const noteDiv = document.querySelector(`.note[data-id="${id}"]`);
        noteDiv.innerHTML = `
            <input type="text" value="${note.title}" class="edit-title">
            <textarea class="edit-content">${note.content}</textarea>
            <div class="note-actions">
                <button class="save-btn">Save</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;

        noteDiv.querySelector('.save-btn').addEventListener('click', () => saveEdit(id));
        noteDiv.querySelector('.cancel-btn').addEventListener('click', () => cancelEdit(id, note));
    }

    function saveEdit(id) {
        const notes = getNotes();
        const noteIndex = notes.findIndex(n => n.id === id);
        if (noteIndex === -1) return;

        const newTitle = document.querySelector(`.note[data-id="${id}"] .edit-title`).value;
        const newContent = document.querySelector(`.note[data-id="${id}"] .edit-content`).value;

        notes[noteIndex].title = newTitle;
        notes[noteIndex].content = newContent;
        saveNotes(notes);
        loadNotes(); // Reload all notes
    }

    function cancelEdit(id, originalNote) {
        const noteDiv = document.querySelector(`.note[data-id="${id}"]`);
        noteDiv.innerHTML = `
            <h3>${originalNote.title}</h3>
            <p>${originalNote.content}</p>
            <div class="note-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        noteDiv.querySelector('.edit-btn').addEventListener('click', () => editNote(id));
        noteDiv.querySelector('.delete-btn').addEventListener('click', () => deleteNote(id));
    }

    function deleteNote(id) {
        const notes = getNotes().filter(n => n.id !== id);
        saveNotes(notes);
        document.querySelector(`.note[data-id="${id}"]`).remove();
    }

    function loadNotes() {
        notesContainer.innerHTML = '';
        const notes = getNotes();
        notes.forEach(displayNote);
    }

    function getNotes() {
        const notes = localStorage.getItem('devops-notes');
        return notes ? JSON.parse(notes) : [];
    }

    function saveNotes(notes) {
        localStorage.setItem('devops-notes', JSON.stringify(notes));
    }
});
