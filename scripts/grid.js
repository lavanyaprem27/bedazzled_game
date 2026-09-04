/***IMPORT OTHER MODULES***/
import {graphics} from './graphics.js';

//class that draws the background checkerboard and handles selections 
export class grid{
    
    constructor (size = 8){
        
        //nested array of individual tiles which can be referenced via this.tiles[x][y]
        //x from 0-7 goes left to right
        //y from 0-7 goes bottom to top
        this.tiles = [];
        
        //# rows and columns
        this.gridSize = size;
        
        //IDs of tiles which are currently selected
        this.selections = []
    }
    
    //initializes the grid by creating the individual tiles
    createGrid(){
        
        //determines the pixel width/height of the tiles based on gridSize
        let tileSize = graphics.canvas.width / this.gridSize;
        
        //creates a nested array corresponding to the number of columns (gridSize)
        columns:
        for (let x = 0; x < this.gridSize; x++){
            
            //creates a new array for a particular column
            this.tiles[x] = [];
            
            //creates tiles within each column
            rows: 
            for (let y = 0; y < this.gridSize; y++){
                
                //alternates tile style between dark and light for a checkerboard appearance
                let tileStyle = (x % 2 == y % 2) ? "dark" : "light";
                
                //adds new tile to the tiles array
                this.tiles[x][y] = new tile ([x,y], tileSize, this.gridSize, tileStyle);
            
            }
            
        }
        
    }
    
    //draws each of the individual tiles
    drawGrid(){
        
        //iterates through columns
        columns:
        for (let col of this.tiles){
            
            //iterates through rows
            rows:
            for (let square of col){
                
                //draws individual tile
                square.drawTile();
                
            }
            
        }
        
    }
    
    //handles hover and selection of tiles
    manageSelections(){
        
        //stores newly selected square
        let newSelection;
        
        //iterate through columns
        columns:
        for (let col of this.tiles){
            
            //iterate through rows
            rows:
            for (let square of col){
                
                //check if a tile is being hovered over and set the tile's state appropriately
                //if the tile is being hovered over and clicked on, select the tile
                if (square.checkHover() && graphics.mouseClick !== undefined){
                    
                    newSelection = square;
                    
                }
                
            }
            
        }
        
        //if there are no selections found, exit this function
        if (newSelection == undefined){
            
            return;
            
        }

        //if the tile currently selected is clicked again, deselect it
        if (newSelection == this.selections[0]){
            
            this.clearSelections();
        
        //allow selecting new tiles or tiles adjacent to those already selected
        } else if
        (this.selections.length != 1 || (Math.abs(newSelection.id[0] - this.selections[0].id[0]) + Math.abs(newSelection.id[1] - this.selections[0].id[1])) == 1){
            
            newSelection.selected = true;
            this.selections.push(newSelection);
            
        }
        
        //clear click event to prevent unneccessary updates
        graphics.mouseClick = undefined;
        
        //return true if there are two selections
        return this.selections.length == 2;
        
    }
    
    //removes selections from selections array and changes the individual tiles' status back to normal
    clearSelections(){
        
        //iterate through selections
        for (var oldSelection of this.selections){
            
            //set current selection to unselected
            oldSelection.selected = false;
            
        }
        
        //clear selection list
        this.selections = [];
        
    }
    
}

//class that holds an individual instance of a grid tile
class tile{
    
    constructor(id, size, gridSize, style){
        
        //index coordinates within the this.tiles array of a grid object
        this.id = id;
        
        //width/height of tile in pixels
        this.size = size;
        
        //#rows and columns in the parent grid object
        this.gridSize = gridSize;
        
        //color style of the tile (light vs dark)
        this.style = style;
        
        //bounding box used to detect mouse interaction
        this.boundingBox = graphics.createBoundingBox(this.size, this.size, (this.id[0]+0.5) * this.size, (this.gridSize - this.id[1] - 0.5) * this.size);
        
        //states for when the mouse is hovering or clicking on the tile
        this.hover = false;
        this.selected = false;
        
    }
    
    //renders the tile
    drawTile(){
        
        //sets fill color based on tile style
        let color = (this.style == "dark") ? "#3B6064": "#364958";
        
        //desaturates and brightens tile if it is being hovered over
        graphics.ctx.filter = (this.hover) ? 'brightness(150%) grayscale(50%)' : 'none';
        
        //draws tile
        graphics.drawRect(this.size, this.size, (this.id[0]+0.5) * this.size, (this.gridSize - this.id[1] - 0.5)*this.size, color);
        
        //clears graphics filter for subsequent drawings
        graphics.ctx.filter = 'none';
        
    }
    
    //checks whether the mouse is hovering over the tile and returns it as a boolean
    checkHover(){
        
        //if boundingBox exists and there is mouse movement, check if mouse is within tile boundary
        if (this.boundingBox !== undefined && graphics.mouseMove !== undefined){
            
            //gives information on how the canvas's pixels relate to the screen's pixels
            let scaler = graphics.canvas.getBoundingClientRect();
            
            //gets mouse X and Y positions relative to screen
            let mouseX = (graphics.mouseMove.clientX - scaler.left) * (graphics.canvas.width / scaler.width);
            let mouseY = (graphics.mouseMove.clientY - scaler.top) * (graphics.canvas.height / scaler.height);
            
            //checks whether the mouse is found within the bounding box
            this.hover = graphics.ctx.isPointInPath(this.boundingBox, mouseX, mouseY);
    
        } else {
            
            //set hover status to false
            this.hover = false;
            
        }
        
        return this.hover;
    }
    
}