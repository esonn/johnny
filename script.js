/*
    David Laubersheimer - 2019
    mit dank an Dr. Peter Dauscher
*/

/* data which is reset on every execution */
var addressBus = 0;
var dataBus = 0;
var halt = false;
var Akkumulator = 0;

var pause = false;

var ins = 0;
var programCounter = 0;

var microcodeCounter = 0;
var recording = false;
var recordingCounter = 150; //position indicator

/* data which is *not* reset on every execution */
var bonsai = false;
var timeoutforexecution; //abort executed program
var previousProgramCounter = 0;
var executionSpeed = 1700; // delay in ms

var SelectetRamModule = 0;
var dataHighlightedRamModule = 0;

var controlUnit = false;
var numberDevisionChar = "."; //"." vs "," decimal place separator
var MicroCode = []; //0-199 microcode, 200+ name of macrocodes
var MicroCodeString = ""; //for input only
var lines = [];

var blockFadeoutTime = 1200;

var blinkSpeed = 700;
var blinkCycle = 0;
var blinkTimeout; //to abort blinking process

var RamArrowHeight; // RAM input arrow position (left)
var tableHeight;

var startScreenFadeOutTime = 1000; // loading screen
var loaded = false;

const ramSize = 1000  //this ideally has to be a multiple of 10
const ramLength = Math.log10(ramSize) + 1;

var Ram = JSON.parse(localStorage.getItem('johnny-ram'));
if (Ram == null) {
    //default if local store has been cleared or johnny is started for the first time
    Ram = [];
    for (i = 0; i < ramSize; i++) {
        Ram[i] = 0;
    }
}


var turboMode = false;

function initialize() {
    instructionsauswahl = document.getElementById("CommandSelect");

    generateRam();

    MicroCode = JSON.parse(localStorage.getItem('johnny-microcode'));
    if (MicroCode == null) {
        resetMicrocode();
    } else {
        GenerateMicroCodeTable();
    }

    document.getElementById("executeSpeedSlider").value = executionSpeed;
    document.getElementById("controlUnitCheckbox").checked = false;

    document.getElementById("AddressBusInput").addEventListener("keydown", AddressBusInputKeydown);//damit die Entertaste funktioniert
    document.getElementById("DataBusInput").addEventListener("keydown", DataBusInputKeydown);
    document.getElementById("RamInput").addEventListener("keydown", RamInputKeydown);
    document.addEventListener("keydown", keyDownHandler); //for loading screen skip only
    document.addEventListener("mousedown", mouseDownHandler); //for loading screen skip only
    window.addEventListener('resize', resize);

    document.getElementById(0).style.background = "#00F45D";
    
    loaded = true;
    document.getElementById("loading").innerText = "";
    var loadEnd = new Date().getTime()

    if (window.matchMedia('(display-mode: standalone)').matches) {
        fadeOutStartScreen();
    } else {
        setTimeout(fadeOutStartScreen, startScreenFadeOutTime - (loadEnd - LoadStart));
    }
}


function resetMicrocode() {
    microCodeString = "8;2;3;5;0;0;0;0;0;0;12;4;2;13;9;7;0;0;0;0;4;2;13;9;7;0;0;0;0;0;4;2;14;9;7;0;0;0;0;0;4;15;1;9;7;0;0;0;0;0;11;7;0;0;0;0;0;0;0;0;4;2;18;10;9;7;0;0;0;0;12;4;2;13;16;15;1;9;7;0;12;4;2;13;17;15;1;9;7;0;4;12;15;1;9;7;0;0;0;0;19;7;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;FETCH;TAKE;ADD;SUB;SAVE;JMP;TST;INC;DEC;NULL;HLT";
    MicroCode = microCodeString.split(";");
    GenerateMicroCodeTable();
}

function fadeOutStartScreen() {// delayed removal of loading screen (only after startScreenFadeOutTime)
    document.getElementById("startscreen").style.display = "none";
    document.getElementById("programm").style.display = "inline";
    document.getElementsByTagName("body")[0].style.backgroundImage = "url(background.png)"
    document.removeEventListener("keydown", keyDownHandler);	//remains unused
    document.removeEventListener("mousedown", mouseDownHandler);	//remains unused

    document.getElementById("innerRamDiv").scrollTop = 0
    resize(); //RAM input correction
    resetComputer()
}

function keyDownHandler() {
    if (loaded) {
        fadeOutStartScreen();
    }
}


function mouseDownHandler() {
    if (loaded) {
        fadeOutStartScreen();
    }
}


function resize() {
    //reposition RAM arrow on size change
    RamArrowHeight = getObjectHeight(document.getElementById("RamEingabe"))
    tableHeight = getObjectHeight(document.getElementById(SelectetRamModule))
    document.getElementById("RamEingabe").style.top = (document.getElementById(SelectetRamModule).getBoundingClientRect().top - RamArrowHeight / 2 + tableHeight / 2) + "px";

    // needed for the Safari fix
    scrollMaxX = document.body.scrollWidth - window.innerWidth;
    scrollMaxY = document.body.scrollHeight - window.innerHeight;
}

function RamInputKeydown(e) {
    if (e.key == "Enter") {
        ManuellRam();
    }
}

function DataBusInputKeydown(e) {
    if (e.key === "Enter") {
        ManuellDb()
    }
}

function AddressBusInputKeydown(e) {
    if (e.key === "Enter") {
        ManuellAB()
    }
}


//checks number presence and its values
function CheckNumber(X, maxValue, minValue) {
    if (X <= maxValue && typeof X == "number" && X >= minValue) {
        return X;
    } else if (X > maxValue) {
        return maxValue
    } else {
        return 0;
    }
}

function updateSpeed() {
    executionSpeed = 3000 - document.getElementById("executeSpeedSlider").value;
    if (executionSpeed == 0) {
        turboMode = true;
    } else {
        turboMode = false;
    }
}


function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}


function getObjectHeight(object) {
    return object.getBoundingClientRect().bottom - object.getBoundingClientRect().top
}


function recordBlinkingIndicator() {
    if (blinkCycle == 0) {
        document.getElementById("recordMcPanel").style.backgroundColor = "red";
        blinkCycle++;
    } else {
        document.getElementById("recordMcPanel").style.backgroundColor = "yellow";
        blinkCycle = 0;
    }
    blinkTimeout = setTimeout(recordBlinkingIndicator, blinkSpeed);
}

//Record a new macro-instruction (by issuing micro instructions)
function recordMacro() {
    if (recording) {
        recording = false;
        clearTimeout(blinkTimeout);
        document.getElementById("recordMcPanel").style.backgroundColor = "";
    } else {
        recording = true;
        recordingCounter = Math.floor(CheckNumber(parseInt(document.getElementById("new_macro_id").value), 200, 0) / 10) * 10 // ignore last digit
        MicroCode[recordingCounter / 10 + 200] = document.getElementById("new_macro_name").value; //store name
        document.getElementsByClassName("Mccol1")[recordingCounter].innerText = recordingCounter + "   " + MicroCode[recordingCounter / 10 + 200] + ":"; //add name to microcode

        for (i = recordingCounter; i < recordingCounter + 10; i++) {
            //reset microcode
            MicroCode[i] = 0;
            document.getElementsByClassName("Mccol2")[i].innerText = "";
        }


        //jump in microcode
        var myElement = document.getElementsByClassName('Mccol2')[recordingCounter - 10];
        var topPos = myElement.offsetTop;
        document.getElementById('testdiv').scrollTop = topPos;

        //add new macro to input options
        newOption = document.createElement("option");
        Att = document.createAttribute("value");
        Att.value = recordingCounter / 10;
        newOption.setAttributeNode(Att);
        newOption.appendChild(document.createTextNode(zeroPad(recordingCounter / 10) + ": " + MicroCode[recordingCounter / 10 + 200]));
        document.getElementById("CommandSelect").appendChild(newOption)
        recordBlinkingIndicator();
    }
}


//Add a new micro-instruction to a recording session
function addStepToMacro(instruction) {
    if (recording) {
        MicroCode[recordingCounter] = instruction;

        var myElement = document.getElementsByClassName('Mccol2')[recordingCounter - 10];
        var topPos = myElement.offsetTop;
        document.getElementById('testdiv').scrollTop = topPos;

        newtd2 = document.getElementsByClassName("Mccol2")[recordingCounter];
        newtd2.innerText = microCodeToText(instruction);

        localStorage.setItem("johnny-microcode", JSON.stringify(MicroCode));

        recordingCounter++;
    }
}


function executeProgram() {
    var maxRecursion = 15
    var currentRecursions = 0;

    SingleMacroStep();
    pause = false;

    //end at 1) halt, 2) infinit loops/jumps to same address
    if (!halt && previousProgramCounter != programCounter) {
        if (currentRecursions < maxRecursion && turboMode) {
            currentRecursions++;
            previousProgramCounter = programCounter;
            executeProgram();
        } else {
            timeoutforexecution = setTimeout(executeProgram, executionSpeed);
            currentRecursions = 0;
        }

        previousProgramCounter = programCounter;
    }
}


function SingleMacroStep() {
    microStep(false);
    while (microcodeCounter != 0) {
        microStep(false);
    }

}

function AddOpnd(Address) { // TODO: should this be enabled in turbo mode?
    high = parseInt(zeroPad(Ram[Address], ramLength + 1).substr(0, 2)) + 200; //+200 um auslesen aus Microcode zu vereinfachen

    if (MicroCode[high] != undefined && high != 200) {
        document.getElementsByClassName("col4")[Address].innerHTML = MicroCode[high];
        document.getElementsByClassName("col5")[Address].innerHTML = parseInt(zeroPad(Ram[Address], ramLength + 1).substr(2, ramLength + 1));
    } else {
        document.getElementsByClassName("col4")[Address].innerHTML = "";
        document.getElementsByClassName("col5")[Address].innerHTML = "";
    }

}


//read microcode input file
document.getElementById('microcodefile').onchange = function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        // Entire file
        // console.log(this.result);
        // By lines
        MicroCode = this.result.split('\n');

        for (i = 0; i < 200; i++) { //damit namen erhalten bleiben
            MicroCode[i] = parseInt(MicroCode[i]);
        }

        GenerateMicroCodeTable();//update table and selection of macroinstruction 
    };
    reader.readAsText(file);


};

//read RAM file
document.getElementById('ramfile').onchange = function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        // Entire file
        // console.log(this.result);
        // By lines
        Ram = this.result.split('\n');
        updateRam()
    };
    reader.readAsText(file);
};


//download RAM
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}


function pauseProgram() {
    if (!pause) {
        clearTimeout(timeoutforexecution);
        pause = true;

    } else {
        timeoutforexecution = setTimeout(executeProgram, executionSpeed);
        pause = false;
    }
}


function nextRamModule() {
    //decolorize
    document.getElementById(SelectetRamModule).style.background = "";
    if (SelectetRamModule < parseInt("9".repeat(ramLength - 1))) {

        SelectetRamModule++
    }

    //colorize column
    document.getElementById(SelectetRamModule).style.background = "yellow";

    if (document.getElementById(SelectetRamModule).getBoundingClientRect().top + tableHeight / 2 < document.getElementById("RamDiv").getBoundingClientRect().bottom) {
        document.getElementById("RamEingabe").style.top = (document.getElementById(SelectetRamModule).getBoundingClientRect().top - RamArrowHeight / 2 + tableHeight / 2) + "px"; //reposition RAM arrow on new input
    } else {
        document.getElementById("innerRamDiv").scrollTop = (SelectetRamModule - 1) * tableHeight;
        document.getElementById("RamEingabe").style.top = (document.getElementById(SelectetRamModule).getBoundingClientRect().top - RamArrowHeight / 2 + tableHeight / 2) + "px"; //reposition RAM arrow on new input
    }
}

function EditRam(CellNumber) {
    if (!turboMode) {
        //decolorize RAM
        if (dataHighlightedRamModule != SelectetRamModule) {
            document.getElementById(SelectetRamModule).style.background = "";
        }

        if (typeof (CellNumber) == "object") {
            //detect column
            SelectetRamModule = CellNumber.srcElement.parentNode.id;
        } else {
            SelectetRamModule = CellNumber;
        }

        //colorize column yellow
        if (dataHighlightedRamModule != SelectetRamModule) {
            document.getElementById(SelectetRamModule).style.background = "yellow";
        }

        if (document.getElementById(SelectetRamModule).getBoundingClientRect().top + tableHeight / 2 < document.getElementById("RamDiv").getBoundingClientRect().bottom) {
            document.getElementById("RamEingabe").style.top = (document.getElementById(SelectetRamModule).getBoundingClientRect().top - RamArrowHeight / 2 + tableHeight / 2) + "px"; //resposition RAM arrow on input
        } else {
            document.getElementById("innerRamDiv").scrollTop = (SelectetRamModule - 1) * tableHeight;
            document.getElementById("RamEingabe").style.top = (document.getElementById(SelectetRamModule).getBoundingClientRect().top - RamArrowHeight / 2 + tableHeight / 2) + "px"; //reposition RAM arrow on input
        }
    }

}


function highlightMc(column) {
    if (!turboMode) {
        var myElement = document.getElementsByClassName('Mccol2')[column];
        var topPos = myElement.offsetTop;
        document.getElementById('testdiv').scrollTop = topPos;

        document.getElementsByClassName("MicroCodeTable")[microcodeCounter].style.background = "yellow"
    }

}


function highlightRamAccess() {
    if (dataHighlightedRamModule == SelectetRamModule) {
        document.getElementById(SelectetRamModule).style.background = "yellow";
    } else {
        document.getElementById(dataHighlightedRamModule).style.background = "";
    }

    if (microcodeCounter != 1) { //don't show FETCH instruction
        dataHighlightedRamModule = addressBus;
        document.getElementById(dataHighlightedRamModule).style.background = "#00F45D";
    }
}
