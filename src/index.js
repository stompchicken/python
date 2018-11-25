var config = {
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var keys;
var game = new Phaser.Game(config);

var programState = initProgramState()

function createTile(scene) {
    return {
        sprite: scene.add.sprite(0, 0, 'block'),
        text: scene.add.text(0, 0, '', { fontSize: '20px', fill: '#FFF' }),
    }
}

function toHex(val) {
    hexVal = val.toString(16);
    hexVal = (hexVal.length == 1) ? "0" + hexVal : hexVal;
    return hexVal;
}

function updateTile(tile, index, frame, text) {
    var coords = idxToCoords(index);
    tile.sprite.setX(80 + coords[0] * 32);
    tile.sprite.setY(80 + coords[1] * 32);
    tile.sprite.setFrame(frame);

    if (text.length == 2) {
        tile.text.setX(80 + coords[0] * 32 - 12);
        tile.text.setY(80 + coords[1] * 32 - 12);
    } else {
        tile.text.setX(80 + coords[0] * 32 - 8);
        tile.text.setY(80 + coords[1] * 32 - 12);
    }

    tile.text.text = text;
}

var gameState = {
    map: [],
    snake: [],

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
        gameState.map.push(createTile(this));
    }

    for(var i = 0; i < MAX_SNAKE; i++) {
        gameState.snake.push(createTile(this));
    }

    gameState.cursor = createTile(this);

    gameState.outputText = this.add.text(10, 450, '> HELLO WORLD', { fontSize: '42px', fill: '#FFF' });

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

function updateGame(programState, gameState) {

    // update cell graphics
    for(var i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
        if (programState.map[i] == Cell.EMPTY) {
            updateTile(gameState.map[i], i, 0, "");
        } else if (programState.map[i] == Cell.BLOCK) {
            updateTile(gameState.map[i], i, 1, "");
        } else if (programState.map[i] == Cell.OP_ADD) {
            updateTile(gameState.map[i], i, 0, "+");
        } else if (programState.map[i] >= Cell.DATA) {
            updateTile(gameState.map[i], i, 0, toHex(programState.map[i] - Cell.DATA));
        }
    }

    // update cursor
    updateTile(gameState.cursor, gameState.cursorIdx, 4, "");

    // update head
    updateTile(gameState.snake[0], programState.snake.head, 3, "");

    // update body
    for (var i = 0; i < programState.snake.body.length; i++) {
        updateTile(gameState.snake[i+1], programState.snake.body[i], 2, toHex(programState.snake.stack[i]));
    }

    // update unusued body
    for(var i = programState.snake.body.length + 1; i < MAX_SNAKE - 1; i++) {
        updateTile(gameState.snake[i+1], 0, 0, "");
    }

    // if terminated, show message
    if (programState.terminated) {
        gameState.outputText.visible = true;
/*
        for(var i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
            gameState.map[i].alpha = 0.5;
        }

        for (var i = 0; i < MAX_SNAKE; i++) {
            gameState.snake[i].alpha = 0.5;
            gameState.snakeText[i].alpha = 0.5;
        }
*/

        gameState.snake[0].alpha = 0.25;
    } else {
        gameState.outputText.visible = false;
    }
}
