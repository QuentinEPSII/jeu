import level1 from './level1.js';

window.onload = function() {
    var config = {
        width: 1400,
        height: 600,
        scene: [ mainWorld, level1 ],
        physics: {
            default: 'arcade', // Permet d'appliquer un set de mouvements aux objets
            arcade: {
                gravity: { y: 0 },
            },
        },
        backgroundColor: '#71c5cf', // Ciel bleu
        parent: 'superLuffyBros', // Affiche le jeu dans le div id="flappyBird"
    };
    game = new Phaser.Game(config);
    window.game = game;
    game.scene.start("mainWorld");
}

// Variables globales

var map;
var map1;
var map2;
var map3;
var cursors;
var player;
var scoreText;
var score = 0
var image;
var door1;
var door2;
var door3;
var meat1;
var meat2;
var meat3;


class mainWorld extends Phaser.Scene{

    constructor(){
         super({key: 'mainWorld' });
    }

    preload () {
        // C'est là qu'on vas charger les images et les sons
        this.load.image('sky', 'image/sky.png');
        this.load.image('ground', 'image/sol.png');
        this.load.image('meat', 'image/meat.png');
        this.load.image('bomb', 'image/bomb.png');
        this.load.image('box', 'image/box.png');
        this.load.spritesheet('luffy', 'image/luffy.png', { frameWidth: 32, frameHeight: 48 });
        this.load.tilemapTiledJSON('map', 'image/accueil.JSON');
        this.load.image('pirates', 'image/pirates.png');
        this.load.image('door', 'image/door.png');
    }
    
    create () {
    
        image = this.add.image(800, 200, 'sky');
        this.cameras.main.setBounds(0, 0, 5100, 30);
        this.physics.world.setBounds(0, 0, 5100, 1000);
    
    
        // Ici on vas initialiser les variables, l'affichage ...
        cursors = this.input.keyboard.createCursorKeys();
    
        map = this.make.tilemap({ key: 'map' });
        var tileset = map.addTilesetImage('pirate', 'pirates');
        var groundLayer = map.createLayer('Calque de Tuiles 1', tileset, 0, 0);
    
       
        door1 = this.add.sprite(370, 396,'door');
        door2 = this.add.sprite(690, 396,'door'); 
        door3 = this.add.sprite(1010, 396,'door');


        // Set collision with player (can also be a group)
        groundLayer.setCollisionByExclusion([-1]);
        //this.physics.add.collider(player, groundLayer);
    
    
        // The player and its settings
        player = this.physics.add.sprite(100, 500, 'luffy');
    
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(700)
        this.physics.add.collider(player, groundLayer);
    
        //  Our player animations, turning, walking left and walking right.
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
        cursors = this.input.keyboard.createCursorKeys();
    }
    
    update () {
    
      if (cursors.left.isDown)
        {
            player.setVelocityX(-200);
            player.anims.play('left', true);
        }
    else if (cursors.right.isDown)
        {
            player.setVelocityX(600);
            player.anims.play('right', true);
        }
    else
        {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
    
    if (cursors.up.isDown && player.body.onFloor())
        {
        player.setVelocityY(-400);
        }
    
    if (cursors.space.isDown) {
        if (checkOverlap(player, door1)) {
            console.log('yo');
        } 
        if (checkOverlap(player, door2)) {
            this.scene.start("level1");
        } 
        if (checkOverlap(player, door3)) {
            console.log('yo');
        }
    }
}

}  

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
     var boundsB = spriteB.getBounds();
     var result = Phaser.Geom.Rectangle.Intersection(boundsA, boundsB);
     return (result.width !=0 || result.height!=0 )
}


