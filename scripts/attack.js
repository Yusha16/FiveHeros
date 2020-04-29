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
        this.connectedTilesText = null;
        this.graphicsLine = null;

        this.stopInput = false;
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
        for (let y = 0; y < 5; y++) {
            this.tiles.push(new Array());
            for (let x = 0; x < 5; x++) {
                this.tiles[y].push(this.GenerateNewTile(x, y));
                this.AddTileListener(this.tiles[y][x]);
            }   
        }
        for (let i = 0; i < 3; i++) {
            //Position 5 is the row 6 for the TILES_POSITION which is the next tiles positions
            this.nextTiles.push(this.GenerateNewTile(i, 5));
        }

        //Create a cancel button
        var cancelButton = this.add.image(60, 50, "red_button").setInteractive()
            .on('pointerup', () => {
                //Must remove all the collected tile (realistically they can't do this command, but just in case)

                if (!this.scene.stopInput) {
                    this.scene.pause("AttackScene");
                    this.scene.bringToTop("GameScene");
                    this.scene.resume("GameScene");
                }
            }
        );
        cancelButton.scaleX = 0.6;
        cancelButton.scaleY = 0.6;
        cancelButton.depth = 10;
        var cancelText =  this.add.text(25, 35, 'Cancel', { 
            //fontSize: "24px",
            font: 'bold 24px Arial',
            fill: 'white',
            }
        );
        cancelText.depth = 10;

        this.connectedTilesText =  this.add.text(335, 35, '0 Tile(s)', { 
            //fontSize: "24px",
            font: 'bold 24px Arial',
            fill: 'white',
            }
        );

        //Add a event when the player released the mouse
        this.input.on('pointerup', function (pointer) {
            console.log("End");
            //Must remove all the tiles and replace with new tiles at the same time calculate the total damage amount
            //Fill from bottom right to top left in a left to right going up pattern
            let damageAmount = 0;
            let collectedTilesAmount = this.scene.numberConnected;
            let delayAmount = 0;
            //let colourBonus = this.scene.scene.get("GameScene").selectedCharacter.colour;
            //let charAttack = this.scene.scene.get("GameScene").selectedCharacter.attack;
            for (let y = 4; y >= 0; y--) {
                for (let x = 4; x >= 0; x--) {
                    //if the current tile is in the collected tiles then
                    if (this.scene.collectedTiles.includes(this.scene.tiles[y][x])) {
                        //Fade out the tile
                        this.scene.tweens.add({
                            targets: this.scene.tiles[y][x].image,
                            alpha: 0,
                            duration: 1000,
                            ease: 'Sine.easeIn',
                            //Note this tween gets removed when the sprite is finished tweening
                            onComplete: function() { 
                                //Remove the sprite from rendering (will get deleted from Garbage Memory)
                                this.targets[0].destroy(true);
                            }
                        });
                        /*
                        if (this.scene.tiles[y][x].colour === colourBonus) {
                            damageAmount += charAttack * 2;
                        }
                        else {
                            damageAmount += charAttack;
                        }
                        */
                        //Must move the next tiles to the tiles and the next tiles line must move
                        let nextTile = this.scene.nextTiles.pop();
                        let newTile = this.scene.GenerateNewTile(0, 6);
                        this.scene.nextTiles.unshift(newTile);
                        //Update the position of the next tiles
                        nextTile.x = x;
                        nextTile.y = y;
                        newTile.x = 0;
                        newTile.y = 5;
                        //Make the tween animation for having the tiles in the next tiles block move like a line (left to right)
                        for (let i = 0; i < 3; i++) {
                            this.scene.tweens.add({
                                targets: this.scene.nextTiles[i].image,
                                x: TILES_POSITIONS[5][i][0],
                                y: TILES_POSITIONS[5][i][1],
                                duration: 1000,
                                delay: delayAmount,
                                ease: 'Sine.easeIn'
                            });
                        }
                        //Make the next tile move to empty spot in the tiles
                        this.scene.tweens.add({
                            targets: nextTile.image,
                            x: TILES_POSITIONS[y][x][0],
                            y: TILES_POSITIONS[y][x][1],
                            duration: 1000,
                            delay: delayAmount,
                            ease: 'Sine.easeIn'
                        });
                        this.scene.tiles[y][x] = nextTile;
                        this.scene.AddTileListener(this.scene.tiles[y][x]);
                        delayAmount += 1000;
                    }
                }
            }
            //Stop all input for the tiles and cancel button
            this.scene.stopInput = true;

            this.scene.time.delayedCall(delayAmount + 500, () => {
                //Turn back the input for the tiles and cancel button
                this.scene.stopInput = false;
                //Reset the text for the connected tiles
                this.scene.connectedTilesText.setText("0 Tile(s)");
                //Go back to the Game Scene and hide the Attack Scene
                this.scene.scene.pause("AttackScene");
                this.scene.scene.bringToTop("GameScene");
                this.scene.scene.resume("GameScene");
                //Must call a Attack function to initiate the attack
                Attack(damageAmount, collectedTilesAmount);
            });

            //Clear out all the data of the collected tiles
            this.scene.numberConnected = 0;
            this.scene.collectedTiles = Array();
            //Clear out the line data
            this.scene.graphicsLine.clear();
            this.scene.graphicsLine.lineStyle(8, "0xFFC0CB", 1); 
            //Reset the rules
            this.scene.colourRule = "";
            this.scene.shapeRule = "";
        });

        //Set up the graphics for the line
        this.graphicsLine = this.add.graphics();
        this.graphicsLine.lineStyle(8, "0xFFC0CB", 1);
    }

    update() {
    }

    //Return a bool flag if the added tile can be part of the chain
    //Rules:
    //The added tile is adjacent to the last tile in the chain
    //Do note that the chain can only have the same colour or the same shape
        //The tile is the same colour as the chain
        //The tile is the same shape as the chain
    //Special Case: The tile is a wild tile (yellow star)
    //The added tile is not in the chain already
    //Parameter:
    //x: the x position in the grid (0-indexed)
    //y: the y position in the grid (0-indexed)
    CheckConnectionRule(x, y) {
        //First check if the tiles in not in the chain
        if (this.collectedTiles.includes(this.tiles[y][x])) {
            return false;
        }
        //Check if the tile is adjacent to the last tile in the chain
        let lastX = this.collectedTiles[this.collectedTiles.length - 1].x;
        let lastY = this.collectedTiles[this.collectedTiles.length - 1].y;
        if (!((lastX + 1 === x || lastX === x || lastX -1 === x) && 
        (lastY + 1 === y || lastY === y || lastY -1 === y))) {
            console.log("Not Connected: (" + lastY + "," + lastX + ") with (" + y + "," + x + ")");
            return false;
        }
        //if the rule right now is wild tile then set the new tile as the rule
        if (this.colourRule === "yellow") {
            this.colourRule = this.tiles[y][x].colour;
            this.shapeRule = this.tiles[y][x].shape;
            return true;
        }
        //if the tile added is a wild tile
        if (this.tiles[y][x].colour === "yellow") {
            return true;
        }
        //Now check if the tile follow the chain rule (shape or colour)
        //This means the rule is checking the shape
        if (this.colourRule === "" && this.shapeRule === this.tiles[y][x].shape) {
            return true;
        }
        //This means the rule is checking the colour
        else if (this.shapeRule === "" && this.colourRule === this.tiles[y][x].colour) {
            return true;
        }
        //If the colour and shape of the rule are the same as the new tile
        else if (this.colourRule === this.tiles[y][x].colour && this.shapeRule === this.tiles[y][x].shape) {
            return true;
        }
        //This is when the player has both rule and decide on which specific one from the new tile
        //Ex. Current Rule Green Square then new Tile is a Green Circle meaning the new rule is only green colour shape
        else if (this.colourRule === this.tiles[y][x].colour) {
            this.shapeRule = "";
            return true;
        }
        else if (this.shapeRule === this.tiles[y][x].shape) {
            this.colourRule = "";
            return true;
        }
        //The new tile does not follow the chain rule
        return false;
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

    AddTileListener(tile) {
        tile.image.setInteractive();
        //Start the Chain
        tile.image.on('pointerdown', () => {
            if (!this.stopInput) {
                tile.image.setAlpha(0.5);
                this.numberConnected++;
                this.collectedTiles.push(tile);
                this.colourRule = tile.colour;
                this.shapeRule = tile.shape;
                this.connectedTilesText.setText(this.numberConnected + " Tile(s)");
                console.log("Start");
            }
        });
        //Continue the Chain
        tile.image.on('pointerover', () => {
            //Check the rules if the chain can happen
            if(!this.stopInput && this.numberConnected > 0 && this.CheckConnectionRule(tile.x, tile.y)) {            
                this.numberConnected++;
                this.collectedTiles.push(tile);
                tile.image.setAlpha(0.5);
                this.connectedTilesText.setText(this.numberConnected + " Tile(s)");
                //Draw a line connecting the tile
                let line = new Phaser.Geom.Line(this.collectedTiles[this.numberConnected - 2].image.x, 
                    this.collectedTiles[this.numberConnected - 2].image.y, tile.image.x, tile.image.y);
                this.graphicsLine.strokeLineShape(line);
                console.log("Connect");
            }
        });
    }
}