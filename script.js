var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 560;
var ctx = canvas.getContext("2d");

canvas.addEventListener("click", onClick);

//TODO: change image srcs
var tileDict = ["Tiles/Dirt.png", "Tiles/BarbedWire.png", "Tiles/ExtraTime.png", "Tiles/Stone.png", "Tiles/Lava.png", "Tiles/TopDirt.png", "Tiles/TopStone.png", "Tiles/Spikes.png"];
var tileWidth = 40;
var tileHeight = 40;

var btnStartX = 400;
var btnStartY = 300;
var btnWidth = 150;
var btnHeight = 49;

var btn2StartX = 400;
var btn2StartY = 380;
var btn2Width = 150;
var btn2Height = 49;

var currentScreen = "start";


function createImage(file, x, y) {
    var img = new Image();
    img.src = file;
    img.onload = function () {
        ctx.drawImage(img, x, y, tileWidth, tileHeight);
    }
}

function drawBackground(background) {
    for (var row = 0; row < background.length; row++) {
        for (var col = 0; col < background[row].length; col++) {
            if (background[row][col] != 0) {
                var src = tileDict[background[row][col] - 1];
                var x = col * tileWidth;
                var y = row * tileHeight;
                createImage(src, x, y);
            }
        }
    }
}

var playerRight = ["Player/Middle.png", "Player/Left.png", "Player/Middle.png", "Player/Right.png"];
var playerLeft = ["Player/Middle1.png", "Player/Left1.png", "Player/Middle1.png", "Player/Right1.png"];
var frameNumber;


var reqAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        setTimeout(callback, 1000 / 30);
    };

function drawPlayer(playerX, playerY, frameNumber, direction) {
    var index = (frameNumber / 8) % 4;

    switch (direction) {
        case direction == 1: // Right
            var src = playerRight[index];
            createImage(src, playerX, playerY);
            break;
        case direction == -1: // Left
            var src = playerLeft[index];
            createImage(src, playerX, playerY);
            break;
        default:
            createImage("Player/Middle.png", playerX, playerY);
    }
}

function drawButton(file, x, y, w, h) {
    var btn = new Image();
    btn.src = file;
    btn.onload = function () {
        ctx.drawImage(btn, x, y, w, h);
    };
}


function onClick(e) {
    if (currentScreen == "game" && e.clientX >= btnStartX && e.clientX <= btnStartX + btnWidth && e.clientY >= btnStartY && e.clientY <= btnStartY + btnHeight) {
        keyPress();
    } else if (currentScreen == "end" && e.clientX >= btnStartX && e.clientX <= btnStartX + btnWidth && e.clientY >= btnStartY && e.clientY <= btnStartY + btnHeight) {
        startMenu();
    } else if (currentScreen == "start" && e.clientX >= btnStartX && e.clientX <= btnStartX + btnWidth && e.clientY >= btnStartY && e.clientY <= btnStartY + btnHeight) {
        var input = prompt("Please enter the game code:");
        joinGame(input);
        userCode = input;
        waitingScreen();
    } else if (currentScreen == "start" && e.clientX >= btn2StartX && e.clientX <= btn2StartX + btn2Width && e.clientY >= btn2StartY && e.clientY <= btn2StartY + btn2Height) {
        waitingScreen();
    }
}



//VIEWS
function startMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScreen = "start";
    var btnStartX = 400;
    var btnStartY = 300;
    var btnWidth = 150;
    var btnHeight = 49;

    var btn2StartX = 400;
    var btn2StartY = 380;
    var btn2Width = 150;
    var btn2Height = 49;

    ctx.font = "52px impact";
    ctx.fillText("Game", 400, 200);
    drawButton("Buttons/JoinGame.png", btnStartX, btnStartY, btnWidth, btnHeight);
    drawButton("Buttons/CreateGame.png", btn2StartX, btn2StartY, btn2Width, btn2Height);
}

function waitingScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScreen = "wait";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "52px impact";
    ctx.fillText("Waiting ...", 400, 200);
    ctx.fillText(userCode, 400, 300);
}

function gameScreen(map2D, playerY, points) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.cssText = "background: #C7D7F0";
    currentScreen = "game";
    btnStartX = 820;
    btnStartY = 450;
    btnWidth = 154;
    btnHeight = 92;
    //TODO: specify background tiles from server
    drawBackground(map2D);
    drawPlayer(480, playerY, frameNumber, 1);
    //TODO: change button depending on server
    /*if (role == 0) {
        drawButton("Buttons/LeftButton.png", btnStartX, btnStartY, btnWidth, btnHeight);
    } else if (role == 1) {
        drawButton("Buttons/RightButton.png", btnStartX, btnStartY, btnWidth, btnHeight);
    } else if (role == 2) {
        drawButton("Buttons/UpButton.png", btnStartX, btnStartY, btnWidth, btnHeight);
    } else {*/
    drawButton("Buttons/button.png", btnStartX, btnStartY, btnWidth, btnHeight);
    //}
}

function gameOverScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScreen = "end";
    //TODO: change btn values
    var btnStartX = 400;
    var btnStartY = 300;
    var btnWidth = 150;
    var btnHeight = 49;
    ctx.font = "52px impact";
    ctx.fillText("Game Over", 400, 200);
    drawButton("Buttons/NewGame.png", btnStartX, btnStartY, btnWidth, btnHeight);

}


startMenu();
//gameOverScreen();
//var background = [[0,0,1,0,1,0,0,2,0,0,0,3,0,1,1,2,0,0,3,0,1,2,0,0,0],[0,3,0,2,1,3,2,2,0,1,0,0,0,0,0,1,0,0,2,2,0,0,0,0,0], [0,0,1,0,1,0,0,2,0,0,0,3,0,1,1,2,0,0,3,0,0,0,2,3,3]];
//gameScreen(background, 0, 0);
//gameOverScreen();