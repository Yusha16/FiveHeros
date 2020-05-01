
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
    this.condition = "";

    //Whenever a animation is finshed
    this.sprite.on('animationcomplete', function (anim, frame) {
        //if the animation is not idle return to idle state
        if (anim.key != "idle") {
            console.log("Switch");
            this.anims.play('idle');
        }
    }, this.sprite);
}

//Function to set up all animations to be used in the game
function SetUpAnimations(gameManager) {
    //Set Up animation
    gameManager.anims.create({
        key: 'idle',
        frames: game.anims.generateFrameNumbers('sara', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
    });

    gameManager.anims.create({
        key: 'attack',
        frames: game.anims.generateFrameNumbers('sara', { start: 4, end: 7 }),
        frameRate: 4,
        repeat: 0
    });

    gameManager.anims.create({
        key: 'hurt',
        frames: game.anims.generateFrameNumbers('sara', { start: 8, end: 9 }),
        frameRate: 4,
        repeat: 0
    });

}