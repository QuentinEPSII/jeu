// Import des 3 niveaux
import level1 from './level1.js';
import level2 from './level2.js';
import level3 from './level3.js';

// La config
window.onload = function() {
    var config = {
        width: 1400,
        height: 600,
        scene: [ mainWorld, level1, level2, level3 ], //Ajout des scènes
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
            },
        },
        parent: 'superLuffyBros',
    };
    game = new Phaser.Game(config);
    window.game = game;
    game.scene.start("mainWorld");
}

// Variables globales
var map;
var cursors;
var player;
var image;
var door1;
var door2;
var door3;

class mainWorld extends Phaser.Scene{

    constructor(){
         super({key: 'mainWorld' });
    }

    preload () {
        this.load.image('sky', 'src/image/sky.png');
        this.load.image('meat', 'src/image/meat.png');
        this.load.spritesheet('luffy', 'src/image/luffy.png', { frameWidth: 32, frameHeight: 48 });
        this.load.tilemapTiledJSON('map', 'src/maps/accueil.json');
        this.load.image('pirates', 'src/image/pirates.png');
        this.load.image('door', 'src/image/door.png');
    }
    
    create () {
        //Ajout du fond
        image = this.add.image(800, 200, 'sky');

        //Texte pour les niveaux
        this.add.text(300, 432, 'Niveau 1', {fontSize: '20px', padding: { x: 20, y: 10 }});
        this.add.text(620, 432, 'Niveau 2', {fontSize: '20px', padding: { x: 20, y: 10 }});
        this.add.text(940, 432, 'Niveau 3', {fontSize: '20px', padding: { x: 20, y: 10 }});
    
        
        //cursors = this.input.keyboard.createCursorKeys();
    
        //Affichage de la map et de ses calques
        map = this.make.tilemap({ key: 'map' });
        var tileset = map.addTilesetImage('pirate', 'pirates');
        var groundLayer = map.createLayer('Calque de Tuiles 1', tileset, 0, 0);
    
        //Les portes pour se rendre dans un niveau
        door1 = this.add.sprite(370, 396,'door');
        door2 = this.add.sprite(690, 396,'door'); 
        door3 = this.add.sprite(1010, 396,'door');

        // Activation des collisions pour le calque "groundLayer"
        groundLayer.setCollisionByExclusion([-1]);
 
        // Ajout du joueur
        player = this.physics.add.sprite(100, 500, 'luffy');  
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(700)

        //Collisons entre le joueur et le calque
        this.physics.add.collider(player, groundLayer);
    
        //Animations du joueur
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('luffy', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'luffy', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('luffy', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });   

        //Initialisation du curseur
        cursors = this.input.keyboard.createCursorKeys();
    }
    
    update () {
    
        //Commandes pour faire bouger le joueur et gerer ses interactions
        if (cursors.left.isDown || this.input.keyboard.addKey('Q').isDown)
            {
                player.setVelocityX(-200);
                player.anims.play('left', true);
            }
        else if (cursors.right.isDown || this.input.keyboard.addKey('D').isDown)
            {
                player.setVelocityX(200);
                player.anims.play('right', true);
            }
        else
            {
                player.setVelocityX(0);
                player.anims.play('turn');
            }
        if ((cursors.up.isDown || this.input.keyboard.addKey('Z').isDown) && player.body.onFloor())
            {
            player.setVelocityY(-400);
            }
        if (cursors.space.isDown) {
            if (checkDistance(player, door1)) {
                this.scene.start("level1");
            } 
            if (checkDistance(player, door2)) {
                this.scene.start("level2");
            } 
            if (checkDistance(player, door3)) {
                this.scene.start("level3");
            }
        }
    }

}  

//Fonction utilisé pour verifier si le joueur est près d'une porte
function checkDistance(player, item) {
    var dist1 = player.getBounds();
    var dist2 = item.getBounds();
    var result = Phaser.Geom.Rectangle.Intersection(dist1, dist2);
    return (result.width !=0 || result.height!=0 )
}


