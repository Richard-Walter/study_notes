// // initials on multiple elements with loop
// var elems = document.querySelectorAll('.color-input');
// for ( var i=0; i < elems.length; i++ ) {
//   var elem = elems[i];
//   var hueb = new Huebee( elem, {
//     // options
//   });
// }


const pickColor = (target, doc_id) => {


    console.log("in pick color method");
    console.log(target)

    var picker = new Picker(target)
    picker.setColor('#673ab7', true)

    picker.onDone = function (color) {

        target.parentElement.parentElement.style.background = color.rgbaString;
    };

    //Open the popup manually:
    picker.openHandler();

    //update database with color choise

    db.collection("subjects").doc(doc_id).update({
        bgColor: color.rgbaString
    });

}

