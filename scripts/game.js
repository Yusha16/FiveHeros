
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" , active: true });

        //6 Positions with (x,y)
        this.CHARACTER_POSITIONS = [[175, 250], [175, 375], [175, 500], [50, 250], [50, 375], [50, 500]];
        this.characters = Array();

        this.selectedCharacter = null;

        this.ENEMY_CHARACTER_POSITIONS = [[700, 250], [700, 375], [700, 500]];
        this.selectedEnemyCharacter = null;
        this.enemyCharacters = Array();
    }

    preload ()
    {
        this.load.setPath('assets/');
        this.load.image('forest', 'background/forest.png');
        this.load.spritesheet('sara', 'sara/sara.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('zephyr', 'zephyr/zephyr.png', { frameWidth: 200, frameHeight: 200 });
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

        //Create the enemy
        for (let i = 0; i < 3; i++) {
            this.enemyCharacters.push(new EnemyCharacter("zephyr", "red", "n/a", 100, 5, "none", 
            this.add.sprite(this.ENEMY_CHARACTER_POSITIONS[i][0], this.ENEMY_CHARACTER_POSITIONS[i][1], 'zephyr')));
        }

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
        var attackButton = this.add.text(100, 100, 'Attack', { fill: '#ffffff' })
            .setInteractive()
            .on('pointerup', () => {
                this.scene.pause("GameScene");
                this.scene.bringToTop("AttackScene");
                this.scene.resume("AttackScene");
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

        //create basic special bar
        //create a special bar outline
        var specialBarOutline = this.add.rectangle(400, 90, 700, 25);

        specialBarOutline.setStrokeStyle(5, 0x49def5);

        //create special bar fill
        var specialBarFill = this.add.rectangle(50, 75, 700, 25, 0x49def5).setOrigin(0, 0);

        //set the health data attribute and color function
        specialBarOutline.setDataEnabled();

        specialBarOutline.data.set('special', 100);

        //set listener to change special bar fill percent, set to right arrow down just to test

        this.input.keyboard.on('keydown', function (event) {
            if(specialBarOutline.data.get('special') > 0){
                specialBarOutline.data.values.special -= 2;
                console.log('decreasing special value');
            }
            else{
                specialBarOutline.data.values.special = 0;
            }


        });

        //add function to change special bar fill when special is changed, for whatever reason 'changedata-special' won't trigger, so the broad 'changedata'
        //is used instead on the specialBarOutline
        specialBarOutline.on('changedata',  function (gameObject, value)  {
            if(value < 0){
                gameObject.data.value.special = 0;
            }
            console.log(`updating special display`);
            let currentSpecial = specialBarOutline.data.get('special');
            specialBarFill.displayWidth =  (currentSpecial / 100 * 700);
        });



    

        this.scene.bringToTop("GameScene");
    }  
    
    /*
    This code is referenced from: http://labs.phaser.io/edit.html?src=src%5Cscenes%5Cdrag%20scenes%20demo.js
    Function will create a window for the scene (Code that can be used for the character menu may not need it)
    */
    createWindow (func)
    {
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
    
    //Determine the numConnected if they can use the ultimate or ace ability (this will be developed later when ace and ultimate are finalized)
    if (numConnected == 25) {

    }
    else if (numConnected > 16) {

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
        //Remove the ememy character from the array
        for(let i = 0; i < gameScene.enemyCharacters.length; i++) {
            if (gameScene.enemyCharacters[i] == gameScene.selectedEnemyCharacter) {
                gameScene.enemyCharacters.splice(i, 1);
                break;
            }
        }
        //Auto target to next enemy
        gameScene.selectedEnemyCharacter = gameScene.enemyCharacters[0];
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
        }
        else if (targetChar.colour == "green") {
            return 2;
        }
        else {
            return 0.5;
        }
    }
    else if (selectedChar.colour == "green") {
        if (targetChar.colour == "red") {
            return 0.5;
        }
        else if (targetChar.colour == "green") {
            return 1;
        }
        else {
            return 2;
        }
    }
    else {
        if (targetChar.colour == "red") {
            return 2;
        }
        else if (targetChar.colour == "green") {
            return 0.5;
        }
        else {
            return 1;
        }
    }
}