//new subject listener
const new_subject_form = document.querySelector('.form-add-subject')

//pinned note list
const pinned_notes = document.getElementById('pinnedNotes')
const pinned_note_list = pinned_notes.querySelector('.pinned-notes')


//General note lists
const notes = document.querySelector('#note1')
const add_note_form = document.querySelector('.add-note')
const gen_notes_list = document.querySelector('.generated-notes')

//nav bar list
const navbar_List = document.querySelector('#navbarList')

//subject exists modal
const subject_exists_modal = document.querySelector('#validateUniqueSubject')

console.log("refreshing page");

// create pinned notes as a required subject - use set as it doesnt create another doc if exists
db.collection('subjects').doc("pinned").set({

    bgColor: "#c9611b",
    collapse: false,
    created: firebase.firestore.Timestamp.fromDate(new Date()),
    subject: "pinned"
});


// render the subjects 
const renderSubjects = () => {

    db.collection('subjects').orderBy('created').get().then((snapshot) => {

        docs = snapshot.docs;

        docs.forEach(doc => {

            data = doc.data()
            if (data.subject == "pinned") {

                //update attributes in case they have changed
                pinned_notes.style["background"] = data.bgColor

            } else {
                renderNewSubject(data.bgColor, data.collapse, data.subject)
            }
        });
    });

}

renderSubjects();

// setup realtime firebase note listener
// db.collection('notes').orderBy('created').onSnapshot(snapshot => {

//     let changes = snapshot.docChanges();
//     console.log("CHANGES ARE:");
//     console.log(changes);

//     changes.forEach(change => {
//         console.log(change.doc);
//         console.log("Change type:  " + change.type);

//         if (change.type == 'added') {
//             renderNotes(change.doc);

//         } else if (change.type == 'removed') {

//             console.log("HKJHKHHKHKHJ");
//             //remove from pinned notes if pinned
//             if (change.doc.data().pinned = true) {

//                 // e.target.parentElement.remove();
//             }

//         }
//     });
// });

const renderNotes = () => {


    db.collection('notes').orderBy('created').get().then((snapshot) => {

        docs = snapshot.docs;

        docs.forEach(doc => {

            data = doc.data();
            subject = data.subject;
            pinned = data.pinned
            note = data.note
            id = doc.id

            console.log("Rendering notes: " + id, subject, note, pinned);


            if (pinned == true) {
                console.log("rendering pinned notes");
                generatePinnedNoteTemplate(note, id)
            }
            generateNoteTemplate(note, subject, id);
        })
    })
}

renderNotes();

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



const createNewSubject = (subject) => {

    //store new subject in firebase    

    bgColor = "#673ab7";
    collapse = false;

    db.collection("subjects").doc(subject).set({

        bgColor: bgColor,
        collapse: collapse,
        created: firebase.firestore.Timestamp.fromDate(new Date()),
        subject: subject
    });

    renderNewSubject(bgColor, collapse, subject);

}

const renderNewSubject = (bgColor, collapse, subject) => {


    generateSubjectTemplate(bgColor, collapse, subject)

    //add subject to nav link and spyscroll
    generateNavbarTemplate(subject)

    addNoteListener(document.getElementById(subject), subject)


}

//adds a form listener when a new subject is created
const addNoteListener = (section, subject) => {

    // const note_list = section.querySelector('.notes')
    let form = section.querySelector('.add-note')
    let id = section.getAttribute("id")

    console.log("ADDING LISTENER.  ID is " + id);

    //Form listener - add new note
    form.addEventListener('submit', e => {

        e.preventDefault();

        const note = form.add.value.trim();

        if (note.length) {

            db.collection('notes').add({

                note: note,
                pinned: false,
                created: firebase.firestore.Timestamp.fromDate(new Date()),
                subject: id

            }).then((doc) => {

                //render note 
                generateNoteTemplate(note, subject, doc.id)
                form.reset();
            });
        }

    })

    //Add general note listener
    section.addEventListener('click', e => {

        e.preventDefault();


        //delete note
        if (e.target.classList.contains('note-delete')) {

            //get document id then do code below
            const note_id = e.target.parentElement.getAttribute("id")
            const docRef = db.collection("notes").doc(note_id)

            //remove first from pinned UI if applicable
            docRef.get().then(function (doc) {

                if (doc.data().pinned == true) {

                    pinned_note = pinned_notes.querySelector("#" + note_id)
                    console.log("REMOVING PINNED NOTE: " + pinned_note);
                    pinned_note.remove()
                }
                //then delete delete from firebase
                docRef.delete()
                e.target.parentElement.remove();
            })



            //pin note to pinned list
        } else if (e.target.classList.contains('note-pin')) {

            const note_id = e.target.parentElement.getAttribute("id")
            const note_text = e.target.parentElement.querySelector('.note-text').innerText
            console.log("UPDATING NOTE TO INDICATE PINNED: " + note_id);
            db.collection('notes').doc(note_id).update({
                pinned: true
            });

            generatePinnedNoteTemplate(note_text, note_id)


        } else if (e.target.classList.contains('my-color-picker')) {

            pickColor(e.target, id)

            //delete subject
        } else if (e.target.classList.contains('subject-delete')) {

            //First remove any related pinned notes, then delete subjects from firebase and UI






            //remove any pinned notes associated with this subject
            db.collection('notes').where('subject', '==', subject).where('pinned', '==', true).get().then((querySnapshot) => {

                querySnapshot.forEach(doc => {
                    console.log("query data:");
                    console.log(doc.data());   //returns an dictionary array  
                    console.log(doc.id);   //unique id

                    //remove
                    pinned_note = pinned_notes.querySelector("#" + doc.id)
                    console.log("REMOVING PINNED NOTE SINCE WE ARE DELETING SUBJECT: " + pinned_note);
                    pinned_note.remove()

                });

                //now safe to delete from database
                db.collection("subjects").doc(id).delete()
                e.target.parentElement.parentElement.remove(id);
            })








            //Now remove any notes attached to that subject
            db.collection('notes').where('subject', '==', id).get().then((snapshot) => {

                snapshot.docs.forEach(doc => {
                    if (doc.data().subject == id) {

                        doc.ref.delete()
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

