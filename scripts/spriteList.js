/***IMPORT OTHER MODULES***/
import {image} from './graphics.js';

//an object that sorts object sprites by their state, the shape they're associated with, and the set (collection of themed sprites)
export const spriteList = {
    
    "test set": {
        
        "red": {
            
            "name": "Red Gem",
            
            "normal": {
                
                "idle": new image("Assets/Spritesheets/RED.png"),
                "hover": new image("Assets/Spritesheets/RED.png"),
                "selected": new image("Assets/Spritesheets/RED.png")
            
            },
            
            "power": {
                
                "idle": new image("Assets/Spritesheets/RED.png"),
                "hover": new image("Assets/Spritesheets/RED.png"),
                "selected": new image("Assets/Spritesheets/RED.png")
            
            }
            
        },
        
        "orange": {
            
            "name": "Orange Gem",
            
            "normal": {
                
                "idle": new image("Assets/Spritesheets/ORANGE.png"),
                "hover": new image("Assets/Spritesheets/ORANGE.png"),
                "selected": new image("Assets/Spritesheets/ORANGE.png")
            
            },
            
            "power": {
                
                "idle": new image("Assets/Spritesheets/ORANGE.png"),
                "hover": new image("Assets/Spritesheets/ORANGE.png"),
                "selected": new image("Assets/Spritesheets/ORANGE.png")
            
            }
            
        },
        
        "yellow": {
            
            "name": "Yellow Gem",
            
            "normal": {
                
                "idle": new image("Assets/Spritesheets/YELLOW.png"),
                "hover": new image("Assets/Spritesheets/YELLOW.png"),
                "selected": new image("Assets/Spritesheets/YELLOW.png")
            
            },
            
            "power": {
                
                "idle": new image("Assets/Spritesheets/YELLOW.png"),
                "hover": new image("Assets/Spritesheets/YELLOW.png"),
                "selected": new image("Assets/Spritesheets/YELLOW.png")
            
            }
            
        },
        
        "green": {
            
            "name": "Green Gem",
            
            "normal": {
                
                "idle": new image("Assets/Spritesheets/GREEN.png"),
                "hover": new image("Assets/Spritesheets/GREEN.png"),
                "selected": new image("Assets/Spritesheets/GREEN.png")
            
            },
            
            "power": {
                
                "idle": new image("Assets/Spritesheets/GREEN.png"),
                "hover": new image("Assets/Spritesheets/GREEN.png"),
                "selected": new image("Assets/Spritesheets/GREEN.png")
            
            }
            
        },
        
        "blue": {
            
            "name": "Blue Gem",
            
            "normal": {
                
                "idle": new image("Assets/Spritesheets/BLUE.png"),
                "hover": new image("Assets/Spritesheets/BLUE.png"),
                "selected": new image("Assets/Spritesheets/BLUE.png")
            
            },
            
            "power": {
                
                "idle": new image("Assets/Spritesheets/BLUE.png"),
                "hover": new image("Assets/Spritesheets/BLUE.png"),
                "selected": new image("Assets/Spritesheets/BLUE.png")
            
            }
            
        },
        
        "purple": {
            
            "name": "Purple Gem",
            
            "normal": {
                
                "idle": new image("Assets/Spritesheets/PURPLE.png"),
                "hover": new image("Assets/Spritesheets/PURPLE.png"),
                "selected": new image("Assets/Spritesheets/PURPLE.png")
            
            },
            
            "power": {
                
                "idle": new image("Assets/Spritesheets/PURPLE.png"),
                "hover": new image("Assets/Spritesheets/PURPLE.png"),
                "selected": new image("Assets/Spritesheets/PURPLE.png")
                
            }
            
        },
        
        "white": {
            
            "name": "White Gem",
            
            "normal": {
                
                "idle": new image("Assets/Spritesheets/WHITE.png"),
                "hover": new image("Assets/Spritesheets/WHITE.png"),
                "selected": new image("Assets/Spritesheets/WHITE.png")
            
            },
            
            "power": {
                
                "idle": new image("Assets/Spritesheets/WHITE.png"),
                "hover": new image("Assets/Spritesheets/WHITE.png"),
                "selected": new image("Assets/Spritesheets/WHITE.png")
            
            }
            
        },
        
        "none": {
            
            "name": "none",
            
            "hypercube": {
                
                "idle": "",
                "hover": "" ,
                "selected": ""
                
            }
            
        }
        
    }
    
}
