const python = require('./python.js');

test('State initialised properly', () => {
    var state = python.initState();
    expect(state.map.length).toBe(11*11);
});
