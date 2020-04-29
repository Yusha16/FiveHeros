
/*
    (0,0) = in the index of position of [0][0]

    (0,0) (0,1) (0,2) (0,3) (0,4)
    (1,0) (1,1) (1,2) (1,3) (1,4)
    (2,0) (2,1) (2,2) (2,3) (2,4)
    (3,0) (3,1) (3,2) (3,3) (3,4)
    (4,0) (4,1) (4,2) (4,3) (4,4)
*/
/* Old Version (With respect in the Game Scene)
var TILES_POSITIONS = 
    [
        [[250, 250], [325, 250], [400, 250], [475, 250], [550, 250]],
        [[250, 325], [325, 325], [400, 325], [475, 325], [550, 325]],
        [[250, 400], [325, 400], [400, 400], [475, 400], [550, 400]],
        [[250, 475], [325, 475], [400, 475], [475, 475], [550, 475]],
        [[250, 550], [325, 550], [400, 550], [475, 550], [550, 550]],

        //Positions for the next tiles
        [[325, 175], [400, 175], [475, 175]]
    ];
*/
//Tile Position in the Attack Scene
var TILES_POSITIONS = 
    [
        [[75, 125], [150, 125], [225, 125], [300, 125], [375, 125]],
        [[75, 200], [150, 200], [225, 200], [300, 200], [375, 200]],
        [[75, 275], [150, 275], [225, 275], [300, 275], [375, 275]],
        [[75, 350], [150, 350], [225, 350], [300, 350], [375, 350]],
        [[75, 425], [150, 425], [225, 425], [300, 425], [375, 425]],

        //Positions for the next tiles
        [[150, 50], [225, 50], [300, 50]],
        //Positions for the next tiles (not seen in view)
        [[75, 50]]
    ];

//Constructor for Tile
function Tile(x, y, colour, shape, gameManager) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.shape = shape;
    this.image = gameManager.add.image(TILES_POSITIONS[y][x][0], TILES_POSITIONS[y][x][1], colour + "_" + shape);
    this.image.depth = 1;
}


