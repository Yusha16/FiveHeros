
//Constructor for the Character
function Character(name, colour, trait, leader, health, attack, special, ultimate, ace, sprite) {
    this.name = name;
    this.colour = colour;
    this.trait = trait;
    this.leader = leader;
    this.health = health;
    this.attack = attack;
    this.special = special;
    this.ultimate = ultimate;
    this.ace = ace;
    this.sprite = sprite;

    //Values when in game
    this.currentAttack = attack;
    this.condition = "";

    //Switch Animation
    this.SwitchAnimation = function(key) {
        this.sprite.anims.play(this.name + "_" + key);
    };

    //Whenever a animation is finshed
    this.sprite.on('animationcomplete', function (anim, frame) {
        //if the animation is not idle return to idle state
        if (anim.key != "idle") {
            console.log("Switch");
            //Get the name of the character for this animation from the key
            let name = anim.key.split('_')[0];
            //Switch Animation
            this.anims.play(name + "_idle");
        }
    }, this.sprite);

    // this.sprite.on('pointerdown', () => {
    //     this.add.rectangle(50, 50, 50, 0xff00ff);
    // })
}

//Constructor for the Enemy Character
function EnemyCharacter(name, colour, trait, health, attack, special, sprite) {
    this.name = name;
    this.colour = colour;
    this.trait = trait;
    this.health = health;
    this.attack = attack;
    this.special = special;
    this.sprite = sprite;

    //Values when in game
    this.currentHealth = health;
    this.currentAttack = attack;
    this.condition = "";

    //Flip the sprite to face the player character
    this.sprite.flipX = true;

    //Switch Animation
    this.SwitchAnimation = function(key) {
        this.sprite.anims.play(this.name + "_" + key);
    };

    //Whenever a animation is finshed
    this.sprite.on('animationcomplete', function (anim, frame) {
        //if the animation is not idle return to idle state
        if (anim.key != "idle") {
            console.log("Switch");
            //Get the name of the character for this animation from the key
            let name = anim.key.split('_')[0];
            //Switch Animation
            this.anims.play(name + "_idle");
        }
    }, this.sprite);
}

//Function to set up all animations to be used in the game
function SetUpAnimations(gameManager) {
    //Set Up animation
    gameManager.anims.create({
        key: 'sara_idle',
        frames: game.anims.generateFrameNumbers('sara', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
    });

    gameManager.anims.create({
        key: 'sara_attack',
        frames: game.anims.generateFrameNumbers('sara', { start: 4, end: 7 }),
        frameRate: 4,
        repeat: 0
    });

    gameManager.anims.create({
        key: 'sara_hurt',
        frames: game.anims.generateFrameNumbers('sara', { start: 8, end: 9 }),
        frameRate: 2,
        repeat: 0
    });

    gameManager.anims.create({
        key: 'zephyr_idle',
        frames: game.anims.generateFrameNumbers('zephyr', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
    });

    gameManager.anims.create({
        key: 'zephyr_attack',
        frames: game.anims.generateFrameNumbers('zephyr', { start: 4, end: 7 }),
        frameRate: 4,
        repeat: 0
    });

    gameManager.anims.create({
        key: 'zephyr_hurt',
        frames: game.anims.generateFrameNumbers('zephyr', { start: 8, end: 9 }),
        frameRate: 2,
        repeat: 0
    });

}