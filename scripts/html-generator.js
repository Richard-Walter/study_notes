const generateNoteTemplate = (note) => {

    console.log("generate note template");

    const html = `

    <li class="list-group-item d-inline justify-content-between align-items-center">
    <i class="fas fa-thumbtack note-pin float-left pt-1"></i>
    <span class="mx-2">${note}</span>
    <i class="far fa-trash-alt note-delete float-right pt-1"></i>
    </li>
    `;

    note_list.innerHTML += html
}

const generatePinnedNoteTemplate = (note) => {

    const html = `

    <li class="list-group-item d-inline justify-content-between align-items-center">
    <i class="fas fa-thumbtack note-pin float-left pt-1"></i>
    <span class="mx-2">${note}</span>
</li>
    `;
    pinned_note_list.innerHTML += html
    
}