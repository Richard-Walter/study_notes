/****  AUTHENTICATION LISTENER */
auth.onAuthStateChanged((user) => {


  if (user) { //User is logged in

    // get user claims
    user.getIdTokenResult().then((idTokenResult) => {
      console.log(idTokenResult.claims);
      console.log(user);
      console.log("user is :" + user.uid);

      //this line seems to create a admin field dynamically??
      user.admin = idTokenResult.claims.admin

      //change title to persons name
      db.collection('users').doc(user.uid).get().then((doc) => {

        title_name = doc.data().displayName + "'s Study Notes"

        document.querySelector('.title-text').innerHTML = title_name;

      })

      setUpStudyNotes(user)
      // setupUI(user)
    })

  } else {    //user not logged in
    setUpStudyNotes()
    //   setupUI()
  }
})


//**** SIGN UP ******/

const signupForm = document.querySelector('#signup-form')

// event listener is submit rather than on button as it listens to return as well
signupForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = signupForm['signup-email'].value
  const password = signupForm['signup-password'].value
  const name = signupForm['signup-name'].value


  // sign up the user using firebase auth object we created in the HTML
  //this is asyncronous and returns a promise containing a user credential
  auth.createUserWithEmailAndPassword(email, password).then(cred => {

    //create a new document in users collection (firebase will create if doesn't exist)
    //then instead of add() we use doc() where we can create out own ID(userID)
    //it then returns a promise
    return db.collection('users').doc(cred.user.uid).set({

      displayName: name
    })

  }).then(() => {


    // $('#modalSignup').hide();
    $("#modalSignup").modal("toggle");

    signupForm.reset()
    // signupForm.querySelector('.error').innerHTML = ''

  }).catch((err) => {
    signupForm.querySelector('.error').innerHTML = err.message
  })
})

//**** LOG IN ******/
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = loginForm['login-email'].value
  const password = loginForm['login-password'].value

  auth.signInWithEmailAndPassword(email, password).then((cred) => {

    console.log(cred);

    //close the signup modal
    // $('#modalLogin').hide();
    $("#modalLogin").modal("toggle");

    loginForm.reset()

    // loginForm.querySelector('.error').innerHTML = ''
  }).catch((err) => {
    loginForm.querySelector('.error').innerHTML = err.message
  })

})


//**** LOG OUT ******/
const logout = document.querySelector('#logout')

logout.addEventListener('click', e => {


  window.location.reload(true);

  auth.signOut()
})