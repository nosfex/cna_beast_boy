
BeastBoy = function(game, pngId)
{
    this.game = game;
    
    Phaser.Sprite.call(this, game, 0,  0, pngId);
    
    game.add.existing(this);
    
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(game.dpr, game.dpr);
    this.body.velocity.setTo(0, 300);
    this.transformTween = game.add.tween(this);
    this.transformTween.stop();
    

};

BeastBoy.prototype = Object.create(Phaser.Sprite.prototype);
BeastBoy.prototype.constructor = BeastBoy;

BeastBoy.prototype.update = function()
{
    if(this.game.input.activePointer.isDown)
    {
        console.log("mouseDown");
        if(this.transformTween.isRunning == false)
        {
            if(this.game.input.y < this.game.world.height / 2)
            {
                
                console.log("going up");
                this.transformTween.to({y:this.game.world.height * .1}, 30);
                this.transformTween.start();
            }
            
            else if(this.game.input.y > this.game.world.height / 2)
            {
                console.log("going down");
                this.transformTween.to({y:this.game.world.height * .9}, 30);
                this.transformTween.start();
            }
        }
    }
};


WorldBounds = function(game)
{
    Phaser.Group.call(this, game, game.world, 'WorldBounds', false, true, Phaser.Physics.ARCADE);
    
   
    return this;
};

WorldBounds.prototype = Object.create(Phaser.Group.prototype);
WorldBounds.prototype.constructor = WorldBounds;


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
        this.worldBounds = this.game.add.physicsGroup();
        
         
        ceil = this.worldBounds.create(0, 0, 'wall');
        ceil.scale.setTo(1000, 2) ;
        ceil.body.moves = false;

        floor = this.worldBounds.create( 0, this.game.world.height * 0.9, 'wall');
        floor.scale.setTo(1000, 2) ;
        floor.body.moves = false;
        
        this.worldBounds.add(ceil);this.worldBounds.add(floor);
        //this.game.physics.arcade.gravity.y = 250;
       
    },
    
    update: function()
    {
        console.log("concha de dios");
        this.game.physics.arcade.collide(this.beastBoy, this.worldBounds, this.collHandler, this.procHandler, this);
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