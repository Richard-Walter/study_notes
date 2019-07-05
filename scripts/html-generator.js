const generateNoteTemplate = (note, subject, note_id) => {

    subject = document.getElementById(subject)
    
    note_list = subject.querySelector('.notes')

    const html = `

    <li class="list-group-item d-inline justify-content-between align-items-center" id="${note_id}">
    <i class="fas fa-thumbtack note-pin float-left pt-1"></i>
    <span class="note-text mx-2">${note}</span>
    <i class="far fa-trash-alt note-delete float-right pt-1 pl-2"></i>
    </li>
    `;

    note_list.innerHTML += html
}

const generatePinnedNoteTemplate = (note, note_id) => {

    const html = `

    <li class="list-group-item d-inline justify-content-between align-items-center" id="${note_id}">
    <i class="fas fa-thumbtack note-pinned float-left pt-1 "></i>
    <span class="note-text mx-2">${note}</span>
</li>
    `;
    pinned_note_list.innerHTML += html

}

const generateSubjectTemplate = (bgColor, collapse, subject) => {

    subject_nospace = subject.split(' ').join('_')

    const html = `

    <section class="py-1 my-4 rounded container-fluid" style="background:${bgColor}" id="${subject}">
    <header class="subject-header text-center text-light border-bottom border-light mb-2 ">
        <i class="my-color-picker fas fa-palette fa-lg float-left p-1"></i>
        <a class="badge" data-toggle="collapse" href="#collapse${subject_nospace}" role="button" aria-expanded="false"
            aria-controls="collapseExample">
            <h5 class="d-inline text-center text-light">${subject}</h5>
        </a>
        <i class="subject-delete far fa-window-close fa-lg float-right p-1"></i>
    </header>
    <div id="collapse${subject_nospace}" class="collapse show">
        <ul class="notes list-group mb-2 mx-auto text-dark small ">

        </ul>
        <form class="add-note text-center form-group pt-1  ">
            <input class="form-control m-auto d-flex form-control-sm" placeholder="  add new note ..."
                type="text" name="add" />
        </form>
    </div>
</section>
    `;

    gen_notes_list.innerHTML += html

}


const generateNavbarTemplate = (subject) => {

    const html = `

    <li class="nav-item noteLink">
    <a class="nav-link " href="#${subject}">${subject}</a>
    </li>
    `;
    navbar_List.innerHTML += html

}