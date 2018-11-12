var MAP_WIDTH = 11;
var MAP_HEIGHT = 11;
var MAX_SNAKE = MAP_WIDTH * MAP_HEIGHT;

var Cell = {
    EMPTY: 1,
    BLOCK: 2
}

function idxToCoords(index) {
    return [index % MAP_WIDTH, Math.floor(index / MAP_WIDTH)];
}

function coordsToIdx(x, y) {
    return (y * MAP_WIDTH) + x;
}

function translate(index, dx, dy) {
    return 0;
}

function move(index, direction) {
    return 0;
}
