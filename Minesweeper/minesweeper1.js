//Minesweeper Game
// 9 by 9 grid
// 10 bombs
// if click on empty square, will open up till border hits a number
// if click on number spare will only open that square
    //number square represent how many bombs are surrounding the square
// if click on bomb will lose
//flag option to mark bomb grid


//Global variable
//creating 9 by 9 grid
let totalGrid = [];
let row = 9;
let column = 9;

//creating mine array
let mineArray = [];

//create flag toggle tracker
let flagToggle= false;

//create tile tracker
let tileTrack = 0;

//gameOver
let gameOver = false;


//Creation of Functions for the game
//creating the remaining grids
function createGrid() {
    for (let a = 0; a < row; a++) {
        let row = [];
        for (let b = 0; b < column; b++) {
            let newGrid = document.createElement("div");
            newGrid.id = a.toString() + "-" + b.toString(); //setting div id for easy tracking/checking later
            newGrid.addEventListener("click", clickCheck);
            document.getElementById("grid").append(newGrid);
            row.push(newGrid);
        }
        totalGrid.push(row);
    }

     // console.log(totalGrid); //for checking to ensure all grid created
}

//creating the 10 Mines in random
function mineCreate(){
    let mine=0;
    while (mine<10){
        let ranRow = Math.floor(Math.random()*row);
        let ranCol = Math.floor(Math.random()*column);
        let mineId = ranRow.toString() + "-" + ranCol.toString();
        
        //to ensure no duplicate id for the mines
        if(!mineArray.includes(mineId)){ 
            mineArray.push(mineId);
            mine+=1;
        }
        console.log(mineArray); //check mine no duplicate
    }
}

//flag box toggle on/off
function flagSet() {
    if (flagToggle) {
        flagToggle = false;
        document.getElementById("toggle").style.backgroundColor = "pink";
    }
    else {
        flagToggle = true;
        document.getElementById("toggle").style.backgroundColor = "darkgray";
    }
}

//creating clickCheck to check for clicks
function clickCheck() {

    //exit if game is over or tile is already click
    if (gameOver || this.classList.contains("click")) {
        return;
    }

    let newGrid = this;

    //for putting/removing flag
    if (flagToggle) {
        if (newGrid.innerText == "") {
            newGrid.innerText = "🚩";
        }
        else if (newGrid.innerText == "🚩") {
            newGrid.innerText = "";
        }
        return;
    }

    //check mine
    if (mineArray.includes(newGrid.id)) {
        //added this feature to remove bug where flag mark still can open box
        if (newGrid.innerText == "🚩"){
            return;
        }

        else{
        alert("Lose");
        lose();
        gameOver=true;
        return;
        }
    }

    //if grid click has no bomb/flag, it will open the grid
    let xy = newGrid.id.split("-");
    let r = parseInt(xy[0]);
    let c = parseInt(xy[1]);
    checkMine(r, c);
}


//if click bomb will reveal bomb location  
function lose() {
    for (let a= 0; a < row; a++) {
        for (let b = 0; b < column; b++) {
            let newGrid = totalGrid[a][b];
            if (mineArray.includes(newGrid.id)) {
                newGrid.innerText = "💣";
                newGrid.style.backgroundColor = "yellow";                
            }
        }
    }
}

function checkMine(r, c) {
    //check around selected box

    //check if out boundary will stop
    if (r < 0 || r >= row || c < 0 || c >= column) {
        return;
    }

    //check if box is clicked before
    if (totalGrid[r][c].classList.contains("click")) {
        return;
    }


    //for remaining unclick grid to add class .click, where background turn darkgrey
    totalGrid[r][c].classList.add("click");
    //increase count of tile open
    tileTrack+= 1;

    let mineScanned = 0;

    //surround the grid, there are 8 grid: 3 at left column, 1 top, 1 bottom, 3 right column
    //create function compare to check against mineArray

    //check left column
    mineScanned += compareMine(r-1,c-1);
    mineScanned += compareMine(r,c-1);
    mineScanned += compareMine(r+1,c-1);

    //check top
    mineScanned += compareMine(r-1,c);

    //check bottom
    mineScanned += compareMine(r+1,c);

    //check right column
    mineScanned += compareMine(r-1,c+1);
    mineScanned += compareMine(r,c+1);
    mineScanned += compareMine(r+1,c+1);



    if (mineScanned > 0) {
        totalGrid[r][c].innerText = mineScanned;
        totalGrid[r][c].classList.add("n" + mineScanned.toString());
    }

    //continuously checking for neighbouring grids
    else{
        //check left column
        checkMine(r-1, c-1);
        checkMine(r, c-1);
        checkMine(r+1, c-1);
    
        //check top
        checkMine(r-1, c);
    
        //check bottom
        checkMine(r+1, c);
    
        //check right column
        checkMine(r-1, c+1);
        checkMine(r, c+1);
        checkMine(r+1, c+1);
        }

    if (tileTrack == 81 - 10) {
        alert("Win!");
        gameOver=true; 
    }

}

//check against mineArray
function compareMine(r, c) {
    
    //out of boundary check
    if (r < 0 || r >= row || c < 0 || c >= column) {
        return 0;
    }

    //if mineArray is same, there is bomb
    if (mineArray.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }

    //all other condition, no bomb
    return 0;
}

////////////////////

//functions that run upon window open.
window.onload = function() {
    document.getElementById("toggle").addEventListener("click", flagSet);
    mineCreate();
    createGrid();
}