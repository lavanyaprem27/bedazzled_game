//general class used to simplify canvas drawing
export class graphics {
    
    //initializes canvas and mouse events
    static init(){
        
        //creates canvas and 2d context
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        
        //level of dimming. Max darkness = 1
        this.darkness = 0.0;
        
        //mouse data
        this.mouseMove;
        this.mouseClick;
        
        //add click and mousemove events to canvas to check for hovered tiles or clicks
        this.canvas.addEventListener("mousemove", (event) => {
            
            this.mouseMove = event;
            
        });

        this.canvas.addEventListener("click", (event) => {
            
            this.mouseClick = event;
            
        });
        
    }
    
    //clears anything drawn on canvas
    static clearFrame(){
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
    }
    
    //creates an overlay that will dim the screen either immediately or over time
    static setDarkness(darknessLevel = -1, increment = 0){

        //run only if the darkness level is specified and is different from what the level currently is
        if (this.darkness !== darknessLevel && darknessLevel !== -1){
            
            //if no increment is specified, set the new darkness directly
            if (increment == 0) {
                
                this.darkness = darknessLevel;
                
            } else {
                
                //change darkness level by increment to animate it, but make sure it doesn't overshoot the specified darkness
                if (increment > Math.abs(darknessLevel - this.darkness)){
                    
                    //sets darkness directly since the increment is larger than the difference between the target level and current level
                    this.darkness = darknessLevel;
                    
                } else {
                    
                    //determines whether darkness needs to increase or decrease by increment amount to reach targetValue
                    let opacityChange = (this.darkness < darknessLevel) ? increment : -increment;
                    
                    //increment darkness level
                    this.darkness += opacityChange;
                    
                }
                
            }
            
        } 
        
        //create a rectangle overlay that is transparent based on required darknes, but only if there is some sort of dimming needed
        if (this.darkness !== 0){
            
            //set transparency of overlay
            this.ctx.globalAlpha = this.darkness;
            
            //draw overlay
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            //reset transparency to 100% visible
            this.ctx.globalAlpha = 1;
            
        }
        
        //return whether it is done changing the darkness
        return (this.darkness == darknessLevel);
        
    }
    
    //draws a rectangle at the center of the specified coordinates
    static drawRect(width, height, centerX, centerY, color, strokeColor="transparent", strokeThickness = 2){
        
        //draws rectangle
        this.ctx.fillStyle = color;
        this.ctx.fillRect(centerX - (width/2),centerY - (height/2), width, height);
        
        //draws optional outline
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = strokeThickness;
        this.ctx.strokeRect(centerX - (width/2) + strokeThickness/2 ,centerY - (height/2)  + strokeThickness/2 , width - strokeThickness, height - strokeThickness);

    }
    
    //draws text at the center of the specified coordinates in Tahoma font
    static drawText(text, fontSize, centerX, centerY, color, hAlign = "center"){
        
        //sets text style
        this.ctx.font = fontSize + "px Tahoma";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = hAlign;
        this.ctx.fillStyle = color;
        
        //draws text
        this.ctx.fillText(text,centerX,centerY);
        
    }
    
    //creates a bounding box at the center of the specified coordinates and returns it
    //used to detect mouse movement
    static createBoundingBox (width, height, centerX, centerY){
        
        //creates bounding box
        var boundingBox = new Path2D();
        boundingBox.rect(centerX - (width/2),centerY - (height/2), width, height);
        
        return boundingBox;
        
    }
    
    //draws an image at the center of the specified coordinates with a specified width and height
    static drawImage(picture, centerX, centerY, width, height){
        
        
        //draws image
        if (picture.crop == undefined){
            
            this.ctx.drawImage(picture.sourceImage, centerX - (width/2), centerY - (height/2), width, height); 
        
        //draws image with cropping if the inputted image instance specifies it
        } else {
            
            this.ctx.drawImage(picture.sourceImage, picture.crop["x"], picture.crop["y"], picture.crop["width"], picture.crop["height"], centerX - (width/2), centerY - (height/2), width, height); 

        }
        
    }
    
}

//class that stores information about an image to allow it to be drawn using drawImage
export class image {
    
    constructor (URL){
        
        //image source
        this.sourceImage = new Image();
        this.sourceImage.src = URL;
        
        //cropping dimensions
        this.crop = undefined;
    }
    
    //specifies crop dimensions
    setCrop(x, y, width, height){
        
        //x & y: pixel coordinates of top left corner of crop
        //width & height: pixel width and height of crop
        var parameters = [x, y, width, height];
        
        //check whether all parameters are included
        if (!parameters.includes(undefined)){
            
            //creates an object storing cropping info
            this.crop = {
                
            "x": x,
            "y": y,
            
            "width": width,
            "height": height
            
            }
        
        //if not all the components are specified, the crop is set to undefined   
        } else {
            
            this.crop = undefined;
            
        }
        
    }
    
    //returns a copy of the image instance
    retrieve(){
        
        //creates new image instance with same source
        let clone = new image(this.sourceImage.src);
        
        //adds the same cropping
        clone.crop = structuredClone(this.crop);

        return clone;
    }
    
}