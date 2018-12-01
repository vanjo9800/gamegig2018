var socket = io.connect('http://localhost:3000');
var userCode = "";
socket.on('code', function (code) {
    userCode = code;
});
socket.on('join', function (resp) {
    if (resp == -1) {
        console.log("The game room is full, or does not exist!")
    }
});
socket.on('startgame', function (data) {
    if (data == 1) {
        console.log("The game has successfully started.");
    }
});
var reqAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        setTimeout(callback, 1000 / 30);
    };
socket.on('map', function (data) {
    reqAnimationFrame(gameScreen(data.map, data.playerY, data.points, data.role));
});
socket.on('status', function (data) {
    if (data == 'gameover') {
        gameOverScreen();
    }
});

function joinGame(code) {
    console.log("Joining " + code);
    socket.emit('join', code);
}

function keyPress() {
    socket.emit('keyPress', 1);
}