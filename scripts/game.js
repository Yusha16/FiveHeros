
class GameScene extends Phaser.Scene {
    constructor() {
        super();

        this.gameManager = null;

        //6 Positions with (x,y)
        this.CHARACTER_POSITIONS = [[175, 250], [175, 375], [175, 500], [50, 250], [50, 375], [50, 500]];
        this.characters = Array();

        this.colourRule = "";
        this.shapeRule = "";
        this.numberConnected = 0;
        this.tiles = Array();
        this.nextTiles = Array();
        this.collectedTiles = Array();
    }

    preload ()
    {
        this.gameManager = this;
        this.load.setPath('assets/');
        this.load.image('forest', 'background/forest.png');
        this.load.spritesheet('sara', 'sara/sara.png', { frameWidth: 200, frameHeight: 200 });

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

    }
    create ()
    {
        var background = this.add.image(400, 300, 'forest');
        background.scaleX = 3;
        background.scaleY = 4;

        for (let i = 0; i < 6; i++) {
            //characters.push(this.add.sprite(CHARACTER_POSITIONS[i][0], CHARACTER_POSITIONS[i][1], 'sara'));
            //characters[i].scaleX = 0.75;
            //characters[i].scaleY = 0.75;
            this.characters.push(new Character("sara", "red", "sword", "n/a", 100, 100, "Deal 250 damage", "Deal 500 damage", "Deal 1000 damage",
            this.add.sprite(this.CHARACTER_POSITIONS[i][0], this.CHARACTER_POSITIONS[i][1], 'sara')));
        }

        SetUpAnimations(this.gameManager);
        
        for (let i = 0; i < 6; i++) {
            //characters[i].anims.play('idle', true);
            this.characters[i].sprite.anims.play('idle', true);
        }    
        this.characters[2].sprite.anims.play('attack', true);

        //Create the tiles
        for (let i = 0; i < 5; i++) {
            this.tiles.push(new Array());
            for (let j = 0; j < 5; j++) {
                this.tiles[i].push(GenerateNewTile(this.gameManager, i, j));
            }   
        }
        for (let i = 0; i < 3; i++) {
            //Position 5 is the row 6 for the TILES_POSITION which is the next tiles positions
            this.nextTiles.push(GenerateNewTile(this.gameManager, 5, i));
        }

        //Create a attack button
        var attackButton = this.add.text(100, 100, 'Attack', { fill: '#ffffff' })
            .setInteractive()
            .on('pointerup', () => {

            }
        );
        //create a health bar outline
        var healthBarOutline = this.add.rectangle(400, 50, 700, 25);

        healthBarOutline.setStrokeStyle(5, 0x00ff00);
        //create health bar fill
        var healthBarFill = this.add.rectangle(50, 35, 700, 25, 0x00ff00).setOrigin(0, 0);

        //set the health data attribute and color function
        healthBarOutline.setDataEnabled();

        healthBarOutline.data.set('health', 100);

        //set listener to change health bar outline and fill color and percent, set to pointerdown just to test



        this.input.on('pointerdown', function () {
            if(healthBarOutline.data.get('health') > 0){
                healthBarOutline.data.values.health -= 2;
                console.log('decreasing health value');
            }
            else{
                healthBarOutline.data.values.health = 0;
            }


        });
        //add function to change health bar and fill when health is changed, for whatever reason 'changedata-health' won't trigger, so the broad 'changedata'
        //is used instead on the healthbarOutline
        healthBarOutline.on('changedata',  function (gameObject, value)  {
            if(value < 0){
                gameObject.data.value.health = 0;
            }
            console.log(`updating health display`);
            let currentHealth = healthBarOutline.data.get('health');
            healthBarOutline.setStrokeStyle(5, UpdateHealthBarColor(currentHealth));
            healthBarFill.displayWidth =  (currentHealth / 100 * 700);
            healthBarFill.setFillStyle(UpdateHealthBarColor(currentHealth));
        });



    }

}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [GameScene]
};

var game = new Phaser.Game(config);

//Function that create a new tile at position (-1, -1) when no value is passed
//otherwise create the tile at the given position (in the object not the scene itself)
function GenerateNewTile(gameManager, x, y) {
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
    return new Tile (x, y, colour, shape, gameManager);
}

//function to set health bar fill and color based on health input

function UpdateHealthBarColor(health) {
    try {
        let returnColor;
        //set the R,G based on being above below set point (50)
        if(health >= 50) {
            let red = Math.floor((-((health - 100) / 100 * 2 * 0xFF))).toString(16);
            returnColor = parseInt(`0x${red}FF00`);
            console.log(`red value is ${red} and returnColor is ${returnColor}`);
        }
        else{
            let green = Math.floor((((health * 2) / 100  * 0xFF))).toString(16);
            //add preceeding zero when under 10 to maintain proper hex value
            if(green.length < 2) {
                green = `0${green}`;
            }
            returnColor = parseInt(`0xFF${green}00`);
            console.log(`green value is ${green} and returnColor is ${returnColor}`);
        }
        return returnColor;
    }
    catch(err) {
        console.log(`There was an error updating the healthbar with a value of ${health} and error code ${err}`)
    }

}