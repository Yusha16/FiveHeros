class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "GameScene", active: true});

        //6 Positions with (x,y)
        this.CHARACTER_POSITIONS = [[175, 250], [175, 375], [175, 500], [50, 250], [50, 375], [50, 500]];
        this.characters = Array();

        this.selectedCharacter = null;

        this.ENEMY_CHARACTER_POSITIONS = [[700, 250], [700, 375], [700, 500]];
        this.selectedEnemyCharacter = null;
        this.enemyCharacters = Array();

        this.health = 100;
        this.special = 0;
        this.Bars = {};
    }

    preload() {
        this.load.setPath('assets/');
        this.load.image('forest', 'background/forest.png');
        this.load.spritesheet('sara', 'sara/sara.png', {frameWidth: 200, frameHeight: 200});
        this.load.spritesheet('zephyr', 'zephyr/zephyr.png', {frameWidth: 200, frameHeight: 200});
    }

    create() {
        var menuContainer;
        var background = this.add.image(400, 300, 'forest');
        background.scaleX = 3;
        background.scaleY = 4;

        for (let i = 0; i < 6; i++) {
            //characters.push(this.add.sprite(CHARACTER_POSITIONS[i][0], CHARACTER_POSITIONS[i][1], 'sara'));
            //characters[i].scaleX = 0.75;
            //characters[i].scaleY = 0.75;
            this.characters.push(new Character("sara", "red", "sword", "n/a", 100, 100, "Deal 250 damage", "Deal 500 damage", "Deal 1000 damage",
                this.add.sprite(this.CHARACTER_POSITIONS[i][0], this.CHARACTER_POSITIONS[i][1], 'sara')
                    .setName(`p_${i}`) //adding unique id to link gameObject to character array
                    .setInteractive()
            ));
        }

        //Create the enemy
        for (let i = 0; i < 3; i++) {
            this.enemyCharacters.push(new EnemyCharacter("zephyr", "green", "n/a", 100, 5, "none",
                this.add.sprite(this.ENEMY_CHARACTER_POSITIONS[i][0], this.ENEMY_CHARACTER_POSITIONS[i][1], 'zephyr')
                    .setName(`e_${i}`) //adding unique id to link gameObject to  enemy character array
                    .setInteractive()
            ));
        }
        //click listener for characters
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            //make regex for character ids
            let idRegex = /(p|e)_\d+/i;
            let name = gameObject.input.gameObject.name;
            console.log(name);
            //add prehandling if the thing clicked is the close button
            if (/Close$/.test(name)) {
                try {
                    menuContainer.removeAll(true);
                    return;
                } catch (e) {
                    console.error(`There was an error attempting to close menu with error: ${e}`);
                }
            }
            else if (/Attack$/.test(name)) {
                try {
                    menuContainer.removeAll(true);
                    this.scene.scene.pause("GameScene");
                    this.scene.scene.bringToTop("AttackScene");
                    this.scene.scene.resume("AttackScene");
                    return;
                } catch (e) {
                    console.error(`There was an error for starting the attack scene: ${e}`);
                }
            }
            //add handling for first menu
            if(!menuContainer)
            {
                menuContainer = this.scene.add.container(0, 0);
            }




            //add handling for clicking characters


            //check to make sure that character was clicked, also add handling to empty container if another character is clicked before closing previous menu
            if (idRegex.test(name)) {
                menuContainer.removeAll(true);

                let id = name.split('_'); //split the id into array to separate enemies from player chars, and also allow for multidigit char counts
                //TODO add position data trait to Characters to make IDing front line less dirty
                //temp solution to render menus properly based on initial
                let frontLine = id[0] === 'p' && id[1] < 3 ? true : false;
                //get character data from array based on split

                //Set the selected character 
                if (id[0] === 'p') {
                    this.scene.selectedCharacter = this.scene.characters[id[1]];
                }
                else {
                    this.scene.selectedEnemyCharacter = this.scene.enemyCharacters[id[1]];
                }

                let charData = id[0] === 'p' ? this.scene.characters[id[1]] : this.scene.enemyCharacters[id[1]];
                //parse char color into hex, since it's currently being stored as a string, might want to change that
                let charColor =
                    charData.colour === 'red' ? 0xff0000 :
                        charData.colour === 'blue' ? 0x0000ff :
                            charData.colour === 'green' ? 0x00ff00 :
                                0xffffff;

                //create menu rect
                var menuRect = this.scene.add.rectangle(400, 275, 400, 300, charColor);
                menuContainer.add(menuRect);

                //create array for rendering menu
                var menuArray = [`Name: ${charData.name}`, `Attack: ${charData.attack}`, `Special: ${charData.special}`, 'Attack', 'Activate Special', 'Switch', 'Details', 'Close'];

                //build render loop
                for (let i = 0; i < menuArray.length; i++) {
                    //add skip condition for if frontline or not or if enemy

                    if (
                        (!frontLine && i > 2 && i < menuArray.length - 2)
                        ||
                        (id[0] === 'e' && i > 0 && i < menuArray.length - 1)
                    ) {
                        continue;
                    }

                    let menuItem = this.scene.add.text(menuRect.x, menuRect.y - menuRect.height / 2 + (menuRect.height / menuArray.length * i), menuArray[i], {
                            //fontSize: "24px",
                            font: 'bold 24px Arial',
                            fill: 'white',
                            strokeThickness: 6,
                            stroke: 'black'
                        }
                    );

                    menuItem.x -= menuItem.width / 2;
                    //add interactive and black box
                    if (i > 2) {




                        let menuItemOutline = this.scene.add.rectangle(menuRect.x, menuRect.y - menuRect.height / 2 + (menuRect.height / menuArray.length * i) + (menuItem.height / 2), menuRect.width - 25, menuItem.height);
                        menuItemOutline.setStrokeStyle(5, 0x000000);

                        //set interaction on surrounding outline box, for easier hit, convert names with spaces into dashes, and join character ID with action ID
                        menuItemOutline.setName(`${id[0]}_${id[1]}_${menuArray[i].split(' ').join('-')}`);
                        //add in grey out and disable button for low special meter (less than 5)
                        if(i === 4 && this.scene.special < 5)
                        {
                            // let disableOverlay = this.scene.add.rectangle(menuRect.x, menuRect.y - menuRect.height / 2 + (menuRect.height / menuArray.length * i) + (menuItem.height / 2), menuRect.width - 25, menuItem.height);
                            // disableOverlay.setFillStyle(0x888888, 0.5);
                            //
                            // menuContainer.add(disableOverlay);
                            menuItem.setTint(0x888888);
                            //menuItemOutline.setFillStyle(0x000000, 0.5);
                        } else {
                            menuItemOutline.setInteractive();
                        }


                        menuContainer.add(menuItemOutline);
                    }
                    menuContainer.add(menuItem);

                }
            }


        });

        SetUpAnimations(this);

        for (let i = 0; i < 6; i++) {
            //characters[i].anims.play('idle', true);
            //this.characters[i].sprite.anims.play('idle');
            this.characters[i].SwitchAnimation('idle');
        }
        this.selectedCharacter = this.characters[0];
        //Just testing animation changes
        //this.characters[2].sprite.anims.play('attack', true);
        //Create the enemy
        for (let i = 0; i < 3; i++) {
            //this.enemyCharacters[i].sprite.anims.play('idle');
            this.enemyCharacters[i].SwitchAnimation('idle');
        }
        this.selectedEnemyCharacter = this.enemyCharacters[0];


        //Create a attack button (Note this is just a test button!!!)
        /*
        var attackButton = this.add.text(100, 100, 'Attack', {fill: '#ffffff'})
            .setInteractive()
            .on('pointerup', () => {
                    this.scene.pause("GameScene");
                    this.scene.bringToTop("AttackScene");
                    this.scene.resume("AttackScene");
                }
            );
            */
        //create a health bar outline
        var healthBarOutline = this.add.rectangle(400, 50, 700, 25);

        healthBarOutline.setStrokeStyle(5, 0x00ff00);
        //create health bar fill
        var healthBarFill = this.add.rectangle(50, 35, 700 * (this.health / 100), 25, 0x00ff00).setOrigin(0, 0);

        //set the health bar to be globally stored
        this.Bars.healthBar = {};
        this.Bars.healthBar.fill = healthBarFill;
        this.Bars.healthBar.outline = healthBarOutline;


        //set listener to change health bar outline and fill color and percent, set to pointerdown just to test
        this.input.on('pointerdown', function () {
            UpdateHealthValue(this, -1);
        });



        //create basic special bar
        //create a special bar outline
        var specialBarOutline = this.add.rectangle(400, 90, 700, 25);

        specialBarOutline.setStrokeStyle(5, 0x49def5);

        //create special bar fill
        var specialBarFill = this.add.rectangle(50, 75, 0.000001, 25, 0x49def5).setOrigin(0, 0); //can't modify width of 0, so make it a really small number instead
        specialBarFill.setName('specialBarFill');
        //add it to global tracking for easy access from functions
        this.Bars.specialBar = specialBarFill;



        //set listener to change special bar fill percent, set to right arrow down just to test

        this.input.keyboard.on('keydown', function (event) {
            //UpdateSpecialValue(this, 1);
        });




        this.scene.bringToTop("GameScene");
    }

    /*
    This code is referenced from: http://labs.phaser.io/edit.html?src=src%5Cscenes%5Cdrag%20scenes%20demo.js
    Function will create a window for the scene (Code that can be used for the character menu may not need it)
    */
    createWindow(func) {
        var x = Phaser.Math.Between(400, 600);
        var y = Phaser.Math.Between(64, 128);

        var handle = 'window' + this.count++;

        var win = this.add.zone(x, y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);

        var demo = new func(handle, win);

        this.input.setDraggable(win);

        win.on('drag', function (pointer, dragX, dragY) {

            this.x = dragX;
            this.y = dragY;

            demo.refresh()

        });

        this.scene.add(handle, demo, true);
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [GameScene, AttackScene]
};

var game = new Phaser.Game(config);

//function to set health bar fill and color based on health input

function UpdateHealthBarColor(health) {
    try {
        let returnColor;
        //set the R,G based on being above below set point (50)
        if (health >= 50) {
            let red = Math.floor((-((health - 100) / 100 * 2 * 0xFF))).toString(16);
            returnColor = parseInt(`0x${red}FF00`);
            //console.log(`red value is ${red} and returnColor is ${returnColor}`);
        } else {
            let green = Math.floor((((health * 2) / 100 * 0xFF))).toString(16);
            //add preceeding zero when under 10 to maintain proper hex value
            if (green.length < 2) {
                green = `0${green}`;
            }
            returnColor = parseInt(`0xFF${green}00`);
            //console.log(`green value is ${green} and returnColor is ${returnColor}`);
        }
        return returnColor;
    } catch (err) {
        console.log(`There was an error updating the healthbar with a value of ${health} and error code ${err}`)
    }

}

//Play attack animation for the selected character and play hurt animation for the selected enemy character
//Also update the game scene values such as health, special meter, enemy health, and action UI amount
//damageAmount is calculated in the attack scene due to knowing which tile is selected (same colour bonus rule)
//Note: damageAmount might double again if the selected character has colour advantage against the enemy
//numConnected is number of tiles connected to know if the player can use ultimate or ace ability
function Attack(damageAmount, numConnected, gameScene) {
    console.log("Attack");
    console.log(damageAmount + " " +  numConnected);
    //gameScene.selectedCharacter.sprite.anims.play('attack', true);
    gameScene.selectedCharacter.SwitchAnimation('attack');

    //Update the special bar
    UpdateSpecialValue(gameScene, numConnected);
    
    //Determine the numConnected if they can use the ultimate or ace ability (this will be developed later when ace and ultimate are finalized)
    if (numConnected == 25) {

    } else if (numConnected > 16) {

    }
    damageAmount *= ColourDamageMultiplier(gameScene.selectedCharacter, gameScene.selectedEnemyCharacter);
    //Decrease the damage amount to the enemy
    gameScene.selectedEnemyCharacter.currentHealth -= damageAmount;
    //Also update the health bar of the enemy

    //gameScene.selectedEnemyCharacter.sprite.anims.play('hurt', true);
    gameScene.selectedEnemyCharacter.SwitchAnimation('hurt');

    //Destroy the object (sprite and auto target to next enemy)
    if (gameScene.selectedEnemyCharacter.currentHealth <= 0) {
        gameScene.selectedEnemyCharacter.sprite.destroy(true);

        //Cannot remove due to the method of the menu and selecting character will not work
        //Must empty when all the enemy are destroyed
        /*
        //Remove the ememy character from the array
        for(let i = 0; i < gameScene.enemyCharacters.length; i++) {
            if (gameScene.enemyCharacters[i] == gameScene.selectedEnemyCharacter) {
                gameScene.enemyCharacters.splice(i, 1);
                break;
            }
        }
        //Auto target to next enemy
        gameScene.selectedEnemyCharacter = gameScene.enemyCharacters[0];
        */
        //Auto target to next enemy that is alive
        for(let i = 0; i < gameScene.enemyCharacters.length; i++) {
            if (gameScene.enemyCharacters[i].currentHealth > 0) {
                gameScene.selectedEnemyCharacter = gameScene.enemyCharacters[i];
                break;
            }
            else if (i == gameScene.enemyCharacters.length - 1) {
                //We won
                console.log("You win");
                gameScene.enemyCharacters = Array();
            }
        }
    }
}

//Function that determine if the selected character has a colour advantage against the target character and vice versa
//Returns a number value where there can be 3 different value
//Advantage = 2
//Neutral = 1
//Disadvantage = 0.5
//Rules:
//Red > Green
//Green > Blue
//Blue > Red
function ColourDamageMultiplier(selectedChar, targetChar) {
    //if statement to determine the muliplier from the rules
    if (selectedChar.colour == "red") {
        if (targetChar.colour == "red") {
            return 1;
        } else if (targetChar.colour == "green") {
            return 2;
        } else {
            return 0.5;
        }
    } else if (selectedChar.colour == "green") {
        if (targetChar.colour == "red") {
            return 0.5;
        } else if (targetChar.colour == "green") {
            return 1;
        } else {
            return 2;
        }
    } else {
        if (targetChar.colour == "red") {
            return 2;
        } else if (targetChar.colour == "green") {
            return 0.5;
        } else {
            return 1;
        }
    }
}

//function to change global special value, and update bar display
function UpdateSpecialValue(gameScene, value) {
    if (gameScene.special + value > 100) {
        gameScene.special = 100;
    } else if (gameScene.special + value < 0) {
        gameScene.special = 0;
    } else {
        gameScene.special += value;
    }
    console.log(`updating special display`);
    let specialBarFill = gameScene.Bars.specialBar;
    specialBarFill.displayWidth = (gameScene.special / 100 * 700);
}

//function to change global health value, and update bar display

function UpdateHealthValue (gameObject, value) {
    if (gameObject.scene.health + value > 100) {
        gameObject.scene.health = 100;
    } else if (gameObject.scene.health + value < 0) {
        gameObject.scene.health = 0;
    } else {
        gameObject.scene.health += value;
    }
    let healthBarFill = gameObject.scene.Bars.healthBar.fill;
    let healthBarOutline = gameObject.scene.Bars.healthBar.outline;
    healthBarOutline.setStrokeStyle(5, UpdateHealthBarColor(gameObject.scene.health));
    healthBarFill.displayWidth = (gameObject.scene.health / 100 * 700);
    healthBarFill.setFillStyle(UpdateHealthBarColor(gameObject.scene.health));
}