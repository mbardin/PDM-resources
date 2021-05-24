//Global Variables
let menu, sendButton, userState, reverb, PPDel, vib, distort, scaledTime;
let possibleNotes = [
  "a",
  "A",
  "b",
  "B",
  "c",
  "C",
  "d",
  "D",
  "e",
  "E",
  "f",
  "F",
  "g",
  "G"
]; //possible notes to add to the melody being played by the synth. add black key notes?
let melody = ["A4", "E4", "D4"]; //starting melody for the synth. will get added to it later.
let oscTypes = [
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "Sine",
  "Square",
  "Triangle",
  "tri",
  "squ",
  "saw",
  "Sawtooth",
  "tooth"
];

//for the text letter randomizing
let letters = [];
let letterDivs = [];
let letterTimer;
let yStart = [];
let xStart = [];
let accum = 0;

let allSquares = [];
let allEllipses = [];
let allTriangles = [];
let allLines = [];

let synth = new Tone.Synth({
  oscillator: {
    type: `sine`
  },
  envelope: {
    attack: 5,
    decay: 0.5,
    sustain: 0.75,
    release: 3
  }
});

reverb = new Tone.Reverb(0.4);
PPDel = new Tone.PingPongDelay(getRandomInt(1, 10), 0.5);
vib = new Tone.Chorus(4, 2.5, 0.5); //adjust label
distort = new Tone.BitCrusher(16);

synth.chain(vib, distort, reverb, PPDel, Tone.Destination); //

Tone.loaded().then(() => {
  Tone.Transport.bpm = 70;
  Tone.Transport.start();
  changeApperance();
});

let starterFlag = 0;
function seq() {
  let sequence = new Tone.Sequence(
    function (time, note) {
      synth.triggerAttackRelease(note, 6);
    },
    melody,
    "1n"
  );
  if (starterFlag != 0) {
    sequence.stop();
  }
  sequence.start();
  starterFlag++;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function randomColor() {
  //generates a random color
  let color = [floor(random(256)), floor(random(256)), floor(random(256))];
  console.log(`This random color is: ${color}`); //displaces most recent random color in console
  return color;
}

//these functions are used to adjust the parameters of the effect chain/sequence melody/synth. will be tied to object values.
function changeVerbTime() {
  //map paramater to object here
  // startTimer(); //restarts countdown timer
}

function changeDelayTime() {
  //map paramater to object here
  //  startTimer(); //restarts countdown timer
}

function changeDistortion() {
  //map paramater to object here
  // startTimer(); //restarts countdown timer
}

function changeVibratoSpeed() {
  //map paramater to object here
  // startTimer(); //restarts countdown timer
}
let erodeToggle = false;
function erodeMelody() {
  //transitions back to original melody
  if (melody.length > 3 && erodeToggle) {
    //only works if melody has been added to and timer sets the flag
    melody.pop(); //removes last melody from the sequence
    console.log(`a note has been removed from the melody`);
    console.log(`the melody is now: [${melody}]`);
    seq();
    setTimeOut(erodeMelody, getRandomInt(10000, 120000)); //randomly calls again a few seconds later to remove another note
  }
}

function defaultFX() {
  reverb.roomSize.value.exponentialRampToValueAtTime(0.2, "+100"); //0.2
  PPDel.delayTime.exponentialRampToValueAtTime(0.5, "+30"); //0.5
  PPDel.feedback.exponentialRampToValueAtTime(0.5, "+300"); //0.5
  vib.frequency.exponentialRampToValueAtTime(1, "+60"); //1
  vib.depth.exponentialRampToValueAtTime(0.1, "+200"); //0.1

  //look at distortion. it gives an error
  distort.distortion.linearRampToValueAtTime(0.01, "+600"); //0.05
  synth.volume.exponentialRampToValueAtTime(0, "+60"); //0
}

let muteToggle = false;
document.querySelector("#mute").addEventListener("click", () => {
  if (muteToggle) {
    louder();
    //   startTimer();
    muteToggle = false;
  } else {
    shutUp();
    //  startTimer();
    muteToggle = true;
  }
});

function shutUp() {
  synth.volume.exponentialRampToValueAtTime(-60, "+5");
  document.getElementById("mute").textContent = "UNMUTE";
  //  startTimer();
}
function louder() {
  synth.volume.exponentialRampToValueAtTime(0, "+5");
  document.getElementById("mute").textContent = "MUTE";
  // startTimer();
}

function addNotes(note) {
  if (possibleNotes.includes(note)) {
    let oct = getRandomInt(1, 6);
    let newestNote = `${note}${oct}`;
    melody.push(newestNote);
    console.log(`You added the note ${note} to the melody.`);
    console.log(`The melody is now: [${melody}]`);
    seq();
    // startTimer();
  }
}

function removeNotes() {
  //removes the last nore from the melody
  melody.pop();
  console.log(`You removed a note from the melody.`);
  console.log(`The melody is now: [${melody}]`);
  seq();
  //startTimer();
}

function changeSynthOsc(type) {
  //changes the synth type
  if (oscTypes.includes(type)) {
    synth.oscillator.type = type;
    console.log(`you have set the synth type to ${type}`);
    // startTimer();
  } else {
    console.log(
      `Unable to change synth type to ${type}. Please select from: [${oscTypes}`
    );
  }
}

//working out the menu

//displays the text on the screen and adds it to the melody
//everything below here has to do with the text display
let typedText = document.querySelector("#textField");

typedText.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    console.log("submit");
    changeSynthOsc(typedText.value); //changes synth type if user types waveform type into box
    changeText();
    event.preventDefault();
  }
});

function changeText() {
  letters = Array.from(typedText.value);
  console.log(letters);
  letterDivs.forEach((ldiv) => {
    ldiv.remove();
  });
  createLetters();
}

function createLetters() {
  letterDivs = [];
  yStart, (xStart = []);
  letters.forEach((letter) => {
    console.log(letter);
    addNotes(letter);
    let ldiv = document.createElement("div");
    ldiv.classList.add("letters");
    ldiv.innerHTML = letter;
    let t = Math.random() * 100;
    yStart.push(t);
    let l = Math.random() * 100;
    xStart.push(l);
    ldiv.style.top = `${t + Math.sin(accum)}%`;
    ldiv.style.left = `${l}%`;

    letterDivs.push(ldiv);
    document.getElementById("letters").appendChild(ldiv);
  });
  if (letterTimer) {
    clearInterval(letterTimer);
  }
  letterTimer = setInterval(randomizePositions, 250);

  //removeLetters();
}

//needs to remove letters and have the ones on screen update to reflect the changes.
function removeLetters() {
  if (letters.length > 0) {
    letters.pop();
    createLetters();
    setTimeout(removeLetters, getRandomInt(5000, 15000));
  }
}

function randomizePositions() {
  accum += 0.4;
  letterDivs.forEach((ldiv, index) => {
    let l = Math.random() * 6 - 3.0;
    xStart[index] += l;
    ldiv.style.top = `${yStart[index] + Math.sin(accum) * 50}%`;
    ldiv.style.left = `${xStart[index]}%`;
  });
  //console.log(Math.sin(accum));
}

//counttimer to begin returning to original state
// document.getElementById("timer").innerHTML = 008 + ":" + 00;
// startTimer(); //test, recall to reset timer

// function startTimer() {
//   let presentTime = document.getElementById("timer").innerHTML;
//   let timeArray = presentTime.split(/[:]+/);
//   let m = timeArray[0];
//   let s = checkSecond(timeArray[1] - 1);
//   if (s == 59) {
//     m = m - 1;
//   }
//   if (m < 0 && s < 0) {
//     //begins tranform back to default state
//     erodeToggle = true;
//     erodeMelody();
//     defaultFX();
//   } else {
//     erodeToggle = false;
//   }

//   document.getElementById("timer").innerHTML = m + ":" + s;
//   //console.log(`${m}:${s}`);
//   setTimeout(startTimer, 1000); //display time on the screen? probably not.
// }

// function checkSecond(sec) {
//   if (sec < 10 && sec >= 0) {
//     sec = "0" + sec;
//   } // add zero in front of numbers < 10
//   if (sec < 0) {
//     sec = "59";
//   }
//   return sec;
// }

//for the instructions interface screen

let btn = document.getElementById("myBtn");
btn.onclick = () => {
  Tone.start();
  modal.style.display = "block";
}; //make the button/interface look

//functions for setting the user mode via buttons. synth will not start until one is clicked
function setPlace() {
  userState = "Place";
  console.log(`You have set the User Mode to ${userState}`);

  let checkBox = document.getElementById("checkPlace");
  // Get the output text
  let text = document.getElementById("placeText");
  let view = document.getElementById("checkView");
  let edit = document.getElementById("checkEdit");
  let viewText = document.getElementById("viewText");
  let editText = document.getElementById("editText");
  let typeBox = document.getElementById("textField");
  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    text.style.display = "block";
    view.checked = false;
    edit.checked = false;
    typeBox.style.display = "block";
    viewText.style.display = "none";
    editText.style.display = "none";
  } else {
    text.style.display = "none";
    typeBox.style.display = "none";
  } //displaces current mode in console
  changeApperance();
  seq();
}

function setView() {
  userState = "View";
  console.log(`You have set the User Mode to ${userState}`); //displays current mode in console
  let checkBox = document.getElementById("checkView");
  let text = document.getElementById("viewText");
  let place = document.getElementById("checkPlace");
  let edit = document.getElementById("checkEdit");
  let placeText = document.getElementById("placeText");
  let editText = document.getElementById("editText");
  let typeBox = document.getElementById("textField");

  if (checkBox.checked == true) {
    text.style.display = "block";
    place.checked = false;
    edit.checked = false;
    placeText.style.display = "none";
    editText.style.display = "none";
  } else {
    text.style.display = "none";
    typeBox.style.display = "none";
  }
  changeApperance();
  seq();
}

function setEdit() {
  userState = "Edit";
  console.log(`You have set the User Mode to ${userState}`); //displays current mode in console

  let checkBox = document.getElementById("checkEdit");
  let text = document.getElementById("editText");
  let place = document.getElementById("checkPlace");
  let view = document.getElementById("checkView");
  let viewText = document.getElementById("viewText");
  let placeText = document.getElementById("placeText");
  let typeBox = document.getElementById("textField");
  if (checkBox.checked == true) {
    text.style.display = "block";
    place.checked = false;
    view.checked = false;
    placeText.style.display = "none";
    viewText.style.display = "none";
  } else {
    text.style.display = "none";
    typeBox.style.display = "none";
  }
  changeApperance();
  seq();
}

// Get the modal
let modal = document.getElementById("myModal");
// Get the button that opens the modal
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//responds to toggle check above
let viewModeScreenText = document.getElementById("viewModeText");
let TypeBox = document.getElementById("textField");
let menuSqu = document.getElementById("mySquare");
let menuCir = document.getElementById("myCircle");
let menuParallel = document.getElementById("myParallel");
let menuTri = document.getElementById("myTri");
let menuLine = document.getElementById("myLine");
let menuDivider = document.getElementById("menuLine");

function changeApperance() {
  if (userState === "Place") {
    viewModeScreenText.style.display = "none";
    document.getElementById("placeTools").classList.remove("hidden");
    // TypeBox.style.display = "block";
    // menuSqu.style.display = "block";
    // menuCir.style.display = "block";
    // menuParallel.style.display = "block";
    // menuTri.style.display = "block";
    // menuLine.style.display = "block";
    // menuDivider.style.display = "block";
  } else if (userState === "Edit") {
    viewModeScreenText.style.display = "none";
    document.getElementById("placeTools").classList.add("hidden");
    // TypeBox.style.display = "none";
    // menuSqu.style.display = "none";
    // menuCir.style.display = "none";
    // menuParallel.style.display = "none";
    // menuTri.style.display = "none";
    // menuLine.style.display = "none";
    // menuDivider.style.display = "none";
  } else if (userState === "View") {
    viewModeScreenText.style.display = "block";
    document.getElementById("placeTools").classList.add("hidden");
    // TypeBox.style.display = "none";
    // menuSqu.style.display = "none";
    // menuCir.style.display = "none";
    // menuParallel.style.display = "none";
    // menuTri.style.display = "none";
    // menuLine.style.display = "none";
    // menuDivider.style.display = "none";
  } else {
    viewModeScreenText.style.display = "none";
    document.getElementById("placeTools").classList.add("hidden");
    // TypeBox.style.display = "none";
    // menuSqu.style.display = "none";
    // menuCir.style.display = "none";
    // menuParallel.style.display = "none";
    // menuTri.style.display = "none";
    // menuLine.style.display = "none";
    // menuDivider.style.display = "none";
  }
}
//working with canvas overlay. may not need
// function on() {
//   document.getElementById("overlay").style.display = "block";
// }

// function off() {
//   document.getElementById("overlay").style.display = "none";
// }

function makeSquare() {
  let newSquare = document.getElementById("mySquare");
  newSquare.style.backgroundColor = rgb(
    getRandomInt(0, 256),
    getRandomInt(0, 256),
    getRandomInt(0, 256)
  );
}

function makeCircle() {
  let newCircle = document.getElementById("myCircle");
  newCircle.style.backgroundColor = rgb(
    getRandomInt(0, 256),
    getRandomInt(0, 256),
    getRandomInt(0, 256)
  );
}

function makeParallel() {
  let newParallel = document.getElementById("myParallel");
  newParallel.style.backgroundColor = rgb(
    getRandomInt(0, 256),
    getRandomInt(0, 256),
    getRandomInt(0, 256)
  );
}

function makeTri() {
  let newTri = document.getElementById("myTri");
  newTri.style.backgroundColor = rgb(
    getRandomInt(0, 256),
    getRandomInt(0, 256),
    getRandomInt(0, 256)
  );
}

function makeLine() {
  let newLine = document.getElementById("myLine");
  newLine.style.backgroundColor = rgb(
    getRandomInt(0, 256),
    getRandomInt(0, 256),
    getRandomInt(0, 256)
  );
}

//drag and drop code
// target elements with the "draggable" class
interact(".draggable").draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: true
    })
  ],
  // enable autoScroll
  autoScroll: true,

  listeners: {
    // call this function on every dragmove event
    move: dragMoveListener,

    // call this function on every dragend event
    end(event) {
      var textEl = event.target.querySelector("p");

      textEl &&
        (textEl.textContent =
          "moved a distance of " +
          Math.sqrt(
            (Math.pow(event.pageX - event.x0, 2) +
              Math.pow(event.pageY - event.y0, 2)) |
              0
          ).toFixed(2) +
          "px");
    }
  }
});

function dragMoveListener(event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact(".dropzone").dropzone({
  // only accept elements matching this CSS selector
  accept: "#yes-drop",
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add("drop-active");
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget;
    var dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add("drop-target");
    draggableElement.classList.add("can-drop");
    draggableElement.textContent = "Dragged in";
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove("drop-target");
    event.relatedTarget.classList.remove("can-drop");
    event.relatedTarget.textContent = "Dragged out";
  },
  ondrop: function (event) {
    event.relatedTarget.textContent = "Dropped";
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove("drop-active");
    event.target.classList.remove("drop-target");
  }
});

interact(".drag-drop").draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: true
    })
  ],
  autoScroll: true,
  // dragMoveListener from the dragging demo above
  listeners: { move: dragMoveListener }
});
