
const pickColor = (target, subject) => {

    //default color for picker
    var picker = new Picker(target)
    // picker.setColor('#673ab7', true)

    picker.onDone = function (color) {

        target.parentElement.parentElement.style.background = color.rgbaString;

        //update database with color choice
        console.log(subject);
        db.collection("subjects").doc(subject).update({
            bgColor: color.rgbaString
        });

    };

    //Open the popup manually:
    picker.openHandler();


}

