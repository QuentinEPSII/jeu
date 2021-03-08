
var config = {
    width: 1400,
    height: 600,
    scene: {
        preload: preload, // Chargement des ressources
        create: create, // Initialisation des variables & objets
        update: update // Fonction appelée 60 fois par seconde
    },
    physics: {
        default: 'arcade', // Permet d'appliquer un set de mouvements aux objets
        arcade: {
            gravity: { y: 0 },
        },
    },
    backgroundColor: '#71c5cf', // Ciel bleu
    parent: 'superLuffyBros', // Affiche le jeu dans le div id="flappyBird"
};


// Variables globales
var game = new Phaser.Game(config);
var map;
var cursors;
var player;
var scoreText;
var score = 0
var image;



function preload () {
    // C'est là qu'on vas charger les images et les sons
    this.load.image('sky', 'image/sky.png');
    this.load.image('sol', 'image/sol.png');
    this.load.image('meat', 'image/meat.png');
    this.load.image('bomb', 'image/bomb.png');
    this.load.image('box', 'image/box.png');
    this.load.spritesheet('luffy', 'image/luffy.png', { frameWidth: 32, frameHeight: 48 });
    this.load.tilemapTiledJSON('map', 'image/laMap.JSON');
    this.load.image('pirates', 'image/pirates.png');
}

   
function create () {

    var lines = [
        'Score : 0'
    ];

    image = this.add.image(800, 200, 'sky');
    image.setScrollFactor(0);
    scoreText = this.add.text(16, 16, 'Score : 0', {fontSize: '20px', padding: { x: 20, y: 10 }, backgroundColor: '#ffffff', fill: '#000000'});
    scoreText.setScrollFactor(0);
    this.cameras.main.setBounds(0, 0, 5100, 30);
    this.physics.world.setBounds(0, 0, 5100, 1000);


    // Ici on vas initialiser les variables, l'affichage ...
    cursors = this.input.keyboard.createCursorKeys();

    map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('pirate', 'pirates');
    var groundLayer = map.createLayer('Calque de Tuiles 1', tileset, 0, 0);
    var secondLayer = map.createLayer('Calque de Tuiles 2', tileset, 0, 0);
    var thirdLayer = map.createLayer('dead', tileset, 0, 0);

   
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


    meat1 = this.physics.add.image(20,300,'meat');
    meat2 = this.physics.add.image(1290,330,'meat');
    meat3 = this.physics.add.image(2270,50,'meat');
    this.physics.add.collider(meat1, groundLayer);
    this.physics.add.overlap(player, meat1, collectStar, null, this);
    this.physics.add.collider(meat2, groundLayer);
    this.physics.add.overlap(player, meat2, collectStar, null, this);
    this.physics.add.collider(meat3, groundLayer);
    this.physics.add.overlap(player, meat3, collectStar, null, this);

    this.cameras.main.startFollow(player);

}

function update () {

    if (player.y > 510)
    {
        dead();
    }

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
}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

function collectStar (player, meats)
{
    meats.disableBody(true, true);
    score += 1;
    scoreText.setText('Score: ' + score);

}

function dead() {
    player.setPosition(100, 500);
}