
/*
    (0,0) = in the index of position of [0][0]

    (0,0) (1,0) (2,0) (3,0) (4,0)
    (0,1) (1,1) (2,1) (3,1) (4,1)
    (0,2) (1,2) (2,2) (3,2) (4,2)
    (0,3) (1,3) (2,3) (3,3) (4,3)
    (0,4) (1,4) (2,4) (3,4) (4,4)
*/
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

//Constructor for Tile
function Tile(x, y, colour, shape, gameManager) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.shape = shape;
    this.image = gameManager.add.image(TILES_POSITIONS[x][y][0], TILES_POSITIONS[x][y][1], colour + "_" + shape);
}


