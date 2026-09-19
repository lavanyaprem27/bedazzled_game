# ABOUT
This project is a simple match-3 game inspired by the design and gameplay of PopCap Games' Bejeweled 2 (Endless Mode). This project was made for the AP Computer Science Principles Exam Performance Task and features custom sprites made in the Blender 3D Modelling Software. While not all of Bejeweled 2's features were able to be implemented due to time constraints, the game still features game-accurate controls, match-making rules, and scoring progression. 

# TECHNICAL DETAILS
This program was made with HTML, CSS, and JavaScript. Like the Dynamic Grid Tournament Bracket program, the majority of the graphics and logic was made through JavaScript and the Canvas API. In fact, I was able to use many of the graphics-handling methods I designed for the Bracket Program as a baseline for the game board generation and sprite renderer. This program also features many custom classes dedicated to particular game objects, such as the individual gems and board tiles.

# IMPLEMENTED FEATURES
* Game board keeps track of user input and is able to modify gem positions according to user selection. Incompatible swaps are swapped back to their original position, like the original game.
* Gem population algorithms generate gems to be random, yet always have at least 1-valid move and no automatic matches.
* Scorebar keeps track of current level progress.
* Gems incorporate basic physics for falling movement.
* Match combos multiply score as per the original game's logic.
* Level progression follows the original game's logic.
* Custom 4- and 5-gem configurations with increased points.

# FEATURES TO BE ADDED
* Dedicated home/menu screen
* Graphics redesign
* Special gems: power gems, hypercubes
* Spritesheet animations
* Hints feature: automatic time-based hints and manual hints
* Background audio and SFX

# INSTRUCTIONS
1. Click on a tile to select the gem within it. Select an adjacent tile to swap the two gems within the tiles. Deselect tiles by clicking on them again.
2. Swap gems strategically to form 3+ gems in a row (horizontally or vertically). More gems in a line result in more points.
3. Try to score combos by strategically forming lines of gems that form another line after the gems break/move into place. Combos multiply points, helping you progress faster!
4. After a level is complete, the board will reset. The points needed to complete a level will get higher each time.
5. This game is infinite, so sit back, relax, and enjoy the game! Bejeweled 2 got me through a lot of long international flights (I was introducted to the game via some old flight entertainment systems), so I hope to share that experience with you!
