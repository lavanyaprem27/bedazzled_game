//Handles HTML Elements used for displaying scores/level
export class UI{
    
    //gets any UI HTML elements
    static init(){
        
        //retrieve score and level displays from window
        this.score = document.getElementById("score");
        this.level = document.getElementById("level");
        
        //retrieve scoreBar element from window
        this.scoreBar = document.getElementById("completed");
        
    }
    
    //adds to total score display and updates scorebar
    static updateScore(scoreIncrease, levelCompletionPercentage){
        
        //updates total score with added points
        this.score.innerText = parseInt(score.innerText, 10) + scoreIncrease;
        
        //sets scoreBar CSS style to match the currentScore/targetScore ratio
        this.scoreBar.style.width = `${Math.min(levelCompletionPercentage * 100, 100)}%`; 
        
    }
    
    //increases level
    static updateLevel(specificLevel = 0){
        
        //gets the current level as an int
        let oldLevel = parseInt(this.level.innerText, 10);
        
        //if a specific level is specified, the level will be set to that.
        //otherwise, the level will increase by 1
        if (specificLevel == 0){
            
            this.level.innerText = (oldLevel + 1);
            
        } else {
            
            this.level.innerText = specificLevel;
            
        }
        
    }
    
    //either sets score bar straight to 0% or animates it decreasing over time
    static resetScoreBar(increment = 0){
        
        //gets current width as an int from 0 - 100
        let scoreBarWidth = parseInt(this.scoreBar.style.width, 10)/100;
        
        //if the increment is 0, set the scorebarWidth directly to 0
        if (increment == 0) {
            
            scoreBarWidth = 0;
            
        } else {
            
            //decrease scorebar width by incrementing to animate it, but cap it at 0% width
            scoreBarWidth = Math.max(scoreBarWidth - increment, 0);
        
        }
        
        //updates CSS style of scoreBar
        this.scoreBar.style.width = `${scoreBarWidth*100}%`; 
        return (scoreBarWidth == 0);
        
    }
    
}