// class MenuScene extends Phaser.Scene {
//     constructor() {
//         super({key: "MenuScene", active: true});
//
//         this.x = 175;
//         this.y = 125;
//         this.width = 450;
//         this.height = 475;
//         this.menuRect = null;
//     }
//
//     create ()
//     {
//         //Background of the Attack Menu
//         this.menuRect = this.add.rectangle(this.width / 2, this.height / 2, this.width, this.height, '0xffe6c8');
//
//         //Set the Menu to the ceneter of the Game
//         this.cameras.main.setViewport(this.x, this.y, this.width, this.height);
//
//
//
//         //Create a cancel button
//         var cancelButton = this.add.image(60, 50, "red_button").setInteractive()
//             .on('pointerup', () => {
//                     //Must remove all the collected tile (realistically they can't do this command, but just in case)
//
//                     if (!this.scene.stopInput) {
//                         this.scene.pause("AttackScene");
//                         this.scene.bringToTop("GameScene");
//                         this.scene.resume("GameScene");
//                     }
//                 }
//             );
//         cancelButton.scaleX = 0.6;
//         cancelButton.scaleY = 0.6;
//         cancelButton.depth = 10;
//         var cancelText =  this.add.text(25, 35, 'Cancel', {
//                 //fontSize: "24px",
//                 font: 'bold 24px Arial',
//                 fill: 'white',
//             }
//         );
//         cancelText.depth = 10;
//
//         this.connectedTilesText =  this.add.text(335, 35, '0 Tile(s)', {
//                 //fontSize: "24px",
//                 font: 'bold 24px Arial',
//                 fill: 'white',
//             }
//         );
// }

function createMenu(gameManager) {
    console.log(`it works!`);
    return true;
}