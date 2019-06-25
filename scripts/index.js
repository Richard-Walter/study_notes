const colorArray = ['#1E88E5', '#673ab7', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const note_list = document.querySelector('#note1 .notes')
const pinned_note_list = document.querySelector('.pinned-notes')
const subject = document.querySelector('#note1')
console.log(pinned_note_list);
const add_note_form = document.querySelector('#note1 .add-note')


const generateNoteTemplate = (note) => {

    const html = `

    <li class="list-group-item d-inline justify-content-between align-items-center">
    <i class="fas fa-thumbtack note-pin float-left pt-1"></i>
    <span class="mx-2">${note}</span>
    <i class="far fa-trash-alt note-delete float-right pt-1"></i>
    </li>
    `;

    pinned_note_list.innerHTML += html
}

const generatePinnedNoteTemplate = (note) => {

    const html = `

    <li class="list-group-item d-flex justify-content-between align-items-center">
    <span>${note}</span>
    <i class="far fa-window-close note-remove"></i>
    </li>
    `;

    note_list.innerHTML += html
}

// add new note
add_note_form.addEventListener('submit', e => {
    console.log(e.target)  //click elements classes
    e.preventDefault(); //prevent page from reloading
    const note = add_note_form.add.value.trim();

    if (note.length) {
        generateNoteTemplate(note)
        add_note_form.reset();
    }

});

//delete or pin notes
note_list.addEventListener('click', e => {

    //delete notes
    if (e.target.classList.contains('note-delete')) {
        console.log(e);
        e.target.parentElement.remove();
    }

    if (e.target.classList.contains('note-pin')) {
        console.log(e);
        console.log("noted pinned");

    }

})

//subject header
subject.addEventListener('click', e => {

    //delete subject
    if (e.target.classList.contains('subject-delete')) {
        console.log(e);
        e.target.parentElement.parentElement.remove();
    }

    //pick color
    if (e.target.classList.contains('color-picker')) {
        console.log("choose color");

    }
})



