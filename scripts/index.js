
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
db.collection('subjects').orderBy('created').get().then((snapshot) => {

    snapshot.docs.forEach(doc => {

        data = doc.data()
        if (data.subject == "pinned") {

            //Already rendered - just update attributes in case they have changed
            pinned_notes.style["background"] = data.bgColor

        } else {
            renderNewSubject(data.bgColor, data.collapse, data.subject)
        }
    });
});

//render notes associated with each subject
db.collection('notes').orderBy('created').get().then((snapshot) => {

    snapshot.docs.forEach(doc => {

        data = doc.data();
        subject = data.subject;
        pinned = data.pinned
        note = data.note
        id = doc.id

        console.log("Rendering notes: " + id, subject, note, pinned);


        if (pinned == true) {

            generatePinnedNoteTemplate(note, id)
        }

        generateNoteTemplate(note, subject, id);
    })
})


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

    // addNoteListener(document.getElementById(subject), subject)


}

//Add form submit listener
gen_notes_list.addEventListener('submit', e => {

    e.preventDefault();
    form = e.target;

    const note_id = form.parentElement.parentElement.getAttribute("id")
    const note = form.add.value.trim();

    if (note.length) {

        db.collection('notes').add({

            note: note,
            pinned: false,
            created: firebase.firestore.Timestamp.fromDate(new Date()),
            subject: note_id

        }).then((doc) => {

            //render note 
            generateNoteTemplate(note, note_id, doc.id)
            form.reset();
        });
    }
})

//Add general note listener
gen_notes_list.addEventListener('click', e => {

    e.preventDefault();

    let section = e.target.parentElement.parentElement.parentElement
    let id = section.getAttribute("id")
    let subject = section.getAttribute("id")

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

        db.collection('notes').doc(note_id).update({
            pinned: true
        });

        generatePinnedNoteTemplate(note_text, note_id)


    } else if (e.target.classList.contains('my-color-picker')) {
        
        section = e.target.parentElement.parentElement
        id = section.getAttribute("id")

        pickColor(e.target, id)

        //delete subject
    } else if (e.target.classList.contains('subject-delete')) {


        section = e.target.parentElement.parentElement
        id = section.getAttribute("id")
        subject = section.getAttribute("id")

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


// const signup_modal = document.querySelector('#modal-signup')
// $('#modal-signup').modal('show')

