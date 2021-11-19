// Create new RAM table
function generateRam() {
    p = document.getElementById("RamTBody");
    while (p.firstChild) {
        p.removeChild(p.firstChild);
    }

    for (var n = 0; n < ramSize; n++) {
        newtr = document.createElement("tr");
        //erstellen der Spalten
        newtd1 = document.createElement("td");
        newtd = document.createElement("td");
        newtd2 = document.createElement("td");
        newtd3 = document.createElement("td");
        newtd4 = document.createElement("td");
        //erstellen der Inhalte
        newtd1.appendChild(document.createTextNode(n));
        newtd.appendChild(document.createTextNode("00.000"));

        //einfügen der Spalten
        Att = document.createAttribute("class");
        Att.value = "col1";
        newtd1.setAttributeNode(Att);

        tdwith = document.createAttribute("width");
        tdwith.value = "25%";
        newtd1.setAttributeNode(Att);
        newtd1.setAttributeNode(tdwith);

        newtr.appendChild(newtd1);

        Att = document.createAttribute("class");
        Att.value = "col2";
        newtd.setAttributeNode(Att);
        tdwith = document.createAttribute("width");
        tdwith.value = "25%";

        newtd.setAttributeNode(tdwith);
        newtr.appendChild(newtd);

        Att = document.createAttribute("class");
        Att.value = "col4";
        newtd3.setAttributeNode(Att);
        tdwith = document.createAttribute("width");
        tdwith.value = "25%";
        newtd3.setAttributeNode(tdwith);
        newtr.appendChild(newtd3);

        Att = document.createAttribute("class");
        Att.value = "col5";
        newtd4.setAttributeNode(Att);
        tdwith = document.createAttribute("width");
        tdwith.value = "25%";
        newtd4.setAttributeNode(tdwith);
        newtr.appendChild(newtd4);


        //Recognize which column was clicked on
        Att = document.createAttribute("class");
        Att.value = "RamCell";
        newtr.setAttributeNode(Att);
        Att = document.createAttribute("ID");
        Att.value = n;

        newtr.setAttributeNode(Att);
        p.appendChild(newtr);

        //Onclick event to enter data
        document.getElementsByClassName("RamCell")[n].addEventListener("click", EditRam)
    }
    ;
} 

function updateRam() {
    for (i = 0; i < ramSize; i++) {
        writeToRam(parseInt(Ram[i]), i)
    }
}

function GenerateMicroCodeTable() {
    var p = document.getElementById("McTBody");

    // Empty all entries - required if microcode is loaded from file
    while (p.firstChild) {
        p.removeChild(p.firstChild);
    }

    for (i = 0; i < 200; i++) {
        newtr = document.createElement("tr");

        Att = document.createAttribute("class");
        Att.value = "MicroCodeTable";
        newtr.setAttributeNode(Att);

        // erstellen der Spalten
        newtd1 = document.createElement("td");
        newtd2 = document.createElement("td")
        Att = document.createAttribute("class");
        Att.value = "Mccol1";
        newtd1.setAttributeNode(Att);
        Att = document.createAttribute("class");
        Att.value = "Mccol2";
        newtd2.setAttributeNode(Att);
        newtd1.appendChild(document.createTextNode(zeroPad(i, 3)));

        newtr.appendChild(newtd1);

        newtd2.innerText = microCodeToText(parseInt(MicroCode[i]))
        newtr.appendChild(newtd2);
        p.appendChild(newtr);
    }


    // Insert macro-instruction to RAM dropdown menu
    p = document.getElementById("CommandSelect");
    while (p.firstChild) {
        p.removeChild(p.firstChild); //remove old entries (required if newly loaded)
    }
    for (i = 200; i < MicroCode.length; i++) {

        document.getElementsByClassName("Mccol1")[(i - 200) * 10].appendChild(document.createTextNode("   " + MicroCode[i] + ":"));

        if (i > 200) { //"fetch" instruction can't be selected
            newOption = document.createElement("option");
            Att = document.createAttribute("value");
            Att.value = i - 200;
            newOption.setAttributeNode(Att);
            newOption.appendChild(document.createTextNode(zeroPad((i - 200), 2) + ": " + MicroCode[i]));
            p.appendChild(newOption)
        }
    }

    updateRam(); // show new macro-instructions in RAM table
}

//Convert microcode ID to text as seen in microcode table
function microCodeToText(id) {
    switch (id) {
        case 0:
            return "---";
        case 2:
            return "ram ⇒ db ";
        case 1:
            return "db ⇒ ram";
        case 13:
            return "plus";
        case 14:
            return "minus";
        case 12:
            return "acc:=0";
        case 18:
            return "db ⇒ acc";
        case 15:
            return "acc ⇒ db ";
        case 16:
            return "acc++";
        case 17:
            return "acc--";
        case 3:
            return "db ⇒ ins";
        case 5:
            return "ins ⇒ mc";
        case 11:
            return "ins ⇒ pc";
        case 4:
            return "ins ⇒ ab";
        case 8:
            return "pc ⇒ ab";
        case 7:
            return "mc := 0";
        case 9:
            return "pc++";
        case 10:
            return "acc==0? ⇒ pc++";
        case 19:
            return "stop";
        default:
            console.error("Invalid instruction " + instruction);
            return;
    }
}
