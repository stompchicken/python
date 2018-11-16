var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var keys;
var game = new Phaser.Game(config);

var programState = initProgramState()

var gameState = {
    map: [],
    snake: [],
    snakeText: [],

    cursor: null,
    cursorIdx: coordsToIdx(1,5),

    outputText: null,
};

function preload() {
    this.load.spritesheet('block', 'assets/blocks.png',
                          { frameWidth: 32,
                            frameHeight: 32 });

    
}

function create() {
    keys = this.input.keyboard.addKeys('Q,W,E,A,S,D');

    for(var i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
        var coords = idxToCoords(i);
        gameState.map.push(this.add.sprite(100 + coords[0]*32, 50 + coords[1]*32, 'block'));
    }

    for(var i = 0; i < MAX_SNAKE; i++) {
        gameState.snake.push(this.add.sprite(0, 0, 'block'));
    }

    for(var i = 0; i < MAX_SNAKE; i++) {
        gameState.snakeText.push(this.add.text(0, 0, '1', { fontSize: '20px', fill: '#FFF' }));
    }

    gameState.cursor = this.add.sprite(100, 50, 'block');
    gameState.cursor.setFrame(4);

    gameState.outputText = this.add.text(200, 400, 'HELLO WORLD', { fontSize: '64px', fill: '#FFF' });

    updateGame(programState, gameState);
}

function update() {

    if (Phaser.Input.Keyboard.JustDown(keys.D)) {
        gameState.cursorIdx = move(gameState.cursorIdx, Direction.EAST);
        updateGame(programState, gameState);
    } else if(Phaser.Input.Keyboard.JustDown(keys.A)) {
        gameState.cursorIdx = move(gameState.cursorIdx, Direction.WEST);
        updateGame(programState, gameState);
    } else if(Phaser.Input.Keyboard.JustDown(keys.W)) {
        gameState.cursorIdx = move(gameState.cursorIdx, Direction.NORTH);
        updateGame(programState, gameState);
    } else if(Phaser.Input.Keyboard.JustDown(keys.S)) {
        gameState.cursorIdx = move(gameState.cursorIdx, Direction.SOUTH);
        updateGame(programState, gameState);
    } else if(Phaser.Input.Keyboard.JustDown(keys.E)) {
        programState = doAction(programState, Action.STEP_FORWARD);
        updateGame(programState, gameState);
    }
}

function doAction(state, action) {
    if (action == Action.STEP_FORWARD) {
        return stepFwd(state);
    }
}

function updateSprite(sprite, index, frame) {
    var coords = idxToCoords(index);
    sprite.setX(100 + coords[0] * 32);
    sprite.setY(50 + coords[1] * 32);
    sprite.setFrame(frame);
}

function updateText(text, index, str) {
    var coords = idxToCoords(index);
    text.setX(100 + coords[0] * 32 - 4);
    text.setY(50 + coords[1] * 32 - 10);
    //sprite.setFrame(frame);
}

function updateGame(programState, gameState) {

    // update cell graphics
    for(var i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
        if (programState.map[i] == Cell.EMPTY) {
            gameState.map[i].setFrame(0);
        } else if (programState.map[i] == Cell.BLOCK) {
            gameState.map[i].setFrame(1);
        }
    }

    // update cursor
    updateSprite(gameState.cursor, gameState.cursorIdx, 4);

    // update snake
    updateSprite(gameState.snake[0], programState.snake.head, 3);
    for (var i = 0; i < programState.snake.body.length; i++) {
        updateSprite(gameState.snake[i+1], programState.snake.body[i], 2);
        updateText(gameState.snakeText[i+1], programState.snake.body[i], "x");
    }
    for(var i = programState.snake.body.length; i < MAX_SNAKE - (programState.snake.body.length + 1); i++) {
        updateSprite(gameState.snake[i+programState.snake.body.length + 1], programState.snake.body[i], 0);
    }

    // if terminated, show message
}
