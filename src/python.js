var MAP_WIDTH = 11;
var MAP_HEIGHT = 11;
var MAX_SNAKE = MAP_WIDTH * MAP_HEIGHT;

var Cell = {
    EMPTY: 1,
    BLOCK: 2
}

var Direction = {
    NORTH: 0,
    SOUTH: 1,
    EAST: 2,
    WEST: 3
}

var Action = {
    NONE: 0,
    STEP_FORWARD: 1,
    EDIT_CELL: 2
}

function idxToCoords(index) {
    return [index % MAP_WIDTH, Math.floor(index / MAP_WIDTH)];
}

function coordsToIdx(x, y) {
    return (y * MAP_WIDTH) + x;
}

function clamp(x, min, max) {
  return Math.min(Math.max(x, min), max);
}

function translate(index, dx, dy) {
    var coords = idxToCoords(index);
    coords[0] = clamp(coords[0] + dx, 0, MAP_WIDTH - 1);
    coords[1] = clamp(coords[1] + dy, 0, MAP_HEIGHT - 1);
    return coordsToIdx(coords[0], coords[1]);
}

function move(index, direction) {
    if (direction == Direction.NORTH) {
        return translate(index, 0, -1);
    } else if (direction == Direction.SOUTH) {
        return translate(index, 0, +1);
    } else if (direction == Direction.EAST) {
        return translate(index, +1, 0);
    } else if (direction == Direction.WEST) {
        return translate(index, -1, 0);
    } else {
        console.error("Unknown direction: "+direction)
    }
}

function turnLeft(direction) {
    if (direction == Direction.NORTH) {
        return Direction.WEST;
    } else if (direction == Direction.SOUTH) {
        return Direction.EAST;
    } else if (direction == Direction.EAST) {
        return Direction.NORTH;
    } else if (direction == Direction.WEST) {
        return Direction.SOUTH;
    } else {
        console.error("Unknown direction: "+direction)
    }
}

function initProgramState() {
    return {
        map: initMap(),
        cursor: [0, 0],
        snake: initSnake()
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

function initSnake() {
    return {
        head: coordsToIdx(2, 5),
        body: [],
        direction: Direction.EAST,
        terminated: false
    }
}


function stepFwd(state) {
    var direction = state.snake.direction;
    var newHead = move(state.snake.head, direction)
    if (state.map[newHead] == Cell.BLOCK) {
        direction = turnLeft(direction);
        newHead = move(state.snake.head, direction)
        if (state.map[newHead] == Cell.BLOCK) {
            state.terminated = true;
            return state;
        } else {
            state.snake.head = newHead;
            state.snake.direction = direction;
        }
    } else {
        state.snake.head = newHead;
    }

    //   var lastDirection = direction;
    //   for(var i = 0; i < state.snake.body.length; i++) {
    //       state.snake.body[i] = move(state.snake.body[i], lastDirection);
    //   }

    return state;
}


function editCell(state, x, y, cell) {
    return state;
}
