const colorArray = ['#1E88E5', '#673ab7', '#FF33FF', '#FFFF99'];

//new subject listener
const new_subject_form = document.querySelector('.form-add-subject')

//pinned note list
const pinned_notes = document.querySelector('#pinnedNotes')
const pinned_note_list = pinned_notes.querySelector('.pinned-notes')

console.log(pinned_note_list);

//General note lists
const notes = document.querySelector('#note1')
const note_list = notes.querySelector('.notes')
const add_note_form = document.querySelector('.add-note')
console.log(note_list);

//generated notes list
const  gen_notes_list = document.querySelector('.generated-notes')

//Add new subject button listener
new_subject_form.addEventListener('submit', e => {

    e.preventDefault();

    const subject = new_subject_form.add_subject.value.trim();
    console.log("add new subject: " + subject );
    createNewSubject(subject)
    new_subject_form.reset();

})

//Add pinned note listener
pinned_notes.addEventListener('click', e => {

  
    e.preventDefault();

    //pick color
    if (e.target.classList.contains('color-picker')) {
        console.log("choose color");

    //remove pinned note
    } else if (e.target.classList.contains('note-pin')) {
        console.log("deleting pinned note");

        e.target.parentElement.remove();
    }

})

//Add general note listener

notes.addEventListener('click', e => {

    e.preventDefault(); 

    //delete note
    if (e.target.classList.contains('note-delete')) {
        console.log(e);
        e.target.parentElement.remove();

    //pin note
    } else if (e.target.classList.contains('note-pin')) {

        const note_text = e.target.parentElement.querySelector('.note-text').innerText
        console.log(note_text);

        generatePinnedNoteTemplate(note_text)

    //change color
    } else if (e.target.classList.contains('color-picker')) {

        console.log(e);
        console.log("pick general note color");

    //delete subject
    } else if (e.target.classList.contains('subject-delete')) {

        console.log("subject delete");
        e.target.parentElement.parentElement.remove()     
    }
})

//Form listener - add new note
add_note_form.addEventListener('submit', e => {

    console.log(e.target)  //click elements classes
    e.preventDefault(); 

    const note = add_note_form.add.value.trim();

    if (note.length) {
        generateNoteTemplate(note)
        add_note_form.reset();
    }

});


const createNewSubject = (subject) => {

    generateSubjectTemplate(subject)

}









