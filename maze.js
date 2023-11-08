var c;
var ctx;
var myKey;
var isKey;

var isWallVert;
var isWallHorz;

var exit = new Array (2);
var isChecked = new Array (11);
var size = 15;
var wallWidth = 0;
var gridSquareSize = 0;

var myMaze;

var keysPressed = 0;
var speed = 6;

function startGame() {
	
	// canvas and context
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	
	// size
	size = 10;
	wallWidth = 10;
	gridSquareSize = 40;
	character.size = 20;
    enemy.size = 20;
	
	window.addEventListener('keydown', function (e) {
		myKey = e.keyCode;
        //keysPressed++;
	})
	window.addEventListener('keyup', function (e) {
        keysPressed--;
        //if (keysPressed == 0) {
            myKey = false;
            isKey = false;
            character.num = 0;
        //}
	})
	
	resetGame();
}

// Creates a random maze
function makeMaze() {
	var boxesFilled = 0;
	var moveUp = true;
	var moveDown = true;
	var moveRight = true;
	var moveLeft = true;
	var row = 0;
	var column = 0;

	c.height = wallWidth + gridSquareSize * size;
	c.width = wallWidth + gridSquareSize * size;
	
	isWallVert = new Array (size + 1);
	isWallHorz = new Array (size + 1);
	isChecked = new Array(size);
	
    // initialize arrays
	for (var i = 0; i < size + 1; i++) {
		isWallVert[i] = new Array();
		isWallHorz[i] = new Array()
		for (var j = 0; j < size + 1; j++) {
			isWallVert[i].push(true);
			isWallHorz[i].push(true);
		}
	}
	
	for (var i = 0; i < size; i++) {
		isChecked[i] = new Array ()
		for (var j = 0; j < size; j++) {
			isChecked[i].push(false);
		}
	}
	
	clearInterval(myMaze);
	
	// determines starting spot and exit
	if (Math.floor(Math.random() * 2) == 0){
		column = Math.floor(Math.random() * size);
		row = size;
		exit[0] = row;
		exit[1] = column;
		
		column = Math.floor(Math.random() * size);
		row = 0;
		
		character.x = column * gridSquareSize + ((gridSquareSize - character.size - wallWidth) / 2) + wallWidth;
		character.y = ((gridSquareSize - character.size - wallWidth) / 2) + wallWidth;;
		
	} else {
		row = Math.floor(Math.random() * size);
		column = size;
		exit[0] = row;
		exit[1] = column;
		
		row = Math.floor(Math.random() * size);
		column = 0;
		
		character.x = ((gridSquareSize - character.size - wallWidth) / 2) + wallWidth;
		character.y = row * gridSquareSize + ((gridSquareSize - character.size - wallWidth) / 2) + wallWidth;
	}
	
	isChecked[row][column] = true;
	
    // Creates the Maze
	do {

        // From the current position, determines which directions a path could be made in
		do {
			moveUp = true;
			moveDown = true;
			moveRight = true;
			moveLeft = true;
		
			if (row == 0 || isChecked[row - 1][column]) {
				moveUp = false;
			}
			
			if (row == size - 1 || isChecked[row + 1][column]) {
				moveDown = false;
			}
			
			if (column == 0 || isChecked[row][column - 1]) {
				moveLeft = false;
			}
			
			if (column == size - 1 || isChecked[row][column + 1]) {
				moveRight = false;
			}
			
			if (!moveUp && !moveDown && !moveLeft && !moveRight) {
				var i = Math.floor(Math.random()*size)
				var j = Math.floor(Math.random()*size)
				if (isChecked[i][j]) {
					row = i;
					column = j;
				}
				continue;
			}
			
			break;
		} while (true);
		
        // Randomly chooses one direction to move in
		do {
			switch (Math.floor(Math.random() * 4)) {
				case 0: 
					if (moveUp) {
						isWallHorz[row][column] = false;
						row--;
						break;
					}
					continue;
				case 1: 
					if (moveDown) {
						row++;
						isWallHorz[row][column] = false;
						break;
					}
					continue;
				case 2: 
					if (moveLeft) {
						isWallVert[row][column] = false;
						column--;
						break;
					}
					continue;
				case 3: 
					if (moveRight) {
						column++;
						isWallVert[row][column] = false;
						break;
					}
					continue;
			}
			break;
		} while (true);
		
		isChecked[row][column] = true;
		boxesFilled ++;
	} while (boxesFilled < size * size - 1);
	
    for (var i = 0; i < 8; i ++) {
    	column = 1 + Math.floor(Math.random() * (size - 1));
    	row = 1 + Math.floor(Math.random() * (size - 1));
    	isWallVert[row][column] = false;
        
        column = 1 + Math.floor(Math.random() * (size - 1));
    	row = 1 + Math.floor(Math.random() * (size - 1));
    	isWallHorz[row][column] = false;
    }
	
    if (exit[0] == size) {
        isWallHorz[exit[0]][exit[1]] = false;
    } else {
        isWallVert[exit[0]][exit[1]] = false;
    }

	myMaze = setInterval(playGame, 15);
}

function playGame () {
	clear();
	x = 0;
	y = 0;

	c.style.backgroundColor = "grey";
	
    // fills in the vertical walls
	for (i in isWallVert) {
		for (j in isWallVert[i]) {
			if (isWallVert[i][j]) {
				ctx.fillStyle = 'white'
				ctx.fillRect(x, y, wallWidth, gridSquareSize);
			}
			x += gridSquareSize;
		}
		x = 0;
		y += gridSquareSize;
	}
	
    // fills in the horizontal walls
	x = 0;
	y = 0;
	for (i in isWallHorz) {
		for (j in isWallHorz[i]) {
			if (isWallHorz[i][j]) {
				ctx.fillStyle = 'white'
				ctx.fillRect(x, y, gridSquareSize, wallWidth);
			}
			x += gridSquareSize;
		}
		x = wallWidth;
		y += gridSquareSize;
	}
	
    // fills in the corners of walls
	x = 0;
	y = 0;
	for (var i = 0; i < size + 1; i++) {
		for (var j = 0; j < size + 1; j++) {
			ctx.fillStyle = 'white'
			ctx.fillRect(x, y, wallWidth, wallWidth);
			x += gridSquareSize;
		}
		
		x = 0;
		y += gridSquareSize;
	}
	
	if (myKey) {
		//character.num ++;
		character.row = Math.floor(character.y / gridSquareSize);
		character.column = Math.floor(character.x / gridSquareSize);
		if (myKey == 37) {
			if ((isWallVert[character.row][character.column] || (character.y % gridSquareSize < wallWidth || character.y % gridSquareSize > (gridSquareSize - character.size))) && character.x % gridSquareSize <= wallWidth) {
				
			} else {
				character.x -= speed;
				if (character.x % gridSquareSize < wallWidth && (isWallVert[character.row][character.column] || character.y % gridSquareSize < wallWidth || character.y % gridSquareSize > (gridSquareSize - character.size))) {
					character.x = character.column * gridSquareSize + wallWidth;
				}
			}
		} else if (myKey == 39) {
			if (character.column == size) {
				character.x+= speed;
			} else if ((isWallVert[character.row][character.column + 1] || (character.y % gridSquareSize < wallWidth || character.y % gridSquareSize > (gridSquareSize - character.size))) && character.x % gridSquareSize >= (gridSquareSize - character.size)) {

			} else {
				character.x += speed;
				if (character.x % gridSquareSize > (character.size - wallWidth) && (isWallVert[character.row][character.column + 1] || character.y % gridSquareSize < wallWidth || character.y % gridSquareSize > (gridSquareSize - character.size))) {
					character.x = character.column * gridSquareSize + (gridSquareSize - character.size);
				}
			}
			
		} else if (myKey == 38) {
			if ((isWallHorz[character.row][character.column] || (character.x % gridSquareSize < wallWidth || character.x % gridSquareSize > (gridSquareSize - character.size))) && character.y % gridSquareSize <= wallWidth) {

			} else {
				character.y -= speed;
				if (character.y % gridSquareSize < wallWidth && (isWallHorz[character.row][character.column] || character.x % gridSquareSize < wallWidth || character.x % gridSquareSize > (gridSquareSize - character.size))) {
					character.y = character.row * gridSquareSize + wallWidth;
				} 
			}
		} else if (myKey == 40) {
			if (character.row == size) {
				character.y += speed;
			} else if ((isWallHorz[character.row + 1][character.column] || character.x % gridSquareSize < wallWidth || character.x % gridSquareSize > (gridSquareSize - character.size)) && character.y % gridSquareSize >= (gridSquareSize - character.size)){

			} else {
				character.y += speed;
				if (character.y % gridSquareSize > (gridSquareSize - character.size) && (isWallHorz[character.row + 1][character.column] || character.x % gridSquareSize < wallWidth || character.x % gridSquareSize > (gridSquareSize - character.size))) {
					character.y = character.row * gridSquareSize + (gridSquareSize - character.size);
				}
			}
		}
	}
	
	character.draw();
	
	for (var i = 0; i < 3; i++) {
		if (character.x <= enemy.x[i] + enemy.size && character.x + character.size >= enemy.x[i] && character.y <= enemy.y[i] + enemy.size && character.y + character.size >= enemy.y[i]) {
			resetGame();
		} else {
			enemy.draw(i);
		}
	}

    if (character.x > c.width || character.y > c.height) {
        resetGame();
    }
}

function resetGame () {
    var input = document.getElementById("size").value;
    if ((input - 0) == input && (''+input).trim().length > 0) {
        size = input;
    }

    var midpoint = (Math.floor(size / 2) + 0.5) * gridSquareSize - enemy.size / 2 + wallWidth / 2;

    enemy.x = [midpoint, midpoint, midpoint];
    enemy.y = [midpoint, midpoint, midpoint];

    enemy.moving = [-1,-1,-1];
    enemy.cantMove = [0,0,0];
    enemy.isBetween = [false,false,false];
    papersGrab = 0;
    clearInterval(myMaze);
    makeMaze();
}

function print (words,x,y,size) {
	var lines = words.split('\n');
	for (var i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], x, y + (i * size));
	}
}

function clear () {
    ctx.clearRect(0, 0, c.width, c.height);
}

var character = {
	draw: function () {
		ctx.fillStyle = 'red';
		ctx.fillRect(this.x, this.y, this.size, this.size);
	},
	x: 0,
	y: 0,
	row: 0,
	column: 0,
	size: 0,
	num: 0
};

var enemy = {
	draw: function (i) {
        this.imgNum++;
		if (this.imgNum != 0) {
			this.stop(i);
		}

        if (this.moving[i] == -1) {	
			this.moving[i] = Math.floor(Math.random() * 4);
		} else if (this.moving[i] == 0) {
			this.cantMove[i] = 1;
			this.y[i]++;
		} else if (this.moving[i] == 1) {
			this.cantMove[i] = 0;
			this.y[i]--;
		} else if (this.moving[i] == 2) {
			this.cantMove[i] = 3;
			this.x[i]++;
		} else {
			this.cantMove[i] = 2;
			this.x[i]--;
		}

		ctx.fillStyle = 'blue';
		ctx.fillRect(this.x[i], this.y[i], this.size, this.size);
	},
	stop: function (i) {
		this.size = character.size;
		var num = 0;
		var half = ((gridSquareSize - wallWidth - this.size) / 2);
		var column = Math.floor(this.x[i] / gridSquareSize);
		var row = Math.floor(this.y[i] / gridSquareSize);
		
		if (isWallHorz[row + 1][column]) {
			num++;
		}
		if (isWallHorz[row][column]) {
			num++;
		}
		if (isWallVert[row][column + 1]) {
			num++;
		}
		if (isWallVert[row][column]) {
			num++;
		}
		
		if (this.x[i] == c.width - this.size) {
			this.cantMove[i] = 2;
		} else if (this.y[i] == c.height - this.size) {
			this.cantMove[i] = 0;
		} else if (num == 3) {
			this.cantMove[i] = -1;
		}
		
		if (!this.isBetween[i] && num == 1 && this.y[i] % gridSquareSize <= (gridSquareSize - this.size - half) && this.y[i] % gridSquareSize >= wallWidth + half&& this.x[i] % gridSquareSize <= (gridSquareSize - this.size - half) && this.x[i] % gridSquareSize >= wallWidth + half) { 
			this.moving[i] = -1;
			this.isBetween[i] = true;
		} else if (this.moving[i] == this.cantMove[i]) {
			this.moving[i] = -1;
		} else {
			switch (this.moving[i]) {
				case 0:
					if ((isWallHorz[row + 1][column] || this.x[i] % gridSquareSize < wallWidth|| this.x[i] % gridSquareSize > (gridSquareSize - this.size)) && this.y[i] % gridSquareSize >= (gridSquareSize - this.size - half)) {
						this.isBetween[i] = false;
						this.moving[i] = -1;
					}
					break;
				case 1:
					if ((isWallHorz[row][column] || (this.x[i] % gridSquareSize < wallWidth || this.x[i] % gridSquareSize > (gridSquareSize - this.size))) && this.y[i] % gridSquareSize <= wallWidth + half) {
						this.isBetween[i] = false;
						this.moving[i] = -1;
					}
					break;
				case 2:
					if ((isWallVert[row][column + 1] || (this.y[i] % gridSquareSize < wallWidth|| this.y[i] % gridSquareSize > (gridSquareSize - this.size))) && this.x[i] % gridSquareSize >= (gridSquareSize - this.size - half)) {
						this.isBetween[i] = false;
						this.moving[i] = -1;
					}
					break;
				case 3:
					if (((isWallVert[row][column] || (this.y[i] % gridSquareSize < wallWidth|| this.y[i] % gridSquareSize > (gridSquareSize - this.size))) && this.x[i] % gridSquareSize <= wallWidth + half)) {
						this.isBetween[i] = false;
						this.moving[i] = -1;
					}
					break;
			}
		}
	},
	x: [295, 575, 295],
	y: [295, 295, 575],
	size: 0,
	moving: [-1,-1,-1],
	cantMove: [0,0,0],
	isBetween: [false,false,false],
	imgNum: 0
	
};