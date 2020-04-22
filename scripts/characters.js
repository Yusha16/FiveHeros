
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
}

//Function to set up all animations to be used in the game
function SetUpAnimations(game) {
    //Set Up animation
    game.anims.create({
        key: 'idle',
        frames: game.anims.generateFrameNumbers('sara', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
    });

    game.anims.create({
        key: 'attack',
        frames: game.anims.generateFrameNumbers('sara', { start: 4, end: 7 }),
        frameRate: 4,
        repeat: -1
    });

    game.anims.create({
        key: 'hurt',
        frames: game.anims.generateFrameNumbers('sara', { start: 8, end: 9 }),
        frameRate: 4,
        repeat: -1
    });

}