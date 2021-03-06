let title;
let text;
let saveButton;
let newButton;
let noteList;
if (window.location.pathname === '/notes') {
    title = document.querySelector('.note-title');
    text = document.querySelector('.note-textarea');
    saveButton = document.querySelector('.save-note');
    newButton = document.querySelector('.new-note');
    noteList = document.querySelectorAll('.list-container .list-group');
}
// Show  element
const show = (elem) => {
    elem.style.display = 'inline';
};
// Hide  element
const hide = (elem) => {
    elem.style.display = 'none';
};
// activeNote is used to keep track of the note in the text area
let activeNote = {};
const getNotes = () =>
    fetch('api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
const saveNotes = (note) =>
    fetch('api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });
const deleteNotes = (id) =>
    fetch(`/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
const renderActiveNotes = () => {
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
    saveNotes(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNotes();
    });
};
// Delete seleceted note
const handleNoteDelete = (e) => {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();
    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
    if (activeNote.id === noteId) {
        activeNote = {};
    }
    deleteNotes(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNotes();
    });
};
// Sets the activeNote and displays it
const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNotes();
};
// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
    activeNote = {};
    renderActiveNotes();
};
const handleRenderSaveButton = () => {
    if (!title.value.trim() || !text.value.trim()) {
        hide(saveButton);
    } else {
        show(saveButton);
    }
};
// Renders the list of note titles
const renderNoteList = async(notes) => {
    console.log('Notes we got from backend!', notes)
    let jsonNotes = await notes.json();
    console.log('Json notes!!!!', jsonNotes)
    if (window.location.pathname === '/notes') {
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
        console.log('Inside for each this is the note', note)
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);
        noteListItems.push(li);
    });
    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note));
    }
};
// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);
if (window.location.pathname === '/notes') {
    saveButton.addEventListener('click', handleNoteSave);
    newButton.addEventListener('click', handleNewNoteView);
    title.addEventListener('keyup', handleRenderSaveButton);
    text.addEventListener('keyup', handleRenderSaveButton);
}
getAndRenderNotes();