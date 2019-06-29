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


// create pinned notes as a required subject - use set as it doesnt create another doc if exists
db.collection('subjects').doc("pinned").set({

    bgColor: "#c9611b",
    collapse: false,
    created: firebase.firestore.Timestamp.fromDate(new Date()),
    subject: "pinned"
});

// setup realtime firebase listener

db.collection('notes').orderBy('created').onSnapshot(snapshot => {

    let changes = snapshot.docChanges();
    console.log(changes);

    changes.forEach(change => {
        console.log(change.doc);

        if(change.type == 'added'){
            renderNotes(change.doc);
            
        } else if (change.type == 'removed'){

            // let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            // cafeList.removeChild(li);
            
        }
    });
});

const renderNotes = (doc) => {

    data = doc.data();
    console.log("rendering note");
    subject = data.subject;
    pinned = data.pinned
    note = data.note
    id = doc.id
    console.log(subject);
    console.log(pinned);
    console.log(note);
    console.log(id);

    //check if subject exists, if not create new subject first. 
    if (!document.getElementById(subject)) {
        console.log("subject doesnt exisit - CREATING SUBJECT VIEW");

        createNewSubject(subject)
        
    }



    if (subject == "pinnedNotes") {
        console.log("rendering pinned notes");
        generatePinnedNoteTemplate(note)

    } else {
        
            console.log("test'");
 
        generateNoteTemplate(note, subject)
    }

}

// //test - get refeerence to pinned collection
// db.collection('pinned').orderBy('timestamp').get().then((snapshot) => {
//     console.log(snapshot.docs);
//     snapshot.docs.forEach(doc => {
     
//         console.log(doc.data().note);   //returns note
//         console.log(doc.data().timestamp);   //returns note
//         console.log(doc.data().timestamp.seconds);   //returns note

//         console.log(doc.id);   //unique id
//     });
// })

// //test - add/saving  to pinned collection
// db.collection('pinned').add({
//     note: "note added from javascript",
//     pinned: false
// });

// updating records (console demo)
// db.collection('pinned').doc('DOgwUvtEQbjZohQNIeMr').update({
//     name: 'mario world'
// });

//test - delete  to pinned collection
// db.collection('pinned').doc("aPTDbJFRLIiDg0X1uvkb").delete();

//querying data
// db.collection('pinned').where('timestamp', '==', '1561688100').get().then((snapshot) => {
//     console.log(snapshot.docs);
//     snapshot.docs.forEach(doc => {
//         console.log("query data:");
//         console.log(doc.data());   //returns an dictionary array  
//         console.log(doc.id);   //unique id
//     });
// })

// updating records (console demo)
// db.collection('pinned').doc('DOgwUvtEQbjZohQNIeMr').update({
//     timestamp: data_submitted
// });

// db.collection('pinned').doc('DOgwUvtEQbjZohQNIeMr').update({
//     note: 'lets update the note'
// });




console.log("refreshing page");

const createNewSubject = (subject) => {

    generateSubjectTemplate(subject)

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
            generateNoteTemplate(note, section)
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

            pickColor(e.target, doc_id)

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
    createNewSubject(subject)
    new_subject_form.reset();

})

const addPinnedNotesListener = () => {

    //Add pinned note listener
    pinned_notes.addEventListener('click', e => {

        e.preventDefault();

        //pick color
        if (e.target.classList.contains('my-color-picker')) {

            pickColor(e.target, doc_id);

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

