const colorArray = ['#1E88E5', '#673ab7', '#FF33FF', '#FFFF99'];


//pinned note list
const pinned_notes = document.querySelector('#pinnedNotes')
const pinned_note_list = pinned_notes.querySelector('.pinned-notes')

console.log(pinned_note_list);

//General note lists
const notes = document.querySelector('#note1')
const note_list = notes.querySelector('.notes')
const add_note_form = document.querySelector('.add-note')

console.log(note_list);

//Add pinned note listener
pinned_notes.addEventListener('click', e => {

    console.log("pinned event");
    e.preventDefault(); //prevent page from reloading

    //pick color
    if (e.target.classList.contains('color-picker')) {
        console.log("choose color");

    } else if (e.target.classList.contains('note-pin')) {
        console.log("delete pinned note");
    }

})

//Add general note listener

notes.addEventListener('click', e => {

    e.preventDefault(); //prevent page from reloading

    //delete note
    if (e.target.classList.contains('note-delete')) {
        console.log(e);
        e.target.parentElement.remove();

        //pin note
    } else if (e.target.classList.contains('note-pin')) {

        console.log(e);
        console.log("noted pinned");

        generatePinnedNoteTemplate("test pinned")
    } else if (e.target.classList.contains('color-picker')) {

        console.log(e);
        console.log("pick general note color");

        generatePinnedNoteTemplate("test pinned");
    }
})

//Form listener - add new note
add_note_form.addEventListener('submit', e => {

    console.log(e.target)  //click elements classes
    e.preventDefault(); //prevent page from reloading

    const note = add_note_form.add.value.trim();

    if (note.length) {
        generateNoteTemplate(note)
        add_note_form.reset();
    }

});












