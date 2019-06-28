const colorArray = ['#1E88E5', '#673ab7', '#FF33FF', '#FFFF99'];

//new subject listener
const new_subject_form = document.querySelector('.form-add-subject')

//pinned note list
const pinned_notes = document.querySelector('#pinnedNotes')
const pinned_note_list = pinned_notes.querySelector('.pinned-notes')

//General note lists
const notes = document.querySelector('#note1')
const add_note_form = document.querySelector('.add-note')
const gen_notes_list = document.querySelector('.generated-notes')

//nav bar list
const navbar_List = document.querySelector('#navbarList')

console.log("refreshing page");

const createNewSubject = (subject) => {

    generateSubjectTemplate(subject)

    //add background color style
    document.getElementById(subject).style.backgroundColor = "#2ba01c";

    //add subject to nav link and spyscroll
    generateNavbarTemplate(subject)

    //add note general listener
    addNoteListener(document.getElementById(subject))

}

//adds a form listener when a new subject is created
const addNoteListener = (section) => {

    const note_list = section.querySelector('.notes')
    const form = section.querySelector('.add-note')

    //Form listener - add new note
    form.addEventListener('submit', e => {

        e.preventDefault();

        console.log(e.target)  //click elements classes

        const note = form.add.value.trim();

        if (note.length) {
            generateNoteTemplate(note, note_list)
            form.reset();
        }

    })

    //Add general note listener
    section.addEventListener('click', e => {

        e.preventDefault();

            //delete note
        if (e.target.classList.contains('note-delete')) {
            console.log(e);
            e.target.parentElement.remove();

            //pin note to pinned list
        } else if (e.target.classList.contains('note-pin')) {

            const note_text = e.target.parentElement.querySelector('.note-text').innerText
            console.log(note_text);

            generatePinnedNoteTemplate(note_text)

            //remove pin from pinned ist
        } else if (e.target.classList.contains('note-pinned')) {
            console.log("deleting pinned note");

            e.target.parentElement.remove();

            //change color    
        } else if (e.target.classList.contains('my-color-picker')) {

            pickColor(e.target)

            //delete subject
        } else if (e.target.classList.contains('subject-delete')) {

            console.log("subject delete");
            e.target.parentElement.parentElement.remove()
        }
    })

}

//Add new subject button listener on title form
new_subject_form.addEventListener('submit', e => {

    e.preventDefault();

    const subject = new_subject_form.add_subject.value.trim();
    console.log("add new subject: " + subject);
    console.log(e.target);
    createNewSubject(subject)
    new_subject_form.reset();

})

const addPinnedNotesListener = () => {

    //Add pinned note listener
    pinned_notes.addEventListener('click', e => {

        e.preventDefault();

        //pick color
        if (e.target.classList.contains('my-color-picker')) {

            pickColor(e.target);

            //remove pinned note
        } else if (e.target.classList.contains('note-pinned')) {
            console.log("deleting pinned note");

            e.target.parentElement.remove();
        }

    })
}

addPinnedNotesListener();


//   TEST
//Form listener - add new note  DELETE THESE AFTER
// addNoteListener(document.getElementById('note1'))

