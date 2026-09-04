/***IMPORT OTHER MODULES***/
import {graphics} from './graphics.js';
import {UI} from './ui.js';
import {grid} from './grid.js';
import {itemGrid} from './items.js';
import {spriteList} from './spriteList.js';
import {level} from './mechanics.js';

/***MAIN OBJECTS***/
let board;
let items;
let currentLevel = 1;
let currentRound;

//runs first once content is all loaded
window.addEventListener("DOMContentLoaded", function() {
    
    //first inits program then starts the drawing loop
    init();
    draw();
    
});

//sets up program
function init(){
    
    //initializes graphics and UI
    graphics.init();
    UI.init();
    
    //creates global objects for board and items
    board = new grid();
    items = new itemGrid();
    
    //creates first level
    createNextLevel();

}

//calculates logic and immediately updates graphics
function draw(){
   
    //clear frame
    graphics.clearFrame();

    //update logic
    let levelLogic = currentRound.updateLogic()
    
    //levelLogic will return undefined while the level is still running and return a list of remaining power items once it is done
    if (levelLogic == undefined){
        
        //if the level is continuing, draw the screen
        currentRound.draw();
    
    //if a new level is starting, update level requirements and set up a new board
    } else {
        
        //increase level variable by 1
        currentLevel++;
        
        //make UI display new level
        UI.updateLevel();
        
        //create new level using stored items from previous level
        createNextLevel(levelLogic);
        
    }
    
    //call function again using requestAnimationFrame
    requestAnimationFrame(draw);
    
}

//makes a new level with a higher targetScore
function createNextLevel(storedItems){
    
    //this is the bejeweled 2 formula for finding the points needed to clear a particular level.
    //level 1 is 5000 points, every succeeding level needs 1500 more points than the one before
    let nextLevelPoints = 5000 + (currentLevel-1) * 1500;
    
    //sets currentRound to a new level object, old one is deleted via garbage collection
    currentRound = new level(board, items, nextLevelPoints);
    currentRound.initLevel(storedItems);
    
}