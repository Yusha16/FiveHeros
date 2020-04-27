
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" , active: true });

        //6 Positions with (x,y)
        this.CHARACTER_POSITIONS = [[175, 250], [175, 375], [175, 500], [50, 250], [50, 375], [50, 500]];
        this.characters = Array();

    }

    preload ()
    {
        this.load.setPath('assets/');
        this.load.image('forest', 'background/forest.png');
        this.load.spritesheet('sara', 'sara/sara.png', { frameWidth: 200, frameHeight: 200 });

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

        SetUpAnimations(this);
        
        for (let i = 0; i < 6; i++) {
            //characters[i].anims.play('idle', true);
            this.characters[i].sprite.anims.play('idle', true);
        }    
        this.characters[2].sprite.anims.play('attack', true);
        

        //Create a attack button (Note this is just a test button!!!)
        var attackButton = this.add.text(100, 100, 'Attack', { fill: '#ffffff' })
            .setInteractive()
            .on('pointerup', () => {
                this.scene.pause("GameScene");
                this.scene.bringToTop("AttackScene");
                this.scene.resume("AttackScene");
            }
        );

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