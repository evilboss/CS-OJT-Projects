
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/black.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('toads', 'assets/toad.png');
    game.load.image('bullet', 'assets/missile.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('reset', 'assets/resetbutton.png');
    game.load.image('screen', 'assets/FSButton.gif')

}

var player;
var platforms;
var cursors;
var bullet;
var fireRate = 100;
var nextFire;
var spacebar;
var group;

var toads;
var starCount = 0;
var score = 0;
var scoreText;
var bulletCount = 0;
var bulletcount;

    
var resetButton;
var fullScreenButton;

function startStar(){
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var toad = toads.create(i * 70, 0, 'toads');

        //  Let gravity do its thing
        toad.body.gravity.y = 0;
        
        toad.width = 37;
        toad.height = 37;

        //  This just gives each star a slightly random bounce value
        toad.body.bounce.y = 0.7 + Math.random() * 0.2;
        
        starCount = starCount +1;
    }
    
    

}


//-----------------------
function gofull() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen();
    }

}    
    
    
function actionOnClick(){
      location.reload();
}    
    
    
function create() {
    
    //FullScreen
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    //game.input.onDown.add(gofull, this);
    
    
    //  We're going to be using physics, so enable the Arcade Physics
    //  system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group con tains the ground and the 2 ledges we
    //  can jump o n
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this
    //  group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64,
        'ground');

    //  Scale it to fit the width of the game (the original sprite is
    //  400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    //------------------------------------------------------
   // player = game.add.sprite(32, game.world.height - 150, 'dude');
     group = game.add.group();
     player = createplayer(group, 50, 50, "dude", 200);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    // -----------------------------------------
    
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    toads = game.add.group();

    //  We will enable physics for any star that is created in this
    //  group
    toads.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    startStar();
    //  The score
    
    //-------------------------------------------------
    scoreText = game.add.text(300, 550, 'Score: 0', { fontSize: '32px',
        fill: '#000' });
    bulletcount = game.add.text(550, 550, 'Bullet Count: 0', { 
        fontSize: '32px', fill: '#000' });

    
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
    
    //---------------------
    resetButton = game.add.button(50,550, 'reset', actionOnClick,
        this, 2, 1, 0);    
    resetButton.height = 40;
    resetButton.width = 40;
    
    
    fullScreenButton = game.add.button(150,550, 'screen' ,gofull,
        this, 2, 1, 0);
    fullScreenButton.height = 40;
    fullScreenButton.width = 40;
    
    //-------------------------------
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    bullet = game.add.group();
    bullet.createMultiple(1, 'bullet', 0, false);
    nextFire = game.time.now + fireRate;
    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(bullet, platforms);
    game.physics.arcade.collide(toads, platforms);
    game.physics.arcade.overlap(bullet,toads,collectStar,null, this);

    //  Checks to see if the player overlaps with any of the stars,
    //  if he does call the collectStar function
    game.physics.arcade.overlap(player, toads, actionOnClick, null,
        this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    
    //projectile shoot ---------------------------------
    //bulletNumberpic = game.add.image(0,550,'bullet');
    if (spacebar.isDown){
        //function shoot here ------------------------------
        shotYouProjectile();
        
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}


function collectStar (bullet, toad) {
    
    // Removes the star from the screen
    toad.kill();
    bullet.kill();
    starCount = starCount - 1;
    
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
    
    //------------------------
    if(starCount === 0){
        startStar();
        
    }

}    
function shotYouProjectile() {
    
    
if (game.time.now > nextFire) {
    nextFire = game.time.now + fireRate;
    var bullets = bullet.getFirstExists(false);
    if (bullets){
            bullets.height = 32;
            bullets.width = 32;
                
            bulletCount= bulletCount + 1;
            bulletcount.text = 'Bullet Count: ' + bulletCount;
            bullets.exists = true;
	        bullets.anchor.setTo(.5,.5);
            bullets.lifespan = 800;
            bullets.reset(player.body.position.x+20,            
                          player.body.position.y-20);
	        game.physics.arcade.enable(bullets);
	        bullets.body.velocity.y = -800;
	        bullets.body.angularVelocity = 0;
      }
    }
	
}



//----------------------------------------
function createplayer(grp, x, y, ss, mv) {
    	
    var f = grp.create(x, y, ss);
	game.physics.enable(f, Phaser.Physics.ARCADE);
    f.name = "prog";
    f.body.offset.x = 30;
    f.body.offset.y = 20;
    f.body.setSize(25, 25, 9);
    f.body.linearDamping = 1;
    f.body.collideWorldBounds = true;
    f.falling = false;
    f.immune = false;
    f.health = 3;
        
    f.animations.add("left", [0, 1, 2], 10, true);
    f.animations.add("right", [3, 4, 5], 10, true);
    return f;
        
}