let nTitle;
let nText;
let saveButton;
let newButton;
let noteList;
if (window.location.pathname === '/notes.html') {
    nTitle = document.querySelector('.note-title');
    nText = document.querySelector('.note-textarea');
    saveButton = document.querySelector('.save-note');
    newButton = document.querySelector('.new-note');
    noteList = document.querySelectorAll('.list-container .list-group');
}
// Show an element
const show = (elem) => {
    elem.style.display = 'inline';
};
// Hide an element
const hide = (elem) => {
    elem.style.display = 'none';
};
// activeNote is used to keep track of the note in the textarea
let activeNote = {};
const getNotes = () =>
    fetch('api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
const saveNote = (note) =>
    fetch('api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });
const deleteNote = (id) =>
    fetch(`/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
const renderActiveNote = () => {
    hide(saveButton);
    if (activeNote.id) {
        title.setAttribute('readonly', true);
        text.setAttribute('readonly', true);
        title.value = activeNote.title;
        text.value = activeNote.text;
    } else {
        title.value = '';
        text.value = '';
    }
};
const handleNoteSave = () => {
    const newNote = {
        title: title.value,
        text: text.value,
    };
    saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};
// Delete the clicked note
const handleNoteDelete = (e) => {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();
    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
    if (activeNote.id === noteId) {
        activeNote = {};
    }
    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};
// Sets the activeNote and displays it
const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
};
// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
    activeNote = {};
    renderActiveNote();
};
const handleRenderSaveBtn = () => {
    if (!title.value.trim() || !text.value.trim()) {
        hide(saveButton);
    } else {
        show(saveButton);
    }
};
// Render the list of note titles
const renderNoteList = async(notes) => {
    let jsonNotes = await notes.json();
    if (window.location.pathname === '/notes.html') {
        noteList.forEach((el) => (el.innerHTML = ''));
    }
    let noteListItems = [];
    // Returns HTML element with or without a delete button
    const createLi = (text, delBtn = true) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item');
        const spanEl = document.createElement('span');
        spanEl.innerText = text;
        spanEl.addEventListener('click', handleNoteView);
        liEl.append(spanEl);
        if (delBtn) {
            const delBtnEl = document.createElement('i');
            delBtnEl.classList.add(
                'fas',
                'fa-trash-alt',
                'float-right',
                'text-danger',
                'delete-note'
            );
            delBtnEl.addEventListener('click', handleNoteDelete);
            liEl.append(delBtnEl);
        }
        return liEl;
    };
    if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No saved Notes', false));
    }
    jsonNotes.forEach((note) => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);
        noteListItems.push(li);
    });
    if (window.location.pathname === '/notes.html') {
        noteListItems.forEach((note) => noteList[0].append(note));
    }
};
// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);
if (window.location.pathname === '/notes.html') {
    saveButton.addEventListener('click', handleNoteSave);
    newButton.addEventListener('click', handleNewNoteView);
    title.addEventListener('keyup', handleRenderSaveBtn);
    text.addEventListener('keyup', handleRenderSaveBtn);
}
getAndRenderNotes();