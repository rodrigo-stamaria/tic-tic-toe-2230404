let bestPlayers = JSON.parse(localStorage.getItem("bestPlayers")) || [];
let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];
let buttons = Array.from(document.getElementsByTagName("button"));
let finishedMatch = false;
let setted = 0;
let token = ["O", "X"];
let turn = 1;
let winText = document.getElementById("win-text");

buttons.forEach(x => x.addEventListener("click", setToken));

let startTime = new Date().getTime();

function setToken(event) {
    let pressedButton = event.target;
    if (!finishedMatch && pressedButton.innerHTML == ""){
        pressedButton.innerHTML = token[turn];
        setted += 1;

        let matchStatus = gameStatus();
        if (matchStatus == 0) {
            switchTurn();
            if (setted < 9) {
                computerTurn();
                matchStatus = gameStatus();
                setted += 1;
                switchTurn();
            }
        }

        if(matchStatus == 1){
			winText.innerHTML = "¡Ganaste!";
            finishedMatch = true;
            winText.style.visibility = "visible";
            let endTime = new Date().getTime();
            let timeSpent = endTime - startTime;
            console.log("Tiempo transcurrido:", timeSpent); // Verifica el tiempo
            saveWinner(timeSpent);
		} else if(matchStatus == -1){
			winText.innerHTML = "Perdiste..."
			finishedMatch = true;
			winText.style.visibility = "visible";
		} else if(matchStatus == 0 && setted == 9){
			winText.innerHTML = "Nadie gana .-."
			finishedMatch = true;
			winText.style.visibility = "visible";
		}
    }
}

function gameStatus() {
    let victoryPosition = 0;
    let status = 0;

    function equals(...args) {
        let values = args.map(x => x.innerHTML);
        if (values[0] != "" && values.every((x, i, arr) => x === arr[0])) {
            args.forEach(x => x.style.backgroundColor = "#ffffff");
            return true;
        } else {
            return false;
        }
    }

    if(equals(buttons[0], buttons[1], buttons[2])){
		victoryPosition = 1;
	} else if(equals(buttons[3], buttons[4], buttons[5])){
		victoryPosition = 2;
	} else if(equals(buttons[6], buttons[7], buttons[8])){
		victoryPosition = 3;
	} else if(equals(buttons[0], buttons[3], buttons[6])){
		victoryPosition = 4;
	} else if(equals(buttons[1], buttons[4], buttons[7])){
		victoryPosition = 5;
	} else if(equals(buttons[2], buttons[5], buttons[8])){
		victoryPosition = 6;
	} else if(equals(buttons[0], buttons[4], buttons[8])){
		victoryPosition = 7;
	} else if(equals(buttons[2], buttons[4], buttons[6])){
		victoryPosition = 8;
	}

    if (victoryPosition > 0) {
        if (turn == 1) {
            status = 1;
        } else {
            status = -1;
        }
    }

    return status;
}

function switchTurn() {
    if (turn == 1) {
        turn = 0;
    } else {
        turn = 1;
    }
}

function computerTurn() {
    function random(min,max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let values = buttons.map(x => x.innerHTML);
    let position = -1;

    if (values[4] == "") {
        position = 4;
    } else {
        let n = random(0, buttons.length-1);
        while (values[n] != "") {
            n = random(0, buttons.length-1);
        }
        position = n;
    }

    buttons[position].innerHTML = "O"
    return position;
}

function saveWinner(timeSpent) { // Supone que recibes el tiempo transcurrido
    let playerName = prompt("¡Felicidades! Ingresa tu nombre:");
    if (playerName) {
        // Almacenar el tiempo actual como un timestamp
        let bestTimeRecord = {
            name: playerName,
            time: timeSpent, // Tiempo en milisegundos
        };
        
        // Asegúrate de que bestTimes está inicializado correctamente
        bestTimes.push(bestTimeRecord);

        // Ordenar los mejores tiempos en orden ascendente
        bestTimes.sort((a, b) => a.time - b.time);

        // Guardar en localStorage
        localStorage.setItem("bestTimes", JSON.stringify(bestTimes));

        // Actualizar la lista de mejores jugadores
        updateBestPlayersList();
    }
}

function updateBestPlayersList() {
    console.log("Best Times:", bestTimes);
    const bestPlayersList = document.getElementById("best-players-list");
    bestPlayersList.innerHTML = ""; 
    bestTimes.slice(0, 10).forEach((record, index) => {
        const playerElement = document.createElement("li");
        playerElement.textContent = `${index + 1}. ${record.name} - ${record.time} ms`;
        bestPlayersList.appendChild(playerElement);
    });
}



window.onload = function() {
    updateBestPlayersList();
}