var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/connect.js', function (req, res) {
  res.sendFile(__dirname + '/connect.js');
});
app.get('/script.js', function (req, res) {
  res.sendFile(__dirname + '/script.js');
});

var socketsPlayers = [];
var socketsCodes = [];
var numberPlayers = [];
var playsIn = [];

var blockSize = 40;
var velIncrease = blockSize / 2 + blockSize / 4;
var mapCache = 10;
var screenHeight = 14;
var screenWidth = 25;

var heights = [],
  enemiesGeneral = [];
heights[0] = [0, 0, 0, -1, -1, 0, 0, 0];
enemiesGeneral[0] = [0, 0, 0, 0, 0, 0, 0, 0];
heights[1] = [0, 0, 0, -1, 1, 1, -1, 0, 0, 0];
enemiesGeneral[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
heights[2] = [0, 0, 0, -1, 0, 0, -1, 0, 0, 0];
enemiesGeneral[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
heights[3] = [0, 0, 0, -1, 1, 1, -1, 2, 2, 2, -1, 0];
enemiesGeneral[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
heights[4] = [0, 0, 0, 0, 0];
enemiesGeneral[4] = [0, 0, 1, 0, 0];
heights[5] = [0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0];
enemiesGeneral[5] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
var probheights = [0.2, 0.1, 0.1, 0.1, 0.3, 0.1];

function getRandomPattern() {
  var randomPattern = Math.random();
  var current = 0.0;
  for (var j = 0; j < probheights.length; j++) {
    if (randomPattern <= current + probheights[j]) {
      return j;
    }
    current += probheights[j];
  }
  return probheights.length - 1;
}

function Game(gameCode) {
  this.map = [];
  this.coins = [];
  this.enemies = [];
  this.gameOver = false;
  this.gameCode = gameCode;
  this.points = 0;
  this.position = {
    x: 0,
    y: 0
  };
  this.velocityY = 0;
  this.roles = [];
  this.stepsSinceLast = 0;
}

Game.prototype.cacheMap = function () {
  for (var i = 0; i <= mapCache; i++) {
    if (this.map[this.position.x - i] == undefined) {
      var newPattern = getRandomPattern();
      for (var j = 0; j < heights[newPattern].length; j++) {
        this.map[this.position.x - i - j] = heights[newPattern][j];
        this.coins[this.position.x - i - j] = Math.floor((Math.random() * this.stepsSinceLast) / 7);
        this.enemies[this.position.x - i - j] = enemiesGeneral[newPattern][j];
      }
    }
    if (this.map[this.position.x + i] == undefined) {
      var newPattern = getRandomPattern();
      for (var j = 0; j < heights[newPattern].length; j++) {
        this.map[this.position.x + i + j] = heights[newPattern][j];
        this.coins[this.position.x + i + j] = Math.floor((Math.random() * this.stepsSinceLast) / 7);
        this.enemies[this.position.x + i + j] = enemiesGeneral[newPattern][j];
      }
    }
  }
}

Game.prototype.sendPlayers = function (channel, data) {
  for (player of numberPlayers[this.gameCode]) {
    io.to(socketsPlayers[player]).emit(channel, data);
  }
}

Game.prototype.handlePlayer = function () {
  if (this.gameOver) {
    return;
  }
  this.cacheMap();
  if (this.position.y + blockSize > screenHeight * blockSize) {
    this.sendPlayers('status', 'gameover');
    this.gameOver = true;
    return;
  }
  if (this.position.y + blockSize + (this.map[this.position.x] + 1) * blockSize >= screenHeight * blockSize && this.enemies[this.position.x] != 0) {
    this.sendPlayers('status', 'gameover');
    this.gameOver = true;
    return;
  }
  if (this.position.y + blockSize + (this.map[this.position.x] + 1) * blockSize >= screenHeight * blockSize && this.coins[this.position.x] == 1) {
    this.points++;
  }
  this.position.y -= this.velocityY;
  this.velocityY -= 4;
  this.position.y = Math.min(this.position.y, screenHeight * blockSize - (this.map[this.position.x] + 2) * blockSize);
  this.sendMap();
  var _this = this;
  setTimeout(function () {
    _this.handlePlayer();
  }, 100);
}

Game.prototype.initGame = function () {
  //Initialise this.roles
  this.roles = [];
  this.roles[0] = numberPlayers[this.gameCode][0];
  this.roles[1] = numberPlayers[this.gameCode][1];
  this.roles[2] = numberPlayers[this.gameCode][2];
  var index1 = Math.floor(Math.random() * 3);
  var index2 = 1 + Math.floor(Math.random() * 2);
  this.roles[0] = [this.roles[index1], this.roles[index1] = this.roles[0]][0];
  this.roles[1] = [this.roles[index2], this.roles[index2] = this.roles[1]][0];

  this.handlePlayer();
}

Game.prototype.handleMove = function (keyCode, userCode) {
  var key = this.roles.indexOf(userCode);

  console.log(key);

  if (key == 0) { //Left key
    this.position.x -= 1; //blockSize;
    this.stepsSinceLast++;
  }
  if (key == 1) { //Right key
    this.position.x += 1; //blockSize;
    this.stepsSinceLast++;
  }
  if (key == 2 && this.position.y + blockSize + (this.map[this.position.x] + 1) * blockSize >= screenHeight * blockSize) {
    this.velocityY = velIncrease;
  }
}

Game.prototype.sendMap = function () {
  var map2D = [];
  for (var i = 0; i < screenHeight; i++) {
    map2D[i] = [];
    for (var j = 0; j < screenWidth; j++) {
      map2D[i][j] = 0;
    }
  }
  var index = 0;
  for (var i = this.position.x - mapCache; i <= this.position.x + mapCache; i++, index++) {
    if (this.map[i] == -1) continue;
    map2D[screenHeight - 1 - this.map[i]][index] = 1;
    if (this.coins[i]) {
      map2D[screenHeight - 2 - this.map[i]][index] = 2;
    }
    if (this.enemies[i]) {
      map2D[screenHeight - 2 - this.map[i]][index] = 3;
    }
  }

  var data = {
    points: this.points,
    map: map2D,
    playerY: this.position.y
  }
  this.sendPlayers('map', data);
}

function disconnectCurrentGame(code) {
  numberPlayers[playsIn[code]].splice(numberPlayers[playsIn[code]].indexOf(code), 1);
  delete numberPlayers[code];
}

var games = [];

io.on('connection', function (socket) {
  code = Math.random().toString(36).substr(2, 6);
  socket.emit('code', code);
  numberPlayers[code] = [];
  numberPlayers[code].push(code);
  playsIn[code] = code;
  socketsPlayers[code] = socket.id;
  socketsCodes[socket.id] = code;
  socket.on('disconnect', function () {
    delete socketsPlayers[socketsCodes[socket.id]];
    delete games[socketsCodes[socket.id]];
    disconnectCurrentGame(socketsCodes[socket.id]);
  });
  socket.on('join', function (gameCode) {
    if (numberPlayers[gameCode].length == 3 || numberPlayers[gameCode].length == 0) {
      socket.emit('join', -1);
      return;
    }
    disconnectCurrentGame(socketsCodes[socket.id]);
    playsIn[socketsCodes[socket.id]] = gameCode;
    numberPlayers[gameCode].push(socketsCodes[socket.id]);
    if (numberPlayers[gameCode].length == 3) {
      games[gameCode] = new Game(gameCode);
      games[gameCode].initGame();
      games[gameCode].sendPlayers('startgame', 1);
    }
  });
  socket.on('keyPress', function (keyCode) {
    games[playsIn[socketsCodes[socket.id]]].handleMove(keyCode, socketsCodes[socket.id]);
  });
});

function setMoves() {
  var random = Math.random();
  var player = "";
  if (random < 0.33) {
    player = 'aaaaaa';
  } else if (random < 0.66) {
    player = 'aaabbb';
  } else {
    player = 'aaaccc';
  }
  games['aaaaaa'].handleMove(30, player);
  setTimeout(setMoves, 1200);
}

http.listen(3000, function () {
  console.log('listening on *:3000');

  //Testing
  /*var gameCode = 'aaaaaa';
  numberPlayers[gameCode] = [];
  numberPlayers[gameCode].push('aaabbb');
  numberPlayers[gameCode].push('aaaaaa');
  numberPlayers[gameCode].push('aaaccc');
  playsIn['aaaaaa'] = gameCode;
  playsIn['aaabbb'] = gameCode;
  playsIn['aaaccc'] = gameCode;
  games[gameCode] = new Game(gameCode);
  games[gameCode].initGame();

  setMoves();*/

});