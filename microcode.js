function SingleMicroStep() { //legacy(remove)?
    microStep();
}

function microStep(display) {
    switch (parseInt(MicroCode[microcodeCounter])) {
        case 2:
            RamDb();
            microcodeCounter++;
            if (display) {
                FadeIn(1);
                setTimeout(FadeOut, blockFadeoutTime, 1)
            }
            break;

        case 1:
            DbRam();
            microcodeCounter++;
            if (display) {
                FadeIn(0);
                setTimeout(FadeOut, blockFadeoutTime, 0)
            }
            break;

        case 13:
            AddAcc();
            microcodeCounter++;
            if (display) {
                FadeIn(3);
                setTimeout(FadeOut, blockFadeoutTime, 3)
            }
            break;

        case 14:
            SubAcc();
            microcodeCounter++;
            if (display) {
                FadeIn(3);
                setTimeout(FadeOut, blockFadeoutTime, 3)
            }
            break;

        case 12:
            NullAcc();
            microcodeCounter++;
            if (display) {
                FadeIn(11);
                setTimeout(FadeOut, blockFadeoutTime, 13)
            }
            break;

        case 18:
            DbAcc();
            microcodeCounter++;
            if (display) {
                FadeIn(3);
                setTimeout(FadeOut, blockFadeoutTime, 3)
            }
            break;

        case 15:
            AccDb();
            microcodeCounter++;
            if (display) {
                FadeIn(4);
                setTimeout(FadeOut, blockFadeoutTime, 4)
            }
            break;

        case 16:
            IncAcc();
            microcodeCounter++;
            if (display) {
                FadeIn(12);
                setTimeout(FadeOut, blockFadeoutTime, 12)
            }
            break;

        case 17:
            DecAcc();
            microcodeCounter++;
            if (display) {
                FadeIn(13);
                setTimeout(FadeOut, blockFadeoutTime, 13)
            }
            break;

        case 3:
            DbIns();
            microcodeCounter++;
            if (display) {
                FadeIn(2);
                setTimeout(FadeOut, blockFadeoutTime, 2)
            }
            break;

        case 5:
            InsMc();
            if (display) {
                FadeIn(5);
                setTimeout(FadeOut, blockFadeoutTime, 5)
            }
            break;

        case 11:
            InsPc();
            microcodeCounter++;
            if (display) {
                FadeIn(7);
                setTimeout(FadeOut, blockFadeoutTime, 7)
            }
            break;

        case 4:
            InsAd();
            microcodeCounter++;
            if (display) {
                FadeIn(6);
                setTimeout(FadeOut, blockFadeoutTime, 6)
            }
            break;

        case 8:
            PcAd();
            microcodeCounter++;
            if (display) {
                FadeIn(8);
                setTimeout(FadeOut, blockFadeoutTime, 8)
            }
            break;

        case 7:
            NullMc();
            if (display) {
                FadeIn(14);
                setTimeout(FadeOut, blockFadeoutTime, 14)
            }
            break;

        case 9:
            IncPc();
            microcodeCounter++;
            if (display) {
                FadeIn(17);
                setTimeout(FadeOut, blockFadeoutTime, 17)
            }
            break;

        case 10:
            IncPc0();
            microcodeCounter++;
            if (display) {
                FadeIn(16);
                setTimeout(FadeOut, blockFadeoutTime, 16)
            }
            break;

        case 19:
            Halt();
            microcodeCounter++;
            if (display) {
                FadeIn(15);
                setTimeout(FadeOut, blockFadeoutTime, 15)
            }
            break;

        default:
            console.error("Invalid instruction " + MicroCode[microcodeCounter] + "at address " + MicroCodeCounter + " - terminating program.");
            alert("No instruction at microcode address " + microcodeCounter + " - terminating program.")
            Halt();
            NullMc();
            break;
    } 

    document.getElementById("MicoCodeCounter").innerText = zeroPad(microcodeCounter, ramLength - 1);

    if (microcodeCounter > 0) {
        document.getElementsByClassName("MicroCodeTable")[microcodeCounter - 1].style.background = ""
    }
    highlightMc(microcodeCounter)

}


/* Micro-instructions */

function RamDb() {
    dataBus = Ram[addressBus];
    highlightRamAccess()
    document.getElementById("DataBus").innerHTML = zeroPad(dataBus, ramLength + 1);
    addStepToMacro(2);
}


function DbRam() {
    writeToRam(dataBus, addressBus)
    highlightRamAccess()
    addStepToMacro(1);
}

function DbAcc() {
    Akkumulator = dataBus;
    document.getElementById("Accumulator").innerHTML = zeroPad(Akkumulator, ramLength + 1)

    if (Akkumulator == 0) {
        FadeIn(9);
    } else {
        FadeOut(9);
    }
    addStepToMacro(18);
}

function AccDb() {
    dataBus = Akkumulator;
    document.getElementById("DataBus").innerHTML = zeroPad(dataBus, ramLength + 1)
    addStepToMacro(15);
}

function NullAcc() {
    Akkumulator = 0;
    document.getElementById("Accumulator").innerHTML = "00000";
    FadeIn(9);
    addStepToMacro(12);
}

function IncAcc() {
    if (Akkumulator < parseInt(1 + "9".repeat(ramLength))) {
        Akkumulator++
    }
    document.getElementById("Accumulator").innerHTML = zeroPad(Akkumulator, ramLength + 1)
    addStepToMacro(16);
    FadeOut(9);
}

function DecAcc() {
    if (Akkumulator > 0) Akkumulator--;
    document.getElementById("Accumulator").innerHTML = zeroPad(Akkumulator, ramLength + 1)
    if (Akkumulator == 0) {
        FadeIn(9);
    } else {
        FadeOut(9);
    }
    addStepToMacro(17);
}

function AddAcc() {
    if (Akkumulator + dataBus < "2" + "0".repeat(ramLength)) {
        Akkumulator += dataBus;
    } else Akkumulator = (1 + "9".repeat(ramLength)).toString();
    document.getElementById("Accumulator").innerHTML = zeroPad(Akkumulator, ramLength + 1)
    addStepToMacro(13);

    if (Akkumulator == 0) {
        FadeIn(9);
    } else {
        FadeOut(9);
    }
}

function SubAcc() {
    if (Akkumulator - dataBus >= 0) {
        Akkumulator -= dataBus;
    } else {
        Akkumulator = 0;
    }

    document.getElementById("Accumulator").innerHTML = zeroPad(Akkumulator, ramLength + 1)

    if (Akkumulator == 0) {
        FadeIn(9);
    } else {
        FadeOut(9);
    }
    addStepToMacro(14);
}

function DbIns() {
    writeToIns(dataBus);
    addStepToMacro(3);
}

function InsMc() {
    console.log(Math.floor(ins / ramSize) * 10);
    writeToMc(Math.floor(ins / ramSize) * 10) //get only the opcode
    addStepToMacro(5);
}

function InsAd() {
    writeToAddressBus(zeroPad(ins, ramLength + 1).substr(2, ramLength + 1));
    addStepToMacro(4);
}


function InsPc() {
    writeToPc(zeroPad(ins, ramLength + 1).substr(2, ramLength + 1))
    addStepToMacro(11);
}

function PcAd() {
    writeToAddressBus(programCounter);
    addStepToMacro(8);
}

function NullMc() {
    writeToMc(0)
    addStepToMacro(7);
}

function IncPc() {
    if (programCounter < parseInt("9".repeat(ramLength - 1))) {
        writeToPc(programCounter + 1)

    }
    addStepToMacro(9);
}

function IncPc0() {
    if (programCounter < parseInt("9".repeat(ramLength - 1)) && Akkumulator == 0) {
        writeToPc(programCounter + 1)
    }
    addStepToMacro(10);
}

function Halt() {
    alert("End of program.")
    halt = true;
    addStepToMacro(19);
}
