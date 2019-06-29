// // initials on multiple elements with loop
// var elems = document.querySelectorAll('.color-input');
// for ( var i=0; i < elems.length; i++ ) {
//   var elem = elems[i];
//   var hueb = new Huebee( elem, {
//     // options
//   });
// }


const pickColor = (target, subject) => {


    console.log("in pick color method");
    console.log(target)

    var picker = new Picker(target)
    picker.setColor('#673ab7', true)

    picker.onDone = function (color) {

        target.parentElement.parentElement.style.background = color.rgbaString;
        //update database with color choise

        console.log(subject);
        db.collection("subjects").doc(subject).update({
            bgColor: color.rgbaString
        });

    };

    //Open the popup manually:
    picker.openHandler();


}

