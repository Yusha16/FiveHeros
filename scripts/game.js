var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

//6 Positions with (x,y)
var CHARACTER_POSITIONS = [[500, 300], [500, 400], [500, 500], [400, 300], [400, 400], [400, 500]];
var characters = Array();

function preload ()
{
    this.load.setPath('assets/');
    this.load.image('forest', 'background/forest.png');
    this.load.spritesheet('sara', 'sara/sara.png', { frameWidth: 200, frameHeight: 200 });
}

function create ()
{
    var background = this.add.image(400, 300, 'forest');
    background.scaleX = 3;
    background.scaleY = 4;

    for (let i = 0; i < 6; i++) {
        //characters.push(this.add.sprite(CHARACTER_POSITIONS[i][0], CHARACTER_POSITIONS[i][1], 'sara'));
        //characters[i].scaleX = 0.75;
        //characters[i].scaleY = 0.75;
        characters.push(new Character("sara", "red", "sword", "n/a", 100, 100, "Deal 250 damage", "Deal 500 damage", "Deal 1000 damage",
        this.add.sprite(CHARACTER_POSITIONS[i][0], CHARACTER_POSITIONS[i][1], 'sara')));
        characters[i].sprite.scaleX = 0.75;
        characters[i].sprite.scaleY = 0.75;
    }

    SetUpAnimations(game);
    
    for (let i = 0; i < 6; i++) {
        //characters[i].anims.play('idle', true);
        characters[i].sprite.anims.play('idle', true);
    }    
    characters[2].sprite.anims.play('attack', true);

}

function update () 
{
}

function changeAnimation() 
{

}