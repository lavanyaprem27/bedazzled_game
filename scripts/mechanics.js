/***IMPORT OTHER MODULES***/
import {graphics} from './graphics.js';
import {UI} from './ui.js';
import {grid} from './grid.js';
import {itemGrid} from './items.js';
import {spriteList} from './spriteList.js';
import {matchList} from './matchList.js';

//a class that handles the gameplay logic during a level
export class level{
    
    //initializes parameters
    constructor (gridInstance, itemGridInstance, targetScore){
        
        //stores reference to the global board and items object
        this.board = gridInstance;
        this.itemGrid = itemGridInstance;
        
        //local score and target score for level used to determine when level ends
        this.score = 0;
        this.targetScore = targetScore;
        
        //state machne variable
        this.currentState = "INIT_LEVEL";
        
        //state variables used to indicate whether it is the first time entering a state or objects are moving 
        this.firstTime = true;
        this.isMoving = false;
        
        //lists that store any matches or items that were moved during a turn
        this.matches = [];
        this.movedItems = [];
        
        //counter to count consecutive matches
        this.cascade = 0;
        
    }
    
    //initializes the board and items
     initLevel(storedItems){
         
        //storedItems is an array that contains special items removed at the end of the previous level
        //the items in storedItems will be added once the items are initialized
        this.board.createGrid();
        this.itemGrid.initBoard(storedItems);
        
        //starts level
        this.currentState = "START_LEVEL";
    }
    
    //function that uses state machine to process gameplay turns until the level is over
    updateLogic(){
        
        //state machine for game logic
        switch(this.currentState){
            
            //black screen fades to reveal level
            case "START_LEVEL":
                //screen fades in to reveal new items
                let screenIsRevealed = graphics.setDarkness(0, 0.05);
                
                //once the black overlay is gone, allow user input
                if (screenIsRevealed){
                    
                    this.currentState = "GET_SELECTIONS";
                    
                }
                
            //checks for mouse input and identifies whether two items are selected
            case "GET_SELECTIONS":
                
                //gets mouseInput and selection data from board object
                let chosePairs = this.board.manageSelections();

                //if a selection is made, swap items
                if (chosePairs){
                    
                    this.currentState = "SWAP_ITEMS";
                    this.firstTime = true;
                    
                }
                
                break;
            
            //animates the two selected items to switch places over time
            case "SWAP_ITEMS":
                
                //if this is the first time entering this state, set the target positions for a swap
                if (this.firstTime){
                    
                    this.itemGrid.swapItems(this.board.selections[0].id, this.board.selections[1].id, 3);
                    this.firstTime = false;
                
                //if this is not the first time entering this state, it is most likely working on animating the swapped pieces to move
                } else {
                    
                    //any input is disabled until the animation is done. Then the state machine proceeds on.
                    //this is done by trying to animate the selected items and seeing if both don't move 
                    let bothItemsDoneMoving = true;
                    for (let tile of this.board.selections.reverse()){
                        
                        let linkedItem = this.getLinkedItem(tile);
                        let isDoneMoving = linkedItem.animateMovement();
                        
                        bothItemsDoneMoving = bothItemsDoneMoving && isDoneMoving;
                    }
                    
                    //once both items are done moving, clear the selections and move on
                    if (bothItemsDoneMoving){
                        //movedItems is used to focus match identifying only on any items that moved

                        //if movedItems is empty, add the selections to it and move to IDENTIFY_MATCHES
                        if (this.movedItems.length == 0){
                            
                            this.movedItems = [...this.board.selections];
                            this.currentState = "IDENTIFY_MATCHES";

                        //if movedItems is already full, this means that a swap was reversed. Clear it and go back to GET_SELECTION
                        } else {
                            
                            this.movedItems = [];
                            this.board.clearSelections();
                            this.currentState = "GET_SELECTIONS";
                        
                        }
                        
                        this.firstTime = true;
                    }
                }
                
                break;
                
            //scans items object and finds any matches
            case "IDENTIFY_MATCHES":
                
                this.matches = this.itemGrid.identifyMatches(this.movedItems);
                
                //if any matches are found, remove them
                if (this.matches.length > 0){
                    
                    this.board.clearSelections();
                    this.currentState = "REMOVE_MATCHES";
                
                } 
                
                //if no matches are found and two items are still selected, swap them back
                else if (this.board.selections.length > 0){
                    
                    this.itemGrid.swapItems(this.movedItems[0].id, this.movedItems[1].id, 3);
                    this.firstTime = false;
                    this.currentState = "SWAP_ITEMS";
                    
                    //break to avoid clearing movedItems
                    break;
                    
                } 
                
                //if the target score is met, end round
                else if (this.score >= this.targetScore){
                    
                    this.currentState = "END_ROUND";
                
                }
                
                //if there are no matches and selections, go back to get selections
                else {
                    
                    //clear cascade, since there are no more matches
                    this.cascade = 0;
                    this.currentState = "GET_SELECTIONS";
                
                }

                //clear movedItems since it has served its purpose
                this.movedItems = [];
                break;
            
            //deletes each identified match    
            case "REMOVE_MATCHES":
                
                //stores each individual item to delete in the end
                let itemsToRemove = [];
                
                //process each match to identify appropriate score and items that need to be deleted
                for (let match of this.matches){
                    
                    //for a consecutive match, add 1 to the cascade bonus
                    //get appropriate points for match by referencing matchList
                    this.cascade++;
                    let pointsForMatchType = matchList[match["type"]]["points"];
                    
                    //add to score for this match and update UI
                    let addedPoints = pointsForMatchType * this.cascade;
                    this.score += addedPoints;
                    UI.updateScore(addedPoints, (this.score / this.targetScore));

                    //get all the items that need to be deleted and add to itemsToRemove list
                    for (let item of match["items"]){
                        
                        itemsToRemove.push([...item]);
                        
                    }
                    
                }
                
                //remove all the matched items
                this.itemGrid.removeItems(itemsToRemove);
                
                //after removing matches, add new items to fill in the old ones
                this.currentState = "REPOPULATE_BOARD";
                this.firstTime = true;
                break;
            
            //fills in blank spots by adding in new items
            case "REPOPULATE_BOARD":
                
                //if this is the first time entering this state, add in the missing items
                if (this.firstTime){
                    
                    //runs the populateBoard function from the items object with a fall speed of 4
                    this.itemGrid.populateBoard(true, 4);
                    this.firstTime = false;
                
                //if this is not the first time entering this state, it is most likely working on animating the items falling down.
                //any input is disabled until the animation is done. Then the state machine proceeds on.    
                } else {
                    
                    let allItemsDoneMoving = true;
                    
                    //iterates through all items and checks whether they are done moving. If at least 1 item is moving, allItemsDoneMoving is false
                    columns: 
                    for (let x = 0; x < this.board.gridSize; x++){
                        
                        rows:
                        for (let y = 0; y < this.board.gridSize; y++){
                            
                            //trys to move the currently checked item
                            let fallingItem = this.itemGrid.items[x][y];
                            let isDoneMoving = fallingItem.animateMovement();
                            
                            //sets allItemsDoneMoving to false if current item is moving 
                            allItemsDoneMoving = allItemsDoneMoving && isDoneMoving;
                            
                        }
                        
                    }
                    
                    //once both items are done moving, look for any new matches
                    if (allItemsDoneMoving){
                        
                        this.currentState = "IDENTIFY_MATCHES";
                        this.firstTime = true;
                        
                    }
                    
                }
                
                break;
            
            //UI fades out to indicate the max level is reached
            case "END_ROUND":
                
                //resets scorebar to 0 and fades board out to black over time
                let screenIsBlack = graphics.setDarkness(1, 0.05);
                let scoreBarIsReset = UI.resetScoreBar(0.02);
                
                //once the screen is completely black and the scorebar is reset, clear the board
                if (screenIsBlack && scoreBarIsReset){
                    this.currentState = "RESET_BOARD";
                }
                
                break;
            
            //deletes all current items, identifies any special items (which haven't been implemented yet) that are remaining 
            case "RESET_BOARD":
                
                //array that contains all special items that need to be carried over to next round
                let storedItems = [];
                
                //iterates through each item in grid
                columns: 
                for (let x = 0; x < this.board.gridSize; x++){
                        
                    rows:
                    for (let y = 0; y < this.board.gridSize; y++){
                        
                        //removes current item out of nested array so that it is eventually deleted via js garbage collection    
                        let currentItem = this.itemGrid.items[x].splice(y,1);
                            
                        //stores data on the data of a special item so it can be recreated next level
                        if (currentItem.type == "power" || currentItem.type == "hypercube"){
                            
                            //object only storing color and type of special item
                            specialItemData = {
                                "color": currentItem.color,
                                "type": currentItem.type
                            };
                            
                            //add special item data to storedItems array
                            storedItems.push(structuredClone(specialItemData));
                        
                        }
                        
                    }
                }   
                
                //returns list of stored items to be used by main program when making new level
                //also indicates when level is complete
                return storedItems;
        }
    }
    
    //function that updates the graphics of the level
    draw(){
        //determines which items are clicked/hovered
        this.updateItemStates();
        
        //draws background grid
        this.board.drawGrid();
        
        //draws individual items
        this.itemGrid.drawItems();
        
        //draws dark overlay for fade in/outs
        graphics.setDarkness();
        
    }
    
    //simple function that gets the item that's at the coordinate of a particular tile
    getLinkedItem(tile){
        return this.itemGrid.items[tile.id[0]][tile.id[1]];
    }
    
    //check each item and sets their state to match whether it is idle, being hovered, or selected
    updateItemStates(){
        
        columns: 
        for (let x = 0; x < this.board.gridSize; x++){
            
            rows:
            for (let y = 0; y < this.board.gridSize; y++){
                
                //if there is no item at the index, skip to avoid errors
                if(this.itemGrid.items[x][y] == undefined){
                    continue;
                }
                
                //default state is idle
                this.itemGrid.items[x][y].state = "idle";
                
                //set state to hover if the corresponding tile is being hovered and the item isn't moving (it won't be aligned with the tile)
                if (this.board.tiles[x][y].hover && !this.itemGrid.items[x][y].isMoving()){
                    
                    this.itemGrid.items[x][y].state = "hover";
                
                }
                
                //set state to selected if it is stored in the selected array of the board object
                if (this.board.tiles[x][y].selected){
                    
                    this.itemGrid.items[x][y].state = "selected";
                    
                }
                
            }
            
        }
        
    }
    
}