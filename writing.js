// Funktionen zum Schreiben in Busse/Ram
function writeToRam(Value, Address) {
    Ram[Address] = Value;
    document.getElementsByClassName("col2")[Address].innerHTML = zeroPad(Value, ramLength + 1).substr(0, 2) + "." + zeroPad(Value, ramLength + 1).substr(2, ramLength + 1)
    AddOpnd(Address);
    localStorage.setItem('johnny-ram', JSON.stringify(Ram));
}

function writeToAddressBus(number) {
    addressBus = parseInt(number);
    document.getElementById("AddressBus").innerText = zeroPad(addressBus, ramLength - 1)
}

function writeToIns(number) {
    ins = parseInt(number);
    document.getElementById("InsHi").innerText = zeroPad(number, ramLength + 1).substr(0, 2);
    document.getElementById("InsLow").innerText = zeroPad(number, ramLength + 1).substr(2, ramLength + 1)
}


function writeToDb(number) {
    dataBus = parseInt(number);
    document.getElementById("DataBus").innerText = zeroPad(number, ramLength + 1)
}

function writeToMc(number) {
    document.getElementsByClassName("MicroCodeTable")[microcodeCounter].style.background = ""

    microcodeCounter = parseInt(number);
    document.getElementById("MicoCodeCounter").innerText = zeroPad(number, ramLength - 1)

    // highlighten der spalte
    highlightMc(microcodeCounter)
}

function writeToAcc(number) {
    Akkumulator = parseInt(number);
    document.getElementById("Accumulator").innerText = zeroPad(number, ramLength + 1);
}

function writeToPc(number) {
    programCounter = parseInt(number);
    document.getElementById("ProgramCounter").innerText = zeroPad(number, ramLength - 1);
    EditRam(programCounter);
}
