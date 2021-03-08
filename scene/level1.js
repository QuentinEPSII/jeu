var map1;
var cursors;
var player;
var scoreText;
var score = 0;
var image;
var meat1;
var meat2;
var meat3;
var door;

class level1 extends Phaser.Scene{

    constructor(){
         super({key: 'level1' });
    }

    preload () {
        // C'est là qu'on vas charger les images et les sons
        this.load.image('sky', 'image/sky.png');
        this.load.image('sol', 'image/sol.png');
        this.load.image('meat', 'image/meat.png');
        this.load.image('bomb', 'image/bomb.png');
        this.load.image('box', 'image/box.png');
        this.load.spritesheet('luffy', 'image/luffy.png', { frameWidth: 32, frameHeight: 48 });
        this.load.tilemapTiledJSON('map1', 'image/laMap.JSON');
        this.load.image('pirates', 'image/pirates.png');
        this.load.image('door', 'image/door.png');
    }
    
       
    create () {
    
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
    
        map1 = this.make.tilemap({ key: 'map1' });
        var tileset = map1.addTilesetImage('pirate', 'pirates');
        var groundLayer = map1.createLayer('Calque de Tuiles 1', tileset, 0, 0);
        var secondLayer = map1.createLayer('Calque de Tuiles 2', tileset, 0, 0);
        var thirdLayer = map1.createLayer('dead', tileset, 0, 0);
    
        door = this.add.sprite(30, 508,'door');

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
    
    update () {
    
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
    if (cursors.space.isDown) {
        if (checkOverlap(player, door)) {
            this.scene.start("mainWorld");
        } 
    }
}

}

function collectStar(player, meats)
{
    meats.disableBody(true, true);
    score += 1;
    scoreText.setText('Score: ' + score);

}

function dead() 
{
    player.setPosition(100, 500);
}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
     var boundsB = spriteB.getBounds();
     var result = Phaser.Geom.Rectangle.Intersection(boundsA, boundsB);
     return (result.width !=0 || result.height!=0 )
}

export default level1;