class AttackScene extends Phaser.Scene {
    constructor () {
        super({ key: "AttackScene" , active: true });

        this.x = 175;
        this.y = 125;
        this.width = 450;
        this.height = 475;

        //For the Tiles on the Sceen
        this.colourRule = "";
        this.shapeRule = "";
        this.numberConnected = 0;
        this.tiles = Array();
        this.nextTiles = Array();
        this.collectedTiles = Array();
    }

    preload () {
        this.load.setPath('assets/');
        this.load.image('green_square', 'tiles/green_square.png');
        this.load.image('blue_square', 'tiles/blue_square.png');
        this.load.image('red_square', 'tiles/red_square.png');
        this.load.image('green_triangle', 'tiles/green_triangle.png');
        this.load.image('blue_triangle', 'tiles/blue_triangle.png');
        this.load.image('red_triangle', 'tiles/red_triangle.png');
        this.load.image('green_circle', 'tiles/green_circle.png');
        this.load.image('blue_circle', 'tiles/blue_circle.png');
        this.load.image('red_circle', 'tiles/red_circle.png');
        this.load.image('yellow_star', 'tiles/yellow_star.png');

        this.load.image('red_button', 'buttons/red_button.png');
    }

    create ()
    {
        //Background of the Attack Menu
        let graphics = this.add.graphics();
        graphics.fillStyle("0xffe6c8", 1);
        graphics.fillRect(0, 0, this.width, this.height);
        

        //Set the Menu to the ceneter of the Game
        this.cameras.main.setViewport(this.x, this.y, this.width, this.height);

        //Create the tiles
        for (let i = 0; i < 5; i++) {
            this.tiles.push(new Array());
            for (let j = 0; j < 5; j++) {
                this.tiles[i].push(this.GenerateNewTile(i, j));
            }   
        }
        for (let i = 0; i < 3; i++) {
            //Position 5 is the row 6 for the TILES_POSITION which is the next tiles positions
            this.nextTiles.push(this.GenerateNewTile(5, i));
        }

        //Create a cancel button
        var cancelButton = this.add.image(60, 50, "red_button").setInteractive()
            .on('pointerup', () => {
                this.scene.pause("AttackScene");
                this.scene.bringToTop("GameScene");
                this.scene.resume("GameScene");
            }
        );
        cancelButton.scaleX = 0.6;
        cancelButton.scaleY = 0.6;
        var cancelText =  this.add.text(25, 35, 'Cancel', { 
            //fontSize: "24px",
            font: 'bold 24px Arial',
            fill: 'white',
            }
        );

        var connectedTilesText =  this.add.text(335, 35, '0 Tile(s)', { 
            //fontSize: "24px",
            font: 'bold 24px Arial',
            fill: 'white',
            }
        );
    }

    //Function that create a new tile at position x, y
    //otherwise create the tile at the given position (in the object not the scene itself)
    GenerateNewTile(x, y) {
        let randomNumber = Math.floor(Math.random() * 4); //Random Number between 0 - 3
        var colour = "";
        switch (randomNumber) {
            case 0:
                colour = "red";
                break;
            case 1:
                colour = "green";
                break;
            case 2:
                colour = "blue";
                break;
            default:
                colour = "yellow";
                break;
        }
        var shape = "";
        //Colour is wild tile meaning the shape can only be star
        if (randomNumber != 3)
        {
            randomNumber = Math.floor(Math.random() * 3); //Random Number between 0 - 2
            switch (randomNumber) {
                case 0:
                    shape = "circle";
                    break;
                case 1:
                    shape = "triangle";
                    break;
                default:
                    shape = "square";
                    break;
            }
        }
        else {
            shape = "star";
        }
        return new Tile (x, y, colour, shape, this);
    }
}