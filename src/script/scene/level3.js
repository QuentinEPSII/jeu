// Variables globales
var map3;
var cursors;
var player;
var scoreText;
var score = 0;
var image;
var meat1;
var meat2;
var meat3;
var doorStart;
var doorEnd;
var fruit;
var fruit2;
var activateFruit = false;
var activateFruit2 = false;

class level3 extends Phaser.Scene{

    constructor(){
         super({key: 'level3' });
    }

    preload () {
        this.load.image('sky', 'src/image/sky.png');
        this.load.image('meat', 'src/image/meat.png');
        this.load.image('fruit', 'src/image/fruit.png');
        this.load.spritesheet('luffy', 'src/image/luffy.png', { frameWidth: 32, frameHeight: 48 });
        this.load.tilemapTiledJSON('map3', 'src/maps/laMap3.JSON');
        this.load.image('pirates', 'src/image/pirates.png');
        this.load.image('door', 'src/image/door.png');
    }
    
       
    create () {
        //Ajout du fond
        image = this.add.image(800, 200, 'sky');
        image.setScrollFactor(0);

        //Ajout de la camera
        this.cameras.main.setBounds(0, 0, 5100, 1400);
        this.physics.world.setBounds(0, 0, 5100, 1350);
    

        
        //Affichage de la map et de ses calques
        map3 = this.make.tilemap({ key: 'map3' });
        var tileset = map3.addTilesetImage('pirate', 'pirates');
        var groundLayer = map3.createLayer('Calque de Tuiles 1', tileset, 0, 0);
        var secondLayer = map3.createLayer('Calque de Tuiles 2', tileset, 0, 0);
        var thirdLayer = map3.createLayer('Calque de Tuiles 3', tileset, 0, 0);
        this.add.text(4850, 16, 'Trolled', {fontSize: '20px', padding: { x: 20, y: 10 }, backgroundColor: '#000000', fill: '#ffffff'});
        
        //Affichage du Score
        scoreText = this.add.text(16, 16, 'Score : 0', {fontSize: '20px', padding: { x: 20, y: 10 }, backgroundColor: '#ffffff', fill: '#000000'});
        scoreText.setScrollFactor(0);

        //Les portes pour retourner au menu
        doorStart = this.add.sprite(30, 526,'door');
        doorEnd = this.add.sprite(30, 1317,'door');

        // Activation des collisions pour le calque "groundLayer" et "thirdLayer"
        groundLayer.setCollisionByExclusion([-1]);
        thirdLayer.setCollisionByExclusion([-1]);
    
        // Ajout du joueur  
        player = this.physics.add.sprite(80, 500, 'luffy');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(700);

        //Collisons entre le joueur et le calque
        this.physics.add.collider(player, groundLayer);
        this.physics.add.collider(player, thirdLayer);
    
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
    
        //Ajout des objets à récuperer
        meat1 = this.physics.add.image(450,730,'meat');
        meat2 = this.physics.add.image(2980,955,'meat');
        meat3 = this.physics.add.image(3420,380,'meat');
        this.physics.add.overlap(player, meat1, addMeat, null, this);
        this.physics.add.overlap(player, meat2, addMeat, null, this);
        this.physics.add.overlap(player, meat3, addMeat, null, this);

        //Ajout des bonus à récuperer
        fruit = this.physics.add.image(4010,315,'fruit');
        this.add.text(3950, 250, 'More Speed', {fontSize: '20px', padding: { x: 20, y: 10 }});
        fruit2 = this.physics.add.image(4680,315,'fruit');
        this.add.text(4600, 250, 'More Jump', {fontSize: '20px', padding: { x: 20, y: 10 }});
        this.physics.add.overlap(player, fruit, addSpeed, null, this);
        this.physics.add.overlap(player, fruit2, addJump, null, this);
    
        
        //Pour faire suivre la camera au personnage
        this.cameras.main.startFollow(player);

        //Initialisation du curseur
        cursors = this.input.keyboard.createCursorKeys();
    }
    
    update () {
        //Commandes pour faire bouger le joueur et gerer ses interactions
        if (player.y > 1305)
            {
            dead();
            }
        
        if (cursors.left.isDown || this.input.keyboard.addKey('Q').isDown)
            {
                if (activateFruit) {
                    player.setVelocityX(-400);
                }
                else {
                    player.setVelocityX(-600);
                }
                player.anims.play('left', true);
            }
        else if (cursors.right.isDown || this.input.keyboard.addKey('D').isDown)
            {
                if (activateFruit) {
                    player.setVelocityX(400);
                }
                else {
                    player.setVelocityX(600);
                }
                player.anims.play('right', true);
            }
        else
            {
                player.setVelocityX(0);
                player.anims.play('turn');
            }
        
        if ((cursors.up.isDown || this.input.keyboard.addKey('Z').isDown) && player.body.onFloor())
            {
                if (activateFruit2) {
                    player.setVelocityY(-550);
                }
                else {
                    player.setVelocityY(-400);
                }
            }
        if (cursors.space.isDown) {
            if (checkDistance(player, doorStart) || checkDistance(player, doorEnd)) {
                this.scene.start("mainWorld");
            } 
        }
    }

}

//Fonction pour gerer le score
function addMeat(player, meats)
{
    meats.disableBody(true, true);
    score += 1;
    scoreText.setText('Score: ' + score);
}

//Fonction pour gerer le bonus de vitesse
function addSpeed(player, fruits)
{
    fruits.disableBody(true, true);
    activateFruit = true;
}

//Fonction pour gerer le bonus de saut
function addJump(player, fruits)
{
    fruits.disableBody(true, true);
    activateFruit2 = true;
}

//Fonction pour gerer la mort du joueur
function dead() 
{
    player.setPosition(80, 500);
}

//Fonction utilisé pour verifier si le joueur est près d'une porte
function checkDistance(player, item) {
    var dist1 = player.getBounds();
    var dist2 = item.getBounds();
    var result = Phaser.Geom.Rectangle.Intersection(dist1, dist2);
    return (result.width !=0 || result.height!=0 )
}

//Export du niveau
export default level3;