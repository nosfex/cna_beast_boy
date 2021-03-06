
BeastBoy = function(game, container, pngId)
{
    this.game = game;
    this.container = container;
    
    Phaser.Sprite.call(this, game, 100,  game.world.height * 0.5, pngId);
    game.add.existing(this);
    game.physics.arcade.enable(this);
    var ratio = this.container.getRatio(window.innerWidth, window.innerHeight, 'all');
    this.anchor.setTo(0, 0.5);
    this.scale.setTo(ratio.x *0.5, ratio.y *0.5);
    this.body.velocity.setTo(0, 1800);
    this.transformTween = game.add.tween(this);
    this.transformTween.stop();
    
    this.currentBeastBoyForm = -1;
    this.health = this.maxHealth = 1;
    
    this.blinking           = false;
    this.maxBlink           = 1;
    this.curBlink           = 0;
    this.ready              = true;
    this.metersRanTotal     = 0;
    this.metersRan          = 0;
    this.speedStage         = 0;
    this.position.x         = 100;
    
    this.animations.add('run', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
    this.animations.play('run', 30, true);
    this.body.setSize(200, 300, this.width / 4 , -25);
};

BeastBoy.prototype = Object.create(Phaser.Sprite.prototype);
BeastBoy.prototype.constructor = BeastBoy;

BeastBoy.prototype.update = function()
{
    var ratio = this.container.getRatio(window.innerWidth, window.innerHeight, 'all');
    if(this.health <= 0)
    {
        return;
    }
    
    if(this.blinking)
    {
        if(this.curBlink >= this.maxBlink)
        {
            this.curBlink   = 0 ;
            this.blinking   = false;
            this.visible    = true;
            this.ready      = true;
            
            this.position.setTo(100, this.game.world.height* 0.5);
            this.body.velocity.setTo(0, 1800);
            this.loadTexture('beastboy_walk');
            this.animations.add('run', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
            this.animations.play('run', 30, true);
            this.body.setSize(200, 300, this.width / 8, -25);
            this.scale.setTo(ratio.x * 0.5, ratio.y * 0.5) ;
            this.currentBeastBoyForm = -1;
        }
        else
        {
            this.visible = !this.visible;
            this.curBlink += this.game.time.physicsElapsed;
            return;
        }
    }
    if(this.game.input.activePointer.isDown && this.ready)
    {
        console.log("mouseDownY: " + this.game.input.activePointer.y);
        direction = "";
        if(this.game.input.activePointer.y < this.game.world.height * 0.3)
        {
            direction = "UP";
        } 
        if(this.game.input.activePointer.y > this.game.world.height * 0.3 && this.game.input.activePointer.y < this.game.world.height * 0.6)
        {
            direction = "CENTER";
        }
        if(this.game.input.activePointer.y > this.game.world.height * 0.6 && this.game.input.activePointer.y <= this.game.world.height )
        {
            direction = "DOWN";
        }
        
        xplYOffset = 0;
        xplXOffset = 0;
        switch(direction)    
        {
            case "UP": 
                this.body.velocity.setTo(0, -2200);
                this.scale.setTo(ratio.x * 0.5, ratio.y * 0.5) ;
                //this.position.setTo(100, this.game.world.height * 0.5);
                this.currentBeastBoyForm = 1;
                this.loadTexture('bat_boy');
                this.animations.add('run_bat', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]);
                this.animations.play('run_bat', 30, true);
                this.body.setSize(200, 200, -100 + this.width / 2, 0);
                xplXOffset = -this.body.width * 0.5;
                xplYOffset = -this.body.height * 0.5;
                
                break;
                
            case "DOWN":
                this.body.velocity.setTo(0, 2200);
                this.scale.setTo(ratio.x * 0.5, ratio.y * 0.5);
                this.currentBeastBoyForm = 0;
                this.position.setTo(100, this.game.world.height * 0.5);
                this.loadTexture('snake_walk');
                this.animations.add('run_snake', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]);
                this.animations.play('run_snake', 30, true);
                this.body.setSize(this.width, 50, this.width / 4, this.height * 0.3);
                break;
          
            case "CENTER":
                this.scale.setTo(ratio.x, ratio.y);
                this.position.setTo(100, this.game.world.height * 0.5);
                if(this.body.velocity.y < 0)
                {
                    this.body.velocity.setTo(0, 2200);
                }
                this.currentBeastBoyForm = 2;
                this.loadTexture('monkey_walk');
                this.animations.add('run_monkey', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]);
                this.animations.play('run_monkey', 30, true);
                this.body.setSize(200, 200, -130 + this.width / 2,0);
                break;
        }
        
        this.explosion.visible = true;
        this.explosion.animations.play('run', 15, false);
        this.explosion.x = this.body.x + xplXOffset;
        this.explosion.y = this.body.y + xplYOffset;
        this.explosion.animations.currentAnim.onComplete.add(function()
        {
            this.visible = false;
        }, this.explosion);
    }
 
    if(this.ready)
    {
        this.metersRanTotal += (10) * this.game.time.physicsElapsed;
        this.metersRan = this.metersRanTotal;
        if(this.metersRan >= 50  )
        {
            this.speedStage += 1;
            this.metersRan = 0;
        }
    }
};

BeastBoy.prototype.startBlinking = function()
{
    this.blinking = true;
};


Obstacles = function(game)
{
    this.game = game;
    Phaser.Group.call(this, game, game.world, 'Obstacles', false, true, Phaser.Physics.ARCADE);
    this.obstacleTimer = 0;
    
    game.add.existing(this);
    
    this.obsMaxTimer = 1.8;
    this.obstacleSequence = [];
};

Obstacles.prototype = Object.create(Phaser.Group.prototype);
Obstacles.prototype.constructor = Obstacles;

Obstacles.prototype.update = function()
{
    if(this.obstacleTimer > this.obsMaxTimer)
    {
        this.addObstacle();
        
        this.obstacleTimer = 0;
    }
    if(this.stop === false)
    {
        this.obstacleTimer += this.game.time.physicsElapsed;
    }
    else
    {
        this.obstacleTimer = 0;
    }
    
    this.forEach(function(obj)
    {
        if(obj.position.x <= obj.game.world.width * 0.7)
        {
            obj.game.showInBanner(obj.obstacleID, true);
        }
        
        if(obj.position.x <= obj.game.world.width * 0.5)
        {
            obj.game.showInBanner(obj.obstacleID, false);
        }
    });
};


Obstacles.prototype.addObstacle = function()
{
    
    if(this.stop === true)
        return;
    
    var ratio = this.game.getRatio(window.innerWidth, window.innerHeight, 'all');
    
    randomId = this.game.rnd.integerInRange(0, 2);
    heightPer = 1;
    scaleY = this.game.world.height ;
    scaleX = 10;
    anchorY = 1;
    obsSize = this.obstacleSequence.length;
    if(obsSize > 2)
    {
        while(this.obstacleSequence[obsSize - 2] == randomId && this.obstacleSequence[obsSize -1] == randomId)
        {
            randomId = this.game.rnd.integerInRange(0, 2);
        }
    }
        
    asset = 'wall';
    switch(randomId)
    {
        case 0: // GH: low wall 
            scaleY = this.game.world.height * 0.5;
            heightPer = 0;
            anchorY = 0;
            asset = 'wall_bottom';
            break;
        case 1: // GH: High wall
            scaleY = this.game.world.height * 0.1;
            heightPer = 0.2;
            asset = 'wall_top';
            break;
        case 2: // GH: all cover wall
            asset = 'wall_full';
            scaleY = this.game.world.height * 0.2;
            heightPer = 0;
            scaleX += 10;
            break;
            
    }

    obs = this.game.add.sprite(this.game.world.width * 1.1,  scaleY , asset);
    obs.game = this.game;
    this.add(obs);
   
    obs.body.velocity.set(-500, 0);
    obs.scale.setTo(ratio.x * 0.5, (heightPer + ratio.y) * 0.5);
    obs.obstacleID = randomId;
    obs.body.allowGravity = false;
    this.obsMaxTimer = 1.3;
    this.obstacleSequence.push(randomId);
    this.uiMarker.addMarker(obs);
  
    return obs;
};

Obstacles.prototype.forceStop = function(val)
{
    this.stop = val;
};

UIMarkers = function(game)
{
    Phaser.Group.call(this, game);
    this.game = game;
    this.currentMarker = 0;
    this.maxMarker = 10;
};

UIMarkers.prototype = Object.create(Phaser.Group.prototype);
UIMarkers.prototype.constructor = UIMarkers;

UIMarkers.prototype.addMarker = function(owner)
{
    if(this.currentMarker >= this.maxMarker)
        return;
    img = '';
    yOffset = 0;
    switch(owner.obstacleID)
    {
        case 0:
            img = 'flying';
           // yOffset = 100;
            break;
        case 1:
            
            img = 'land';
            yOffset = -owner.body.height * 0.75;
            break;
        case 2:
            img = 'monkey';
            break;
    }
    marker = this.game.add.sprite(owner.x - owner.body.width * 0.5, owner.y - owner.body.height * 0.15 + yOffset, img );
    marker.owner = owner;
    marker.yOffset = yOffset;
    marker.scale.setTo(0.125, 0.125);
    this.add(marker);
    this.currentMarker++;
};

UIMarkers.prototype.update = function()
{
    this.forEach( function(item)
        {
            item.x = item.owner.body.x - item.owner.body.width * 0.5;
            item.y = item.owner.body.y + item.owner.body.height + item.yOffset;//.yOffset;
        
            if(item.owner.enabled === false)
            {
                item.visible = false;
            }
        
            if(item.x <= 400)
            {
                item.visible = false;
            }
        });
};

Banner = function(game, x,y, pngId)
{
    Phaser.Sprite.call(this, game, x,  y, pngId);
    game.add.existing(this);
    
    this.game = game;
    this.tilt = false;
    this.shakeSkip = 0;
    this.shakeDirection = 3;
    this.shakeSkipMax = 0.0512;
    this.px = x;
    this.py = y;
};

Banner.prototype = Object.create(Phaser.Sprite.prototype);
Banner.prototype.constructor = Banner;


Banner.prototype.update = function()
{
    if(this.tilt)
    {
        if(this.shakeSkip >= this.shakeSkipMax)
        {
            this.position.x += this.shakeDirection ;
            this.shakeDirection *= -1;
            this.shakeSkip = 0;
        }
        this.shakeSkip += this.game.time.physicsElapsed;
    }
    else
    {
        this.position.setTo(this.px, this.py);
    }   
};

/* jshint browser:true */
// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function (game) 
{
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
        this.scale.minWidth = 568; // GH: CSS Size
        this.scale.minHeight = 300; // GH: CSS Size
        
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        
        this.scale.updateLayout(true);
        
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();
        
        this.input.addPointer();
        this.gameEnd = false;
        CNContentInterface.ready(this);
    },
    
    getRatio :function(w, h, type)
    {
        var scaleX = w / this.scale.minWidth;
        var scaleY = h / this.scale.minHeight ;
        var result = {x:1, y:1};
        switch(type)
        {
            case 'all':
                result.x = scaleX > scaleY ? scaleY : scaleX;
                result.y = scaleX > scaleY ? scaleY : scaleX;
                break;
            case 'fit':
                result.x = scaleX > scaleY ? scaleX : scaleY;
                result.y = scaleX > scaleY ? scaleX : scaleY;
                break;
            case 'fill':
                result.x = scaleX;
                result.y = scaleY;
                break;
        }
        
        return result;
    },
    
    propertiesForSegment:function(segmentIndex) 
    {
        if(this.gameEnd == true)
            return false;
        if (segmentIndex == 0) 
        {

            return {
                "duration": -1,
                "skippable": false,
                "hideProgressBar": true
            };
        }

        return false;
    },
    
    startSegment:function(segmentIndex, properties)
    {
        if (segmentIndex == 0) 
        {
            startGame();
        } 
        else if (segmentIndex == 1) 
        {
            showResults();
        }
    },
    
    
    
    
    

    preload: function ()
    {
        // GH: Banners
        this.load.image('monkey', 'asset/ui_monkey.png');
        this.load.image('flying', 'asset/ui_bat.png');
        this.load.image('land', 'asset/ui_snake.png');
        this.load.image('ui_beast', 'asset/ui_boy.png');
        // GH: Level
        this.load.image('bkg', 'asset/bkg_.png');
        this.load.image('top', 'asset/top_.png');
        this.load.image('bottom', 'asset/bottom.png');
        // GH; Level, obstacles
        this.load.image('wall_bottom', 'asset/wall_bottom.png');
        this.load.image('wall_full', 'asset/wall_full.png');
        this.load.image('wall_top', 'asset/wall_top.png');
        
        this.load.image('p_a', 'asset/particle_a.png');
        this.load.image('p_b', 'asset/particle_b.png');
        
        this.load.spritesheet('button', 'asset/button_sheet.png', 200, 200);
        this.load.spritesheet('bat_boy', 'asset/bat_boy2.png', 512, 384);
        this.load.spritesheet('monkey_punch', 'asset/monkey_punch.png', 512, 384);
        this.load.spritesheet('monkey_walk', 'asset/monkey_walk.png', 512, 384);
        this.load.spritesheet('snake_walk', 'asset/snake_walk.png', 512, 384);
        this.load.spritesheet('beastboy_walk', 'asset/beastboy_walk.png', 512, 384);   
        this.load.spritesheet('transform_xpl', 'asset/transform_explosion.png', 512, 481);
        this.load.audio('beat', ['asset/jungle_beat.ogg']);
        
        console.log(window.devicePixelRatio + " DPR");
        console.log(this.game.dpr + " innerWidth / innerHeight");  
    },

    // GH: Banner indicators for where the player is expected to touch to transform
    createBanners :function()
    {
        var ratio = this.getRatio(window.innerWidth, window.innerHeight, 'all');
        // GH: Mid Banner
        this.monkeyBanner = new Banner(this, 0, this.game.world.height * 0.43, 'monkey');
        this.monkeyBanner.scale.setTo(ratio.x / 7, ratio.y / 7);
        
        // GH: Top Banner
        this.flyingBanner = new Banner(this, 0, this.game.world.height * 0.05, 'flying');
        this.flyingBanner.scale.setTo(ratio.x / 7, ratio.y / 7);
        
        
        // GH: Bot banner
        this.landBanner = new Banner(this, 0, this.game.world.height * 0.76, 'land');
        this.landBanner.scale.setTo(ratio.x / 7, ratio.y / 7);
    },
    
    create: function () 
    {
        var ratio = this.getRatio(window.innerWidth, window.innerHeight, 'all');
        console.log(window.innerWidth + " INNER BS " + window.innerHeight);
        console.log(ratio.x + " :x " + ratio.y + " :y");
 
        // GH: Background
        this.bkg = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bkg');
        this.bkg.autoScroll(-40,0);
        this.bkg.scale.setTo(ratio.x  * 1.5, ratio.y * 1.5);
   
        // GH: Beastboy + obstacles
        this.beastBoy = new BeastBoy(this.game, this, 'beastboy_walk');     
        this.obstacles = new Obstacles(this);
        this.worldBounds = this.game.add.physicsGroup();
       
        // GH: Ceil 
        ceil = this.add.tileSprite(0, -this.game.world.height * 0.15, this.game.world.width / this.game.dpr * 2, this.game.world.height * 0.69, 'top');
        ceil.autoScroll(-360, 0);
        ceil.scale.setTo(ratio.x / 2, ratio.y / 2) ;
        
        // GH: Metercount
        this.meterCount = this.add.text(this.game.world.width * 0.5, this.game.world.height * 0.1, 'METERS: ', {font:'50px lubalin', fill:'#FFFFFF', stroke:'#FFFFFF', strokeThickness:0});
        this.meterCount.anchor.setTo(0.5, 0.5);
                
        // GH: Floor
        floor = this.add.tileSprite( 0, this.game.world.height * 0.68, this.game.world.width / this.game.dpr * 2, this.game.world.height , 'bottom');
        floor.autoScroll(-360, 0);
        floor.scale.setTo(ratio.x / 2,  ratio.y / 2 );
        
        // GH: Adding stuff to the ceil + floor
        this.worldBounds.add(ceil);
        ceil.body.setSize(this.game.world.width, ceil.height * 0.9, 0 , 50);
        ceil.body.moves = false;
        this.worldBounds.add(floor);
        ceil.body.moves = false;
        floor.body.moves = false;
        this.ceil = ceil;
        // GH: Banners creation
        this.createBanners();
    
        // GH: Life container UI
        this.lifeContainer = [];
        this.lifeIdx = 0;
        for(i = 0; i < this.beastBoy.health ; i++)
        {
            this.lifeContainer.push(this.game.add.sprite(this.game.world.width * 0.75 + (i * 100), this.game.world.height * 0.93, 'ui_beast' ));
            this.lifeContainer[i].anchor.setTo(0.5, 0.5);
            this.lifeContainer[i].scale.setTo(ratio.x / 8 , ratio.y / 8 );
        }
        
        this.emitter = this.game.add.emitter(0, 0, 50);
        this.emitter.maxParticleSpeed.x = 2000;
        this.emitter.minParticleSpeed.x = 2000;
        this.emitter.gravity = 500;
        this.emitter.makeParticles(['p_a', 'p_b']);
        this.beastBoy.emitter = this.emitter;
        
        this.uiMarker = new UIMarkers(this);
        this.obstacles.uiMarker = this.uiMarker;
        
        this.explosion = this.game.add.sprite(this.beastBoy.x, this.beastBoy.y, 'transform_xpl');
        this.beastBoy.explosion = this.explosion;
        this.explosion.animations.add('run',[0,1,2,3,4,5,6]);
        this.explosion.visible = false;
        
        this.music = this.add.audio('beat');
        this.music.loopFull(1);
    },
    
    update: function()
    {
        // GH: Collisions
        if(this.beastBoy !== null)   
        {
            this.game.physics.arcade.collide(this.beastBoy, this.worldBounds, this.collHandler, this.procHandler, this);
            this.game.physics.arcade.collide(this.beastBoy, this.obstacles, this.obstacleCollHandler, this.preObstacleCollHandler, this);
        }
        
        // GH: User is ready, keep moving stuff
        if(this.beastBoy.ready === true)
        {
            this.obstacles.forceStop(false);
            this.obstacles.forEach(function(item)
            {
                if(item.body.velocity.x >= 0)
                {
                    item.body.velocity.x = -1000;    
                }
            });
        }
        // GH: Game was paused
        else
        {
            this.obstacles.forEach(function(item)
            {
                item.body.velocity.x = 0;    
            });
            this.beastBoy.speedStage = 0;
        }
        
        this.meterCount.text = 'METERS: ' + Math.floor(this.beastBoy.metersRanTotal) ;
        
        if(this.beastBoy.ready)
        {
            this.bkg.autoScroll(-40,0);
            this.worldBounds.forEach(function(item)
                                     {item.autoScroll(-360,0);}
                                    );
        }
    },
    
    render :function()
    {
        //this.game.debug.body(this.beastBoy);
        //this.game.debug.body(this.ceil);
    },
    
    obstacleCollHandler :function(a, b)
    {
    },
       
    preObstacleCollHandler :function(a, b)
    { 
        if(a === null)
            return false;
     
        // GH: Monkey punch
        if(a.currentBeastBoyForm == 2 && a.currentBeastBoyForm == b.obstacleID)   
        {
            this.bkg.autoScroll(0,0);
            this.worldBounds.forEach(function(item)          {item.autoScroll(0,0);});
            a.position.x = 100;
         //   this.obstacles.remove(b);
            a.obstacleKeep = b;
            a.game = this.game;
            this.obstacles.forceStop(true);
            if(a.ready)
            {
                a.loadTexture('monkey_punch');
                a.animations.add('punch_monkey', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
                a.animations.play('punch_monkey', 30, false);
                a.ready = false;
                a.animations.currentAnim.onComplete.add(
                function() { 
                    this.loadTexture('monkey_walk');
                    this.animations.add('run_monkey', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]);
                    this.animations.play('run_monkey', 30, true);
                    this.obstacleKeep.enabled = false;
                    this.obstacleKeep.kill();
                    //this.game.obstacles.remove(this.obstacleKeep);
                    this.ready = true;
                    
                    this.emitter.x = this.obstacleKeep.x;
                    this.emitter.y = this.obstacleKeep.y + this.obstacleKeep.height / 2;
                    this.emitter.start(true, 2000, null, 5);
                    
                    } , a);
            }
            
            return false;
        }
        else
        {
            // GH: User colission, stop everything
            this.obstacles.forceStop(true);
            // GH: take a life out
            a.health--;
           
            // GH: update the UI
            if(this.lifeIdx < this.lifeContainer.length)
            {
                
                this.lifeContainer[this.lifeIdx].visible = false;
                this.lifeIdx++;
            }
            // GH: User is not ready
            a.ready = false;
            
            // GH: kill the user
            if(a.health <= 0)
            {
                var ratio = this.getRatio(window.innerWidth, window.innerHeight, 'all');
                // GH: exit App? restart it?
                text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.5, 'GAME OVER', {font:"30pt lubalin", fill:"#FF00FF", stroke:"#000000", strokeThickness:2});
                text.scale.setTo(ratio.x * 0.5, ratio.y * 0.5);
                text.anchor.setTo(0.5, 0.5);
                
                button = this.game.add.button(this.game.world.width * 0.5, this.game.world.height * 0.8, 'button', this.resetOnClick, this, 0,1,2);
                button.scale.setTo(ratio.x * 0.5, ratio.y * 0.5);
                button.anchor.setTo(0.5, 0.5);
                this.bkg.autoScroll(0,0);
                this.worldBounds.forEach(function(item)
                                     {item.autoScroll(0,0);}
                                    );
            }
            // GH: user not dead, restarting
            else
            {
                this.bkg.autoScroll(0,0);
                this.worldBounds.forEach(function(item)
                                     {item.autoScroll(0,0);}
                                    );
                b.body.enabled = false;
                b.kill();
                this.obstacles.remove(b);
                a.startBlinking();
            }
            return false;
        }
        
        return true;
    },
    
    showInBanner : function(id, val)
    {
        switch(id)    
        {
            case 0: //'flying'
                this.flyingBanner.tilt = val;   
                break;
            case 1: //'land'
                this.landBanner.tilt = val;
                break;
            case 2: //'middle'
                this.monkeyBanner.tilt = val;
                break;
        }
    },
    
    resetOnClick :function()
    {
//        this.game.state.start('Game');    
        this.gameEnd = true;
        CNContentInterface.startNextSegment();
    },
    
   
    procHandler :function(a, b)
    {
        return true;
    },
    
    collHandler :function(a, b)
    {        
    },
    
    pause: function()
    {
        this.paused = true;  
    },
    
    resume: function()
    {
        this.paused = false;  
    },

};