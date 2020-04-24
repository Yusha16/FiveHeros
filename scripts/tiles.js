
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
        [[50, 200], [125, 200], [200, 200], [275, 200], [350, 200]],
        [[50, 275], [125, 275], [200, 275], [275, 275], [350, 275]],
        [[50, 350], [125, 350], [200, 350], [275, 350], [350, 350]],
        [[50, 425], [125, 425], [200, 425], [275, 425], [350, 425]],
        [[50, 500], [125, 500], [200, 500], [275, 500], [350, 500]],

        //Positions for the next tiles
        [[50, 125], [125, 125], [200, 125]]
    ];

//Constructor for Tile
function Tile(x, y, colour, shape, gameManager) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.shape = shape;
    this.image = gameManager.add.image(TILES_POSITIONS[x][y][0], TILES_POSITIONS[x][y][1], colour + "_" + shape);
}


