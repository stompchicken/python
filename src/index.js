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

var programState = {
    map: initMap(),
    cursor: [0, 0],
    snake: initSnake()

}

var gameState = {
    map: [],
    snake: [],

    cursor: null,
    cursorIdx: coordsToIdx(1,5),
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

    gameState.cursor = this.add.sprite(100, 50, 'block');
    gameState.cursor.setFrame(4);


    updateGame(programState, gameState);
}

var ACTION_NONE = 0;
var ACTION_STEP = 1;


function update() {

    if (Phaser.Input.Keyboard.JustDown(keys.D)) {
        gameState.cursorX = Math.min(gameState.cursorX + 1, MAP_WIDTH - 1);
        updateGame(programState, gameState);
    } else if(Phaser.Input.Keyboard.JustDown(keys.A)) {
        gameState.cursorX = Math.max(gameState.cursorX - 1, 0);
        updateGame(programState, gameState);
    } else if(Phaser.Input.Keyboard.JustDown(keys.W)) {
        gameState.cursorY = Math.max(gameState.cursorY - 1, 0);
        updateGame(programState, gameState);
    } else if(Phaser.Input.Keyboard.JustDown(keys.S)) {
        gameState.cursorY = Math.min(gameState.cursorY + 1, MAP_HEIGHT - 1);
        updateGame(programState, gameState);
    }

    var action = mapKeys();

    if (action != ACTION_NONE) {
        programState = doAction(programState, action);
        updateGame(programState, gameState);
    }


}

function mapKeys() {
    if (Phaser.Input.Keyboard.JustDown(keys.E)) {
        return ACTION_STEP;
    } else {
        return ACTION_NONE;
    }
}


function doAction(state, action) {
    if (action == ACTION_STEP) {
        return stepFwd(state);
    }
}

function updateSprite(sprite, index, frame) {
    var coords = idxToCoords(index);
    sprite.setX(100 + coords[0] * 32);
    sprite.setY(50 + coords[1] * 32);
    sprite.setFrame(frame);
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
    }

    for(var i = programState.snake.body.length; i < MAX_SNAKE - (programState.snake.body.length + 1); i++) {
        updateSprite(gameState.snake[i+programState.snake.body.length + 1], programState.snake.body[i], 0);
    }
}

function initMap() {
    var map = []
    for(var i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
        map.push(Cell.EMPTY);
    }

     // Initialise map
    for(var i = 0; i < MAP_WIDTH; i++) {
        map[coordsToIdx(i, 0)] = Cell.BLOCK;
        map[coordsToIdx(i, MAP_HEIGHT - 1)] = Cell.BLOCK;
    }

    for(var i = 0; i < MAP_HEIGHT; i++) {
        map[coordsToIdx(0, i)] = Cell.BLOCK;
        map[coordsToIdx(MAP_WIDTH - 1, i)] = Cell.BLOCK;
    }

    return map;
}

var DIRECTION_EAST = 0;

function initSnake() {
    return {
        head: coordsToIdx(2, 5),
        body: [coordsToIdx(1, 5)],
        direction: 0,
    }
}


function stepFwd(state) {
    headCoords = idxToCoords(state.snake.head)
    if (state.snake.direction == 0) {
        state.snake.head = coordsToIdx(headCoords[0] + 1, headCoords[1])
    }

    console.log(state.snake.head)

    return state;
}

function editCell(state, x, y, cell) {
    return state;
}
