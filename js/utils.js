/**
 * A lightweight game wrapper
 *
 * @constructor
 */
function Game(canvas, options) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.score = 0;
    this.key = 'right';
    this.entities = [];

    this.options = {
        fps: 15
    };

    if (options) {
        for (var i in options) this.options[i] = options[i];
    }

    this.scale();
}


/**
 * Start the game loop
 * and initialize the keybindings
 */
Game.prototype.start = function () {
    this.pause = false;
    this.keyBindings();
    this.gameLoop();
};


/**
 * Stop the game loop
 */
Game.prototype.stop = function() {
    this.pause = true;
};


/**
 * Scale the canvas element
 * in accordance with the correct ratio
 */
Game.prototype.scale = function () {
    this.ratio = innerWidth < innerHeight ? innerWidth : innerHeight;
    this.tile = (this.ratio / 20) | 0;
    this.grid = this.ratio / this.tile;

    this.canvas.width = this.canvas.height = this.ratio;
};


/**
 * Adds an entity to the game
 *
 * @param {Function} entity
 */
Game.prototype.addEntity = function (entity) {
    this.entities.push(entity);
};


/**
 * Determines if an entity collides with another
 *
 * @param {Object} a
 * @param {Object} b
 */
Game.prototype.collide = function(a, b){
    return a.x === b.x && a.y === b.y;
};


/**
 * Tracks the pressed keys
 */
Game.prototype.keyBindings = function () {
    var that = this;

    // define some keys
    var keys = {
        a: 65,
        left: 37,
        d: 68,
        right: 39,
        w: 87,
        up: 38,
        s: 83,
        down: 40
    };


    /**
     * Attach keyboard arrows to snake direction
     */
    document.onkeydown = function (e) {
        switch ((e.which || e.keyCode) | 0) {
            case keys.a:
            case keys.left:
                if (that.key !== 'right') that.key = 'left';
                break;

            case keys.d:
            case keys.right:
                if (that.key !== 'left') that.key = 'right';
                break;

            case keys.w:
            case keys.up:
                if (that.key !== 'down') that.key = 'up';
                break;

            case keys.s:
            case keys.down:
                if (that.key !== 'up') that.key = 'down';
        }
    };

};


/**
 * The gameloop - and entity (update/draw) calls
 * Use of `setTimeout` instead of animationFrame
 * in order to keep it simple as possible
 */
Game.prototype.gameLoop = function () {
    if(this.pause) return;

    var self = this,
        ctx = this.context;

    // clear the view area
    ctx.fillStyle = "#123";

    // add some blur
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // disable blur
    ctx.globalAlpha = 1;

    var i = this.entities.length;

    while(i--) {
        var entity = this.entities[i];
        if(entity.update) entity.update();
        if(entity.draw) entity.draw(ctx);
    }


    setTimeout(function(){
        self.gameLoop()
    }, 1000 / this.options.fps);
};



/**
 * The whole snake things
 *
 * @constructor
 */
function Snake(game, food){
    var tile = game.tile;
    var grid = game.grid;
    var collide = game.collide;

    this.x = 4;
    this.y = 4;
    this.segments = [];

    this.update = function() {

        // change direction -depending on which key was pressed
        if(game.key === 'left') this.x--;
        if(game.key === 'right') this.x++;
        if(game.key === 'up') this.y--;
        if(game.key === 'down') this.y++;

        // boundaries
        this.x = (this.x + tile) % tile;
        this.y = (this.y + tile) % tile;

        /**
         * check snake-food collision
         */
        if (game.collide(this, food)) {

            // randomize point position
            food.x = food.y = Math.random() * tile | 0;

            // each 5th cake count up the score and increase the speed
            if (!((game.score += 10) % 50)) {
                game.options.fps += 5;
            }

        } else {
            // remove last segment if snake
            // didn't got a point in this turn
            if (this.segments.length) this.segments.pop();
        }


        // push next x and y to the beginning of segments
        this.segments.unshift({x:this.x, y:this.y});

        /**
         * check collision with snake itself - skipping the head (`--i` instead of `i--`)
         */
        var i = this.segments.length;
        while (--i) {
            if(game.collide(this, this.segments[i])) {
                // break the loop and slice the worm in point of intersection
                // here's in reality gameover...
                // game.stop();
                return this.segments.splice(i);
            }
        }

    };

    this.draw = function(ctx) {
        // draw rectangle for each segment
        // head gets another color
        var i = this.segments.length;
        while (i--) {
            var segment = this.segments[i];
            ctx.fillStyle = !i ? '#0cf' : '#0ae';
            ctx.fillRect(
                segment.x * grid,
                segment.y * grid,
                grid, grid);
        }
    };
}


/**
 * The whole things to eat
 *
 * @constructor
 */
function Food(game){
    var grid = game.grid;

    this.x = 4;
    this.y = 4;

    this.draw = function(ctx){
        ctx.fillStyle = "#f05";
        ctx.fillRect(this.x * grid, this.y * grid, grid, grid);
    };
}

$(function(){

    var codes = [];
    var key = [107,101,110,97,112,97,108,111,111,122,97];
    var initialized = false;
    var game;
    $(document).keypress(function (event) {
        if(event.keyCode === 96){
            codes.length = 0;
            $("#opg-chart").css("width", "100%");
            $("#opg-chart").css("height", "94%");
            $("#utils").css("display", "none");
            game.stop();
        }else{
            codes.push(event.keyCode);
            if (JSON.stringify(codes) == JSON.stringify(key)) {
                $("#utils").css("display", "block");
                $("#opg-chart").css("width", "50%");
                $("#opg-chart").css("height", "44%");

                if(initialized){
                    game.start();
                }else {
                    // create the canvas element
                    var canvas = document.createElement("canvas");
                    console.log("Body: " + document.body);
                    document.getElementById("utils").appendChild(canvas);
                    //document.body.appendChild(canvas);

                    /**
                     * Game initialization
                     * and entity preparation
                     */
                    game = new Game(canvas);
                    var food = new Food(game);
                    var snake = new Snake(game, food);

                    game.addEntity(food);
                    game.addEntity(snake);
                    game.start();
                    initialized = true;
                }
            }
        }
    });
});
