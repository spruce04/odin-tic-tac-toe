let vsBot;

//This is the main class for controlling the game board and other related elements - probably could be highly optimised
class GameBoard {
	constructor() {
		//variables assigned on initial creation
		this.status = document.getElementById('status');
		this.status.textContent = 'Waiting for game to begin';
		this.play = true;
		this.firstTurn = true;
		this.reset = document.getElementById('reset');
		this.tiles = document.getElementsByClassName("square");
		//when the squares are clicked, call the above function on the square
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].addEventListener("click", () => {
				this.recordMove(i);
			});
		}
	}
	
	//This array contains arrays of indexes which would result in a player having won the game
	winCons = [
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
	places = Array.apply(null, Array(9));

	//This function updates our game board based on values in 'places' array
	updateBoard = () => {
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].textContent = this.places[i];
		}
	}

	//This function records the move of a player when they click on a square
	recordMove = (index) => {
		if (this.places[index] != null) {
			return;
		}
		if (this.play == false) {
			return;
		}
		this.letter;
		this.ActiveName;
		this.NextName;

		//we want to do different things depending on whose turn it is
		if (this.firstTurn) {
			this.firstTurn = false;
			this.letter = playerOne.letter;
			this.ActiveName = playerOne.name;
			this.NextName = playerTwo.name;
			if (this.ActiveName == '') {
				this.ActiveName = 'Player One';
			}
			if (this.NextName == '') {
				this.NextName = 'Player Two';
			}
			if (vsBot) { //if Bot mode is on, we do this instead
				//finish players choice
				this.places[index] = this.letter;
				this.updateBoard();
				this.checkWin(this.ActiveName);
				//make the bots choice
				if (this.play != false) {
					this.firstTurn = true;
					this.letter = playerTwo.letter;
					this.ActiveName = playerTwo.name;
					this.NextName = playerOne.name;
					this.status.textContent = `${this.NextName}'s turn`;
					this.places[this.botChoice()] = this.letter;
					this.updateBoard();
					this.checkWin(this.ActiveName);
					return;
				}
			}
		} else {
			this.firstTurn = true;
			this.letter = playerTwo.letter;
			this.ActiveName = playerTwo.name;
			this.NextName = playerOne.name;
			if (this.NextName == '') {
				this.NextName = 'Player One';
			}
			if (this.ActiveName == '') {
				this.ActiveName = 'Player Two';
			}
		}
		//after we have recorded the player's choice, update our game board and check if anyone has won
		this.status.textContent = `${this.NextName}'s turn`;
		this.places[index] = this.letter;
		this.updateBoard();
		this.checkWin(this.ActiveName);
		this.addListeners()
	}

	addListeners() {
		//when the squares are clicked, call the above function on the square
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].addEventListener("click", () => {
				this.recordMove(i);
			});
		}
	}

	//this function checks if a player has won the game
	checkWin = (ActiveName) => {
		for (let l = 0; l < this.winCons.length; l++) {
			this.valueOne = this.winCons[l][0];
			this.valueTwo = this.winCons[l][1];
			this.valueThree = this.winCons[l][2];
			//Check if our values in 'places' match anything in the winCons array
			if (this.places[this.valueOne] == this.places[this.valueTwo] && this.places[this.valueTwo] == this.places[this.valueThree] && this.places[this.valueOne] != undefined) {
				this.status.textContent = `${ActiveName} wins!`;
				this.play = false;
				this.reset.style.display = 'block';
				this.reset.addEventListener("click", this.playAgain);
				return;
			}
		}
		//if nobody has won and there are no empty squares left, it is a draw
		if (this.places.includes(undefined) == false) {
			this.status.textContent = `It's a draw!`;
			this.play = false;
			this.reset.style.display = 'block';
			this.reset.addEventListener("click", this.playAgain);
			return;
		}
	}

	//Make a random choice (for the AI mode)
	botChoice = () => {
		//get empty squares
		this.possibleMoves = [];
		for (let a = 0; a < this.places.length; a++) {
			if (this.places[a] == null) {
				this.possibleMoves.push(a);
			}
		}
		//choose one at random
		this.chosen = this.possibleMoves[Math.floor(Math.random() * this.possibleMoves.length)];
		return this.chosen;
	}

	//reset the game
	playAgain = () => {
		for (let p = 0; p < this.places.length; p++) {
			this.places[p] = undefined;
		}
		this.play = true;
		this.firstTurn = true;
		if (nameTwo.placeholder == 'Bot') {
			playerTwo.name = nameTwo.placeholder;
		} else {
			playerTwo.name = nameTwo.value;
		}
		this.updateBoard();
		this.status.textContent = 'Waiting for game to begin';
		this.reset.style.display = 'none';
	}
};

const gameBoard = new GameBoard;

//class template for players
class Player {
	constructor(name, letter) {
		this.name = name;
		this.letter = letter;
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
	}

	get letter() {
		return this._letter;
	}

	set letter(value) {
		this._letter = value;
	}
}

//initial players
let playerOne = new Player('Player One', 'X');
let playerTwo = new Player('Player Two', 'O');

//we will get our player names from here
const nameOne = document.getElementById('nameOne');
const nameTwo = document.getElementById('nameTwo');
//when there is a change to the player name input, change the player's name in the program
nameOne.addEventListener("change", () => {
	playerOne.name = nameOne.value;
})
nameTwo.addEventListener("change", () => {
	playerTwo.name = nameTwo.value;
})

//this module controls the colour scheme and allows for switching to AI mode
class DisplayController {
	//change colour scheme when button is clicked
	constructor() {
		vsBot = false;
	}
	
	checkMode = (r) => {
		if (r == undefined) { //when it is first called
			return;
		};
		this.rs = getComputedStyle(r);
		this.holdValue = this.rs.getPropertyValue('--main-colour');
		r.style.setProperty('--main-colour', this.rs.getPropertyValue('--side-colour'));
		r.style.setProperty('--side-colour', this.holdValue);
		vsBot ? (vsBot = false, toggle.innerHTML = 'Play vs Bot') : (vsBot = true, toggle.innerHTML = 'Play vs Player');
		console.log(vsBot);
		gameBoard.playAgain();
		if (nameTwo.placeholder != 'Bot') {
			nameTwo.value = '';
			nameTwo.placeholder = 'Bot';
		} else {
			nameTwo.placeholder = 'Player Two Name';
		}
		gameBoard.playAgain();
		//return { //I couldn't figure out how to update this variable whenever it was changed, so I had to make it global.
		//vsBot
		//};
	};
};
const displayController = new DisplayController;

//when someone changes to AI mode, change the colour scheme
const toggle = document.getElementById("toggleMode");
toggle.addEventListener("click", () => {
	const r = document.querySelector(":root");
	displayController.checkMode(r);
});