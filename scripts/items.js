/***IMPORT OTHER MODULES***/
import {graphics} from './graphics.js';
import {spriteList} from './spriteList.js';
import {matchList} from './matchList.js';

//class built around an array that handles item instances
export class itemGrid{
    
    constructor (size = 8){
        
        //nested array that will store all item instances
        //individual instances referenced as this.items[x][y]
        //x from 0-7 goes left to right
        //y from 0-7 goes bottom to top
        this.items = [];
        
        //# of rows and columns in the itemGrid
        this.itemGridSize = size;
        
        //max size each image can take up (equal to the size of the board's tiles)
        this.itemTileSize = graphics.canvas.width / this.itemGridSize;
        
        //current set (themed sprites)
        this.currentSet = "test set";
        
        //stores items that can be swapped to make matches in order to give hints (not implemented yet)
        this.possibleMatches = [];
        
    }
    
   //creates a starting setup of items, accepts a array full of stored items as parameter
    initBoard(storedItems = []){
        
        //clears possible matches, since the items will be different anyway
        this.possibleMatches = [];
        
        //fills the grid with random items
        this.createItems();
        
        //check for any matches already made
        let automaticMatches = this.identifyMatches();

        //keep on removing matches and filling in the board until the board doesn't have any automatic matches but has possible matches
        while (automaticMatches.length > 0){
            
            //put all items that need to be removed in a list
            let itemsToRemove = []
            
            //iterates through all of the matches to find items that need to be deleted
            for (let match of automaticMatches){
                
                for (let item of match["items"]){
                    
                    itemsToRemove.push([...item]);
                    
                }
                
            }
            
            //remove items in itemsToRemove
            this.removeItems(itemsToRemove);
            
            //add new items to the board to fill empty spaces
            this.populateBoard();
            
            //checks once more if any matches have already been made
            automaticMatches = this.identifyMatches();
            
        }
        
        //if an array of stored items is inputted, this will iterate through the array and insert them in appropriately
        if (storedItems.length !== 0){
            
            itemArray.forEach((storedItem) => {
                
                item.insertItem(storedItem);
                
            });
            
        }
        
        //last check for possible matches and updates possible hints (hints not implemented yet)
        this.hasMatches();
        
    }
    
    //creates a randomized grid of items
    createItems(){
        
        //generates a nested array that stores each column of the grid as an array
        columns: 
        for (let x = 0; x < this.itemGridSize; x++){
            
            this.items[x] = [];
            
            //adds items to each column
            rows:
            for (let y = 0; y < this.itemGridSize; y++){
                
                //creates an item with a random color
                let newItem = this.generateRandomItem();
                
                //sets the position so that it is directly above its corresponding board tile
                newItem.setPosition([(x + 0.5) * this.itemTileSize, ((this.itemGridSize - y) - 0.5) * this.itemTileSize]);
                
                //pushes to array
                this.items[x][y] = newItem;
                
            }
            
        }
        
    }
    
    //draws every item
    drawItems(){
        
        //iterates through every column array in this.items
        columns:
        for (let x = 0; x < this.items.length; x++){
            
            //iterates through every item in the column array
            rows:
            for (let y = 0; y < this.items[x].length; y++){
                
                //invokes the draw function on the item
                this.items[x][y].drawItem()
                
            }
            
        }
        
    }
    
    //generates and returns a random item color
    generateRandomItemColor(){
        
        //random color is chosen by selecting a random index of the array of colors
        let colorNames = ["red", "orange", "yellow", "green", "blue", "purple", "white"];
        let randColorID = Math.floor(Math.random()* 7);
        let randColor = colorNames[randColorID];
        
        return randColor;
    }
    
    //creates an item with a random color and returns it
    generateRandomItem(){
        
        //default settings is that the items are 0.9 the size of the board tile and are spawned in as normal type
        let newItem = new item (this.generateRandomItemColor(), "normal", this.itemTileSize, 0.9, this.currentSet);
        
        return newItem;
    }
    
    //inserts a stored special item by making a random normal item of the same color switch to its item type (power or hypercube)
    //currently unused, since power items haven't been added yet
    insertItem(storedItem){
        
        //list that stores all valid items for swapping
        let replaceableItems = [];
        
        //loops through every column
        columns: 
        for (let x = 0; x < this.itemGridSize; x++){
            
            //stores all valid items in a row
            let validItemsInRow = []
            
            //if the insertable item has no color (it is a Hypercube), it can be swapped with any regular piece
            if (storedItem.color == "none") {
                
                //filters items in column by whether it is of the normal type
                validItemsInRow = this.items[x].filter(item => item.type == "normal"); 
                            
            //if the insertable item is power type, it can be swapped with normal items with the same color
            } else {
                
                //filters items in column by whether it is of normal type and matches color of power item
                validItemsInRow = this.items[x].filter(item => item.type == "normal" && item.color == storedItem.color); 
            
            }
            
            //adds each item that can be swapped in the row to the replaceableItems list
            validItemsInRow.forEach((arrayItem) => {
                
                replaceableItems.push(arrayItem);
                
            });
        }
        
        //chooses a random index from replaceableItems to select a random item to swap
        let indexToReplace = Math.floor(Math.random() * replaceableItems.length);
        
        //changes color and type of the random item to match that of the power item
        replaceableItems[indexToReplace].color = storedItem.color;
        replaceableItems[indexToReplace].type = storedItem.type;
        
    }
    
    //swaps the positions of two items within the nested array and animates them to physically make the swap
    swapItems(id1, id2, moveSpeed = 1){
        
        //stores current pixel positions of each items
        let item1pos = {...this.items[id1[0]][id1[1]].currentPosition};
        let item2pos = {...this.items[id2[0]][id2[1]].currentPosition};
        
        //swap items place in nested array
        [this.items[id1[0]][id1[1]],this.items[id2[0]][id2[1]]] = [this.items[id2[0]][id2[1]],this.items[id1[0]][id1[1]]];
        
        //set targetPosition to indicate where they need to move after swapping
        this.items[id1[0]][id1[1]].setTargetPosition([item1pos["x"],item1pos["y"]],moveSpeed);
        this.items[id2[0]][id2[1]].setTargetPosition([item2pos["x"],item2pos["y"]], moveSpeed);
    
    }
    
    //returns how many items surrounding a central item match a certain color.
    getConnectingItems(centralItemID, method = "axis", {colorToCheck = this.items[centralItemID[0]][centralItemID[1]].color, directionObjectCount = 2 } = {}){
        
        //array used to check items to the right, above, to the left, and below the central item
        const directions = [[0,1], [1,0], [0,-1],[-1,0]];
        
        /*two methods are included: "axis" and "floodfill"
        
        "axis" checks to see how many connecting objects of a particular color are in each direction
            the "colorToCheck" parameter is optional for this method to check for surrounding items of a different color
            the "directionObjectCount" parameter is optional to specify a specific number of adjacent items to check for
            
            results are returned in an array going [rightItems,upItems,leftItems,downItems]
        
        "floodfill" tracks all adjacent objects of the same color as the centralItem
            the results are returned in an array, with the central item being at index 0 (first item)
        */
        
        //axis method
        if (method == "axis"){
            
            //array that stores the number of connecting items that are the same color in all 4 directions
            let surroundingColorCount = [];
            
            //checks in each of the 4 directions around the central item
            directionalCheck:
            for (let direction of directions){
                
                //stores reference index of central item
                let currentIndex = [centralItemID[0], centralItemID[1]];
                
                //tracks how many connecting same-colored items are in a direction
                let localColorCount = 0;
                
                //checks up to directionObjectCount(number var) items in a particular direction 
                directionOffsetCheck:
                for(let i = 0; i < directionObjectCount; i++){
                    
                    //changes current index to look at a new item in the specified direction
                    currentIndex[0] += direction[0];
                    currentIndex[1] += direction[1];
                    
                    //break if no next item exists due to it being out of bounds of the array
                    if (!(currentIndex[0] >=0 && currentIndex[0] < this.itemGridSize && currentIndex[1] >=0 && currentIndex[1] < this.itemGridSize)){
                        
                        break directionOffsetCheck;
                        
                    }
                    
                    //Increment localColorCount if the next item in line is the same color, otherwise stop checking this direction
                    if ([this.items[currentIndex[0]][currentIndex[1]].color] == colorToCheck){
                        
                        localColorCount++
                        
                    } else {
                        
                        break directionOffsetCheck;
                        
                    }
                    
                }
                
                //push localColorCount to surroundingColorCount list 
                //surroundingColorCount = [rightItems,upItems,leftItems,downItems]
                surroundingColorCount.push(localColorCount);
                
            }
            
            //return an array with only 4 integer values indicating how many connecting items of the same color were in each direction
            return surroundingColorCount;

        } else if (method == "floodfill"){
            
            /*this uses a breadth-based floodfill
            this means that items are added to a queue if they are connecting
            items in the queue are each looked at the items in each of the four connecting directions
            items that are the same color are also added to the queue
            
            the function stops once the queue is empty
            this means that all connecting items are selected
            */
            
            //stores a group of connecting items of centralItem's color.
            let cluster = [centralItemID];
            
            //list of items that need to be checked for connecting items of the same color
            let queue = [centralItemID];
            
            //loops until there are no more items to check, which happens when there are no more connecting items of the same color
            while (queue.length > 0){
                
                //removes the first item in the queue and analyzes it
                let currentItem = queue.shift();

                //checks items in each direction of  currentItem
                directionalCheck:
                for (let direction of directions){
                    
                    //stores ID of item in the direction that is looked at
                    let checkedItem = [currentItem[0] + direction[0], currentItem[1] + direction[1]];
                    
                    //moves on to next direction if there is no item in this direction (due to going out of bounds of nested array)
                    if (!(checkedItem[0] >=0 && checkedItem[0] < this.itemGridSize && checkedItem[1] >=0 && checkedItem[1] < this.itemGridSize)){
                        
                        continue directionalCheck;
                        
                    }
                    
                    //checks whether the checkedItem was already added into the cluster array
                    //because of annoying array comparisons, the ids need to be turned to strings to see if it is included
                    let containsItem = JSON.stringify(cluster).includes(JSON.stringify(checkedItem));
                    
                    //if checked item has centralItem's color but isn't already in the cluster, add it to the cluster and the queue
                    if (this.items[checkedItem[0]][checkedItem[1]].color == colorToCheck && !containsItem){
                        
                        cluster.push([...checkedItem]);
                        queue.push([...checkedItem]);
                        
                    }
                    
                }
        
            }
            
            //returns an array containing all the connecting items of centralItem's color
            return cluster;
            
        }
    
    }
    
    //fills empty spots in the board with new items and can animate them falling into their new positions
    populateBoard(animate = false, moveSpeed = 1){
        
        //variable that stores how high the items need to be dropped from in order to fall in from offscreen
        let dropOffset;

        //stores any items added in newly to check whether they automatically form matches
        let newItems = []
        
        //iterates through columns
        columns: 
        for (let x = 0; x < this.itemGridSize; x++){
            
            //sets drop offset so that the bottommost item of the items that are spawned into a particular will spawn exactly out of bounds 
            dropOffset = (this.itemGridSize - this.items[x].length) * this.itemTileSize;
            
            //iterates through rows
            rows:
            for (let y = 0; y < this.itemGridSize; y++){
                
                //checks whether an index doesn't exist currently (it has no item)
                if (!(y < this.items[x].length)){
                    
                    //creates a new item
                    let newItem = this.generateRandomItem();
                    
                    //sets it to spawn out of bounds in the y direction but in the proper x direction
                    newItem.setPosition([(x + 0.5) * this.itemTileSize, (((this.itemGridSize - y) - 0.5) * this.itemTileSize) - dropOffset]);
                    
                    //add new item into items array and store index coordinates into newItems array to be checked later
                    this.items[x][y] = newItem;
                    newItems.push([x,y]);
                    
                }
                
                //if animation is allowed, the targetPositions of the items will be set so that they fall into place
                if (animate){
                    
                    //if animate is allowed, the targetPositions of the items will be set so that they fall into place
                    this.items[x][y].setTargetPosition([(x + 0.5) * this.itemTileSize, (((this.itemGridSize - y) - 0.5) * this.itemTileSize)], moveSpeed);
                
                //the items' positions will be overriden to spawn directly into place   
                } else {
                    
                    this.items[x][y].setPosition([(x + 0.5) * this.itemTileSize, (((this.itemGridSize - y) - 0.5) * this.itemTileSize)]);
                }
                
            }
            
        }
        
        //checks whether there are possible matches in this setup (endless mode in Bejeweled 2, which is what this game is modeled after, always has available moves)
        this.hasMatches();
        
        //until there is a possible match, keep on randomizing the colors of the newly added items to brute force a possible match
        while (this.possibleMatches.length == 0){
            
            //iterates through all the index coordinates where a new item was added
            for (let index of newItems){
                
                //changes the color of the item to a new random one
                this.items[index[0]][index[1]].color = this.generateRandomItemColor();
            
            }
            
            //checks again for possible matches
            this.hasMatches();
            
        }
        
    }
    
    //checks to see if any items could be swapped to make a match, and stores these in an array for hints (hints not implemented yet)
    hasMatches(){
        
        //array used to check items to the right, above, to the left, and below the central item
        const directions = [[0,1], [1,0], [0,-1],[-1,0]];
        
        //clears possible matches to be safe
        this.possibleMatches = [];

        //iterates through columns
        columns: 
        for (let x = 0; x < this.itemGridSize; x++){
            
            //iterates through rows
            rows:
            for (let y = 0; y < this.itemGridSize; y++){
                
                //stores all the colors of the items surrounding the central item at [x,y]
                let surroundingColors = [];
                
                //checks each 4 directions around central item
                surroundingDirectionCheck:
                for (let direction of directions){
                    
                    //looks at the adjacent item in the connecting direction
                    let currentIndex = [x + direction[0], y + direction[1]];
                    
                    //does nothing if currentIndex is out of bounds of the nested array and doesn't exist
                    if (currentIndex[0] >=0 && currentIndex[0] < this.itemGridSize && currentIndex[1] >=0 && currentIndex[1] < this.itemGridSize){
                        
                        //gets color of adjacent item
                        let currentColor = this.items[currentIndex[0]][currentIndex[1]].color;
                        
                        //adds color to surroundingColors if it isn't already there
                        if (!surroundingColors.includes(currentColor)){
                            
                            surroundingColors.push(currentColor);
                            
                        }
                        
                    }
                    
                }
                
                //check for matches for each color in surroundingColors
                checkPerColor:
                for (let color of surroundingColors){
                    
                    //get the number of adjacent connecting items on each axis
                    let surroundingColorCount = this.getConnectingItems([x,y], "axis", {colorToCheck: color});
                    
                    //indicates how many connecting items are up and down vs left and right
                    let horizontalAxis = surroundingColorCount[0] + surroundingColorCount[2];
                    let verticalAxis = surroundingColorCount[1] + surroundingColorCount[3];
                    
                    //checks whether the connecting items could form a possible 3-pair
                    //angled config: 1 item has to be moved perpendicularly to be in line with the others
                    //straight config: all the items are already in line, but one needs to be moved to form a set of 3
                    let angledConfig = ((horizontalAxis >= 2) && (verticalAxis >= 1)) || ((verticalAxis >= 2) && (horizontalAxis >= 1));
                    let straightConfig = ((horizontalAxis >= 3) && (verticalAxis >= 0)) || ((verticalAxis >= 3) && (horizontalAxis >= 0));
                    
                    //if a match of 3 can't be formed out of the identified connecting items, move onto checking the next color
                    if (!angledConfig && !straightConfig){
                        
                        continue checkPerColor;
                        
                    }
                    
                    //next steps eliminates surrounding items via process of elimination to find the one that needs to be swapped to make the best match

                    //set the values of the directions on the axis with more items to 0 to eliminate them from consideration
                    if (horizontalAxis > verticalAxis && verticalAxis !== 0){
                        
                        surroundingColorCount[0] = 0;
                        surroundingColorCount[2] = 0;
                        
                    } else if (verticalAxis > horizontalAxis && horizontalAxis !== 0){
                        
                        surroundingColorCount[1] = 0;
                        surroundingColorCount[3] = 0;
                        
                    }
                    
                    //stores the indexes the directions with largest connecting item count from the remaining non-zero ones
                    let largestNumbers = [0];
                    
                    //iterates through each of the directions in surroundingColorCount
                    for (let i = 1; i < surroundingColorCount.length; i++){
                        
                        //if the currently checked direction has the same number of connecting items as the one currently deemed the max, add it's index to largestNumbers
                        if (surroundingColorCount[i] == surroundingColorCount[largestNumbers[0]]){
                            
                            largestNumbers.push(i);
                            
                        //if the currently checked direction has more connecting items than the one currently deemed the max, replace largestNumbers with its index
                        } else if (surroundingColorCount[i] > surroundingColorCount[largestNumbers[0]]){
                            
                            largestNumbers = [i];
                            
                        }
                        
                    }
                    
                    //if there is still a direction with a non-zero connecting item count that is less than the max, eliminate the directions with the max count
                    if (largestNumbers.length !== surroundingColorCount.filter(num => num !== 0).length){
                        
                        //iterate through each of the directions with the largest connecting item counts and set them to 0 to eliminate them from consideration
                        largestNumbers.forEach((i) => {
                            
                            surroundingColorCount[i] = 0;
                            
                        });
                        
                    }

                    //any remaining directions are valid swaps. Choose a random one to identify which adjacent item needs to be swapped
                    
                    //generates a random index of surroundingColorCount until an index that corresponds with a direction that hasn't been eliminated has been found
                    let swappableItemIndex;
                    while (swappableItemIndex == undefined || surroundingColorCount[swappableItemIndex] == 0){
                       
                        swappableItemIndex = Math.floor(Math.random() * surroundingColorCount.length);
                    
                    }
                    
                    //use swappableItemIndex to find actual item ID by corresponding index to directions array
                    let possibleMatch = [x + directions[swappableItemIndex][0], y + directions[swappableItemIndex][1]];
                    
                    //push the identified item to the possibleMatches array so that it can be used later for hints (not implemented yet)
                    this.possibleMatches.push(possibleMatch);
                
                }
                
            }
            
        }
        
    }
    
    //identifies all matches made at a given moment. Can limit this search to start with item indexes specified in the itemsToCheck array
    identifyMatches(itemsToCheck = []){
        
        //stores current clusters of similarly colored items
        let clusters = [];
        
        //stores all the matches identified
        let matches = [];
        
        //pecking order that shows matches that produce higher-powered items are prioritized
        //(this doesn't matter too much now since power items aren't implemented yet)
        let matchPriority = ["hypercube", "power", "normal"];
        
        //array used to check items to the right, above, to the left, and below the central item
        const directions = [[0,1], [1,0], [0,-1],[-1,0]];
        
        //find all clusters of items that are 3+ in size
        
        //iterate through columns
        columns: 
        for (let x = 0; x < this.itemGridSize; x++){
            
            //iterate through rows
            rows:
            for (let y = 0; y < this.itemGridSize; y++){
                
                //boolean that tells whether the item at x,y is in the itemsToCheck list if one has been included
                let needToCheck = itemsToCheck.length == 0 || JSON.stringify(itemsToCheck).includes(JSON.stringify([x,y]));
                
                //boolean that checks whether the item at x,y is already in a cluster
                let alreadyFound = JSON.stringify(clusters).includes(JSON.stringify([x,y]));
                
                //if the item doesn't need to be checked or is already found, move onto the next one
                if (!needToCheck || alreadyFound){
                    continue;
                }
                
                //run a floodfill on the item to get connecting items
                let newCluster = this.getConnectingItems([x,y], "floodfill");
                
                //add the identified cluster to the clusters list only if it is 3+ items large
                if (newCluster.length > 2){
                
                    clusters.push(newCluster); 
                   
                }
                
            }
            
        }
        
        //after identifying all the clusters, check to see whether they have matches within them
        checkEachCluster:
        for (let cluster of clusters){
            
            //this stores the highest value match found for a particular cluster
            let highestMatch;
            
            //each item in the cluster is checked to see if it's the center item of a match
            checkEachItem:
            for (let currentItem of cluster){
                
                //gets how many items are surrounding to check against possible match configurations
                let connectingItems = this.getConnectingItems(currentItem, "axis");
                
                //stores information about the best match found around the currentItem
                let foundMatch = {
                    "type": "",
                    "items": []
                }
                
                //checks each possible match shape in matchList (from highest value to lowest)
                searchMatchTypes:
                for (const [matchType, matchData] of Object.entries(matchList).reverse()){
                    
                    //access the structure and make a clone
                    //structure tells how many connecting items in each direction are needed to make a shape
                    let matchStructure = [...matchData["structure"]];
        
                
                    //rotate the structure a few times to see whether it is within the cluster
                    reorderStructure:
                    for (let order = 0; order < matchStructure.length; order++){
                        
                        //stores items corresponding to a shape. Starts with the current item
                        let identifiedItems = [[...currentItem]];
                        
                        //compare each number in matchStructure to the getConnectingItems output 
                        compareStructures:
                        for (let index = 0; index < matchStructure.length; index++){
                            
                            //check if getConnectingItems number is >= matchStructure. If so, it is possible that the match shape could fit within the cluster
                            if (connectingItems[index] >= matchStructure[index]){
                               
                                //adds each items associated with the match structure in this direction to identifiedItems
                                for (let itemCount = 0; itemCount < matchStructure[index]; itemCount++){
                                    
                                    let connectingItemID = [currentItem[0] + directions[index][0] * (itemCount+1), currentItem[1] + directions[index][1] * (itemCount+1)];
                                    identifiedItems.push([...connectingItemID]);
                                    
                                }
                            
                            //if the number of items in this direction is smaller than what is needed by the match structure, the match shape can't fit
                            } else {
                                
                                //move the first item in matchStructure to the end to "rotate" the shape and check another configuration
                                let firstItem = matchStructure.shift();
                                matchStructure.push(firstItem);
                                
                                //restart process for new rotation
                                continue reorderStructure;
                            }
                        }
                        
                        //once a match has been confirmed:
                        //add the name of the match type to foundStructure
                        //set the items array of foundStructure to identifiedItems 
                        foundMatch["type"] = matchType;
                        foundMatch["items"] = identifiedItems;
                        
                        //finish searching for possible match types
                        break searchMatchTypes;
                    }
                }
                
                //if no match was found for this item, move onto the next item
                if (foundMatch["type"] == ""){
                    continue checkEachItem;
                }
                
                //booleans to track whether the current best match or the newly identified match is better
                let betterSpecialItem = true;
                let betterPoints = true;
                
                //after finding best match for that one item, compare its corresponding power item and points to the already identified highest match
                if (highestMatch !== undefined){
                    
                    //checks whether the resulting power item of the found match is better than the one for the highest match
                    betterSpecialItem = matchPriority.indexOf(matchList[foundMatch["type"]]["item"]) < matchPriority.indexOf(matchList[highestMatch["type"]]["item"]);
                    
                    //checks whether the points given by the match type for the found match is better than the current highest match
                    betterPoints = matchList[foundMatch["type"]]["points"] > matchList[highestMatch["type"]]["points"];
                }
                
                //if foundMatch is better, make it the new highestMatch
                if (betterSpecialItem || betterPoints){
                    
                    highestMatch = structuredClone(foundMatch);
                    
                }
                
            }
            
            //after checking all possible matches, add the highestMatch for the cluster into the matches array
            if (highestMatch !== undefined && highestMatch["type"] !== ""){
                
                matches.push(structuredClone(highestMatch));
                
            }
            
        }
        
        //return the array of matches
        return matches;
        
    }
    
    //deletes all specified items from the items array. The indexes of particular items have to be specified in itemsToRemove
    removeItems(itemsToRemove = []){
        
        //if no particular items have been specified to be removed, exit this function
        if (itemsToRemove.length == 0){
            
            return;
            
        }
        
        //removes each item in itemsToRemove by setting its corresponding index in the items array "" to preserve order of grid while searching the items array for items to remove. Item is deleted via js garbage collection.
        for (let item of itemsToRemove){
            
            this.items[item[0]][item[1]] = "";
            
        }
        
        //iterates through each column of items 
        columns: 
        for (let x = 0; x < this.items.length; x++){
            
            let index;
            
            //until the column has no values of "", any occurances of "" are individually identified and removed
            checkEachRow:
            while ((index = this.items[x].indexOf("")) !== -1) {
                
                this.items[x].splice(index, 1);
                
            }
            
        }
        
    }
    
}

//class that represents one item on the board
class item{
    constructor(color, type, tileSize, relativeSize = 1, setName = "test set"){
        
        //item type data
        this.color = color;
        this.type = type;
        this.state = "idle";
        
        //sets sprite size relative to the size of a board tile
        this.tileSize = tileSize
        this.size = tileSize * relativeSize;
        
        //name of the set from which the sprite is from
        this.set = setName;
        
        //coordinate values expressed as [x,y] that handle animation of the item's position
        this.currentPosition;
        this.targetPosition;
        
        //speed of any position/sprite animations (sprite animations not implemented yet)
        this.animateSpeed = 0;
        this.moveSpeed = 0;
        
    }
    
    //directly sets the position of the item and clears any animation
    setPosition(centerPos){
        //currentPosition is set to the centerPos parameter
        this.currentPosition = {
            
            "x": centerPos[0],
            "y": centerPos[1]
            
        }
        
        //targetPosition is also set to centerpos parameter with a 0 moveSpeed to prevent animation
        this.setTargetPosition (centerPos, 0);
    }
    
    //sets a position to which the item must move over time and gives it an animation speed
    setTargetPosition(centerPos, moveSpeed = 0){
        
        //sets animation target position to centerPos
        this.targetPosition = {
            
            "x": centerPos[0],
            "y": centerPos[1]
            
        }
        
        //sets moving animation Speed to moveSpeed parameter
        this.moveSpeed = moveSpeed;
    }
    
    //immediately moves the item to its targetPosition without animating it over time
    snapToTargetPosition(){
        
        this.currentPosition = {...this.targetPosition};
        
    }

    //moves the item towards the target postition over time
    animateMovement(addGravity = true){
        
        //change currentPosition by movespeed if it already isn't at roughly the target position
        //this is determined by whether the difference between the target and current position is greater or equal to moveSpeed
        let xOffset = this.targetPosition["x"] - this.currentPosition["x"];
        let yOffset = this.targetPosition["y"] - this.currentPosition["y"];
        
        //if the object is close enough to targetPosition, cancel animation by setting moveSpeed to 0
        if (Math.abs(xOffset) < this.moveSpeed && Math.abs(yOffset) < this.moveSpeed){
            
            this.snapToTargetPosition();
            this.moveSpeed = 0;
            
        }
        
        //if the movespeed is 0, either by already being done moving or finishing moving in this iteration, return true
        if (this.moveSpeed == 0){
            
            return true;
        
        }
        
        //change the current position to move closer to targetPosition
        
        //if specified, add a simulated grivational acceleration when the object is moving vertically
        if (addGravity && xOffset == 0 && yOffset !== 0){
            let gravity = 1.015;
            this.moveSpeed *= gravity;
        }
        
        //move horizontally by moveSpeed if it helps the item get closer to targetPosition
        if (Math.abs(xOffset) >= this.moveSpeed){
            
            //move in appropriate direction
            if (xOffset > 0){
                
                this.currentPosition["x"] += this.moveSpeed;
                
            } else {
                
                this.currentPosition["x"] -= this.moveSpeed;
                
            }
            
        }
        
        //move vertically by moveSpeed if it helps the item get closer to targetPosition
        if (Math.abs(yOffset) >= this.moveSpeed){
            
            //move in appropriate direction
            if (yOffset > 0){
                
                this.currentPosition["y"] += this.moveSpeed;
                
            } else {
                
                this.currentPosition["y"] -= this.moveSpeed;
                
            }
            
        }
        
        //return false to indicate it is still moving
        return false;
        
    }
    
    //boolean value that just tells whether the spritesheet is set to be changing
    //doesn't work yet since spritesheet animations haven't been implemented yet
    isAnimating(){
        
        return this.animateSpeed !== 0;
        
    }
    
    //boolean value that just tells whether the object is set to be moving
    isMoving(){
        
        return this.moveSpeed !== 0;
        
    }
    
    //renders the item
    drawItem(){
        
        //draw selection border when the item is selected
        if (this.state == "selected"){
            
            graphics.drawRect(this.tileSize, this.tileSize, this.currentPosition["x"], this.currentPosition["y"], "transparent", "white", 5);
        
        }
        
        //get the corresponding sprite from spriteList and draw it
        let sprite = spriteList[this.set][this.color][this.type][this.state].retrieve();
        graphics.drawImage(sprite, this.currentPosition["x"], this.currentPosition["y"], this.size, this.size);
    
    }
    
    //returns a clone of the current item without any positional or animation data
    returnItem(){
        
        let clone = new item(this.color, this.type, this.tileSize, this.relativeSize);
        return clone;
        
    }

}