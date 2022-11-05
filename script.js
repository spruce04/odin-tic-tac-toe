//This is the main module for controlling the game board and other related elements - probably could be highly optimised
const gameBoard = (() => {
    //variables assigned on initial creation
    const status = document.getElementById('status');
    status.textContent = 'Waiting for game to begin';
    let play = true;
    let firstTurn = true;
    const reset = document.getElementById('reset');
    const tiles = document.getElementsByClassName("square");

    //This array contains arrays of indexes which would result in a player having won the game
    const winCons = [
        [0, 1, 2],
        [0, 4, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8]
    ];
    //This is the array where we will store choices and update the game board
    let places = Array.apply(null, Array(9));

    //This function updates our game board based on values in 'places' array
    const updateBoard = () => {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].textContent = places[i];
        }
    }

    //This function records the move of a player when they click on a square
    const recordMove = (index) => {
        if (places[index] != null) {
            return;
        }
        if (play == false) {
            return;
        }
        let letter;
        let ActiveName;
        let NextName;

        //we want to do different things depending on whose turn it is
        if (firstTurn) {
            firstTurn = false;
            letter = playerOne.privateLetter();
            ActiveName = playerOne.privateName();
            NextName = playerTwo.privateName();
            if (ActiveName == '') {
                ActiveName = 'Player One';
            }
            if (NextName == '') {
                NextName = 'Player Two';
            }
        } else {
            firstTurn = true;
            letter = playerTwo.privateLetter()
            ActiveName = playerTwo.privateName();
            NextName = playerOne.privateName();
            if (NextName == '') {
                NextName = 'Player One';
            }
            if (ActiveName == '') {
                ActiveName = 'Player Two';
            }
        }

        //after we have recorded the player's choice, update our game board and check if anyone has won
        status.textContent = `${NextName}'s turn`;
        places[index] = letter;
        updateBoard();
        checkWin(ActiveName);
    }
    //when the squares are clicked, call the above function on the square
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener("click", () => {
            recordMove(i);
        });
    }

    //this function checks if a player has won the game
    const checkWin = (ActiveName) => {
        for (let l = 0; l < winCons.length; l++) {
            const valueOne = winCons[l][0];
            const valueTwo = winCons[l][1];
            const valueThree = winCons[l][2];
            //Check if our values in 'places' match anything in the winCons array
            if (places[valueOne] == places[valueTwo] && places[valueTwo] == places[valueThree] && places[valueOne] != undefined) {
                status.textContent = `${ActiveName} wins!`;
                play = false;
                reset.style.display = 'block';
                reset.addEventListener("click", playAgain);
                return;

            }
        }
        //if nobody has won and there are no empty squares left, it is a draw
        if (places.includes(undefined) == false) {
            status.textContent = `It's a draw!`;
            play = false;
            reset.style.display = 'block';
            reset.addEventListener("click", playAgain);
            return;
        }
    }

    //reset the game
    const playAgain = () => {
        for (let p = 0; p < places.length; p++) {
            places[p] = undefined;
        }
        play = true;
        firstTurn = true;
        updateBoard();
        status.textContent = 'Waiting for game to begin';
    }
})();

//factory function for players
const Player = (name, letter) => {
    const privateName = () => {
        return name;
    }
    const privateLetter = () => {
        return letter;
    }
    return {
        privateName,
        privateLetter
    }
};

//initial players
let playerOne = Player('Player One', 'X');
let playerTwo = Player('Player Two', 'O');

//we will get our player names from here
const nameOne = document.getElementById('nameOne');
const nameTwo = document.getElementById('nameTwo');
//when there is a change to the player name input, change the player's name in the program
nameOne.addEventListener("change", () => {
    playerOne = Player(nameOne.value, 'X');
})
nameTwo.addEventListener("change", () => {
    playerTwo = Player(nameTwo.value, 'O');
})

//this module controls the colour scheme and allows for switching to AI mode - work in progress
const DisplayController = (() => {
    //change colour scheme when button is clicked
    let vsBot = false;
    const checkMode = (r) => {
        if (r == undefined) {
            return
        }; //when it is first called
        alert('work in progress');
        return;
        const rs = getComputedStyle(r);
        const holdValue = rs.getPropertyValue('--main-colour');
        r.style.setProperty('--main-colour', rs.getPropertyValue('--side-colour'));
        r.style.setProperty('--side-colour', holdValue);
        vsBot ? (vsBot = false, toggle.innerHTML = 'Play vs Bot') : (vsBot = true, toggle.innerHTML = 'Play vs Player');
        console.log(vsBot);
    };
    return {
        checkMode
    };
})();

//when someone changes to AI mode, change the colour scheme
const toggle = document.getElementById("toggleMode");
toggle.addEventListener("click", () => {
    const r = document.querySelector(":root");
    DisplayController.checkMode(r);
});