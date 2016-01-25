
BeastBoy = function(game, pngId)
{
    this.game = game;
    
    Phaser.Sprite.call(this, game, 0,  0, pngId);
    
    game.add.existing(this);
    
    game.physics.arcade.enable(this);
    this.anchor.setTo(0, 0.5);
    this.scale.setTo(game.dpr, game.dpr);
    this.body.velocity.setTo(0, 1800);
    this.transformTween = game.add.tween(this);
    this.transformTween.stop();
    
    this.swipe = new Swipe(this.game);
    
    this.currentBeastBoyForm = 0;
   // this.body.immovable = true;
};

BeastBoy.prototype = Object.create(Phaser.Sprite.prototype);
BeastBoy.prototype.constructor = BeastBoy;

BeastBoy.prototype.update = function()
{
    if(this.game.input.activePointer.isDown)
    {
        console.log("mouseDown");
    }
    
    direction = this.swipe.check();
    if(direction != null)
    {
        this.body.moves = true;
        switch(direction.direction)    
        {
            case this.swipe.DIRECTION_UP: 
                this.body.velocity.setTo(0, -1800);
                this.scale.setTo(this.game.dpr, this.game.dpr);
                this.currentBeastBoyForm = 1;
                break;
                
            case this.swipe.DIRECTION_DOWN:
                this.body.velocity.setTo(0, 1800);
                this.scale.setTo(this.game.dpr, this.game.dpr);
                this.currentBeastBoyForm = 0;
                break;
            case this.swipe.DIRECTION_RIGHT:
                
                this.scale.setTo(this.game.dpr * 3, this.game.dpr * 3);
                this.position.setTo(0, this.game.world.height * 0.5);
                if(this.body.velocity.y < 0)
                {
                    this.body.velocity.setTo(0, 1800);
                }
                this.currentBeastBoyForm = 2;
                break;
        }
    }
    
};


Obstacles = function(game)
{
    this.game = game;
    Phaser.Group.call(this, game, game.world, 'Obstacles', false, true, Phaser.Physics.ARCADE);
    this.obstacleTimer = 0;
    
    game.add.existing(this);
    
};



Obstacles.prototype = Object.create(Phaser.Group.prototype);
Obstacles.prototype.constructor = Obstacles;

Obstacles.prototype.update = function()
{
    
    if(this.obstacleTimer > 3)
    {
        this.addObstacle();
        
        this.obstacleTimer = 0;
    }
    this.obstacleTimer += this.game.time.physicsElapsed;
};


Obstacles.prototype.addObstacle  = function()
{
    
    randomId = this.game.rnd.integerInRange(0, 2);
    heightPer = 1;
    scaleY = this.game.world.height ;
    scaleX = 10;
    anchorY = 1;
    switch(randomId)
    {
        case 0: // GH: low wall 
            heightPer = 0.2;
            anchorY = 0;
            break;
        case 1: // GH: High wall
            heightPer = 0.78;
            break;
        case 2: // GH: all cover wall
            scaleY += 20;
            heightPer = 1;
            scaleX += 10;
            break;
            
    };
    
    obs = this.create(this.game.world.width * 1.1, this.game.world.height * heightPer, 'wall');
    obs.scale.setTo(scaleX, scaleY);
    obs.anchor.setTo(0, anchorY);
    obs.body.velocity.set(-600, 0);
    obs.obstacleID = randomId;
    this.add(obs);
};

/* jshint browser:true */
// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function (game) {
    this.game = game;
};



// set Game function prototype
BasicGame.Game.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       // this.scale.setScreenSize(true);
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

    },

    preload: function () {

        // Here we load the assets required for our preloader (in this case a 
        // background and a loading bar)
        this.load.image('logo', 'asset/phaser.png');
        this.load.image('base_beastboy', 'asset/base_beastboy.png');
        this.load.image('wall', 'asset/wall.png');
    },

    create: function () {
        // Add logo to the center of the stage
        this.beastBoy = new BeastBoy(this.game, 'base_beastboy');
        this.obstacles = new Obstacles(this.game);
        this.worldBounds = this.game.add.physicsGroup();
        
         
        ceil = this.worldBounds.create(0, 0, 'wall');
        ceil.scale.setTo(1000, 40) ;
        ceil.body.moves = false;

        floor = this.worldBounds.create( 0, this.game.world.height - 40, 'wall');
        floor.scale.setTo(1000, 40) ;
        floor.body.moves = false;
        
        this.worldBounds.add(ceil);this.worldBounds.add(floor);
        
        //this.game.physics.arcade.gravity.y = 250;
        //this.beastBoy.body.collides(this.obstacleCollHandler, this.obstacles, this);
    },
    
    update: function()
    {
        if(this.beastBoy != null)   
        {
            this.game.physics.arcade.collide(this.beastBoy, this.worldBounds, this.collHandler, this.procHandler, this);
            this.game.physics.arcade.collide(this.beastBoy, this.obstacles, this.obstacleCollHandler, this.preObstacleCollHandler, this);
        }
    },
    
    obstacleCollHandler :function(a, b)
    {
      
    },
    
       
    preObstacleCollHandler :function(a, b)
    {
     
        if(a == null)
            return false;
        console.log("endresult: " +b.obstacleID == a.currentBeastBoyForm);
        console.log("b data: " + b.obstacleID);
        console.log("a data: " + a.currentBeastBoyForm);
        if(a.currentBeastBoyForm == 2 && a.currentBeastBoyForm == b.obstacleID)   
        {
            b.body.enabled = false;
            b.kill();
            a.body.velocity.setTo(0, 0);
            a.position.x = 0;
            this.obstacles.remove(b);
        }
        else
        {
            a.kill();
         //   this.remove(a);
            this.beastBoy = null;
            return false;
        }
        
        return true;
    },
    
   
    procHandler :function(a, b)
    {
        return true;
    },
    
    collHandler :function(a, b)
    {
        
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    }

};