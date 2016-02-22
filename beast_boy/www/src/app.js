(function () {
    /* globals Phaser:false, BasicGame:false */
    //  Create your Phaser game and inject it into the game div.
    //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
    //  We're using a game size of 640 x 480 here, but you can use whatever you feel makes sense for your game of course.
    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;
    var ratio = innerWidth / innerHeight;
    
    var game = new Phaser.Game(Math.ceil(innerWidth*window.devicePixelRatio), innerHeight * window.devicePixelRatio, Phaser.AUTO, 'game');

    game.dpr = ratio;
        
    //  Add the States your game has.
    //  You don't have to do this in the html, it could be done in your Game state too, but for simplicity I'll keep it here.
    game.state.add('Game', BasicGame.Game);

    //  Now start the Game state.
    game.state.start('Game');

})();