var socket = io.connect('http://10.240.96.69:3000');
socket.on('code', function (code) {
    console.log('Received code' + code);
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
socket.on('map', function (data) {
    //The map as an object
    // data.playerY
    // data.map2D
});
socket.on('status', function (data) {
    if (data == 'gameover') {
        //the game is over
    }
});

function joinGame(code) {
    socket.emit('join', code);
}

document.addEventListener("keypress", function (event) {
    socket.emit('keyPress', event.keyCode);
});