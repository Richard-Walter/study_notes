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

//subject exists modal
const subject_exists_modal = document.querySelector('#validateUniqueSubject')

// create pinned notes as a required subject - use set as it doesnt create another doc if exists
db.collection('subjects').doc("pinned").set({

    bgColor: "#c9611b",
    collapse: false,
    created: firebase.firestore.Timestamp.fromDate(new Date()),
    subject: "pinned"
});



// setup realtime firebase subject listener
db.collection('subjects').orderBy('created').onSnapshot(snapshot => {

    let changes = snapshot.docChanges();
    console.log(changes);

    changes.forEach(change => {
        console.log(change.doc);

        if (change.type == 'added') {
            renderSubjects(change.doc);

        } else if (change.type == 'removed') {



            // let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            // cafeList.removeChild(li);

        }
    });
});


// setup realtime firebase note listener
db.collection('notes').orderBy('created').onSnapshot(snapshot => {

    let changes = snapshot.docChanges();
    console.log(changes);

    changes.forEach(change => {
        console.log(change.doc);

        if (change.type == 'added') {
            renderNotes(change.doc);

        } else if (change.type == 'removed') {

            // renderNotes(change.doc);

        }
    });
});

const renderSubjects = (doc) => {

    data = doc.data();
    console.log("rendering subject");
    console.log(data);
    bgColor = data.bgColor;
    collapse = data.collapse;
    subject = data.subject

    if (subject == "pinned") {

        //update attributes in case they have changed
        pinned_notes.style["background"] = bgColor

    } else {
        renderNewSubject(bgColor, collapse, subject)
    }
}


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

    if (pinned == true) {
        console.log("rendering pinned notes");
        generatePinnedNoteTemplate(note, id)

    } else {

        console.log("test'");

        generateNoteTemplate(note, subject, id)
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

    //store new subject in firebase    
    db.collection("subjects").doc(subject).set({

        bgColor: "#673ab7",
        collapse: false,
        created: firebase.firestore.Timestamp.fromDate(new Date()),
        subject: subject
    });


}

const renderNewSubject = (bgColor, collapse, subject) => {


    generateSubjectTemplate(bgColor, collapse, subject)

    //add subject to nav link and spyscroll
    generateNavbarTemplate(subject)

    //add note general listener
    addNoteListener(document.getElementById(subject))

}

//adds a form listener when a new subject is created
const addNoteListener = (section) => {

    const note_list = section.querySelector('.notes')
    const form = section.querySelector('.add-note')
    const id = section.getAttribute("id")



    //Form listener - add new note
    form.addEventListener('submit', e => {

        e.preventDefault();

        const note = form.add.value.trim();

        console.log("TESTING add note");

        if (note.length) {

            db.collection('notes').add({

                note: note,
                pinned: false,
                created: firebase.firestore.Timestamp.fromDate(new Date()),
                subject: id

            }).then(() => {

                form.reset();
            });
        }

    })

    //Add general note listener
    section.addEventListener('click', e => {

        e.preventDefault();


        //delete note
        if (e.target.classList.contains('note-delete')) {


            console.log("deleteing Note");
            //get document id then do code below
            const note_id = e.target.parentElement.getAttribute("id")
            console.log(note_id);
            db.collection("notes").doc(note_id).delete()

            e.target.parentElement.remove();

            //pin note to pinned list
        } else if (e.target.classList.contains('note-pin')) {

            const note_id = e.target.parentElement.getAttribute("id")
            const note_text = e.target.parentElement.querySelector('.note-text').innerText

            db.collection('notes').doc(note_id).update({
                pinned: true
            });

            generatePinnedNoteTemplate(note_text, note_id)

            //remove pin from pinned ist
        } else if (e.target.classList.contains('note-pinned')) {

            //this functionality is in the pinned note listener - merge?


            //change color    
        } else if (e.target.classList.contains('my-color-picker')) {

            pickColor(e.target, id)

            //delete subject
        } else if (e.target.classList.contains('subject-delete')) {

            console.log("Deleting subject");

            //delete subjects as well as the notes it contains
            console.log(section);
            db.collection("subjects").doc(id).delete()
            e.target.parentElement.parentElement.remove(id);

            db.collection('notes').where('subject', '==', id).get().then((snapshot) => {

                snapshot.docs.forEach(doc => {
                    console.log(doc);
                    if (doc.data().subject == id) {
                        doc.delete()
                    }
                });
            })


        }
    })

}


//Add new subject button listener on title form
new_subject_form.addEventListener('submit', e => {

    e.preventDefault();

    let subject_exists = null;

    const subject = new_subject_form.add_subject.value.trim();
    // console.log("add new subject: " + subject);

    db.collection('subjects').get().then((snapshot) => {

        snapshot.docs.forEach(doc => {


            if (doc.id == subject) {

                subject_exists = true;
                return;
            }
        });

        if (subject_exists) {

            subject_exists_modal.classList.add('is-invalid')
            console.log("this subject is invlaid- displaying error");

        } else {

            console.log("subject doesnt exist....create new one");
            createNewSubject(subject)
            subject_exists_modal.classList.remove('is-invalid')
            subject_exists = false
        }
    })

    new_subject_form.reset();
})


// Add pinned note listener
pinned_notes.addEventListener('click', e => {

    e.preventDefault();

    //pick color
    if (e.target.classList.contains('my-color-picker')) {

        pickColor(e.target, "pinned");

        //remove pinned note
    } else if (e.target.classList.contains('note-pinned')) {

        const note_id = e.target.parentElement.getAttribute("id")

        console.log("TEST deleting pinned note");
        console.log("pinned note ID: " + note_id);

        db.collection('notes').doc(note_id).update({

            pinned: false
        });


        e.target.parentElement.remove();
    }
})

