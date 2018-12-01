var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 560;
var ctx = canvas.getContext("2d");

canvas.addEventListener("click", onClick);

//TODO: change image srcs
var tileDict = ["Tiles/BarbedWire.png", "Tiles/Dirt.png", "Tiles/Stone.png", "Tiles/ExtraTime.png", "Tiles/Lava.png", "Tiles/TopDirt.png", "Tiles/TopStone.png", "Tiles/Spikes.png"];
var tileWidth = 40;
var tileHeight = 40;

var btnStartX = 820;
var btnStartY = 450;
var btnWidth = 154;
var btnHeight = 92;

//TODO: add in values
var btn2StartX = 0;
var btn2StartY = 0;
var btn2Width = 0;
var btnHeight = 0;

var currentScreen = "start";

function startMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScreen = "start";
    //TODO: change text & font options & starting position
    ctx.font = "52px impact";
    ctx.fillText("Game", 400, 200);
    ctx.fillText("Join Game", 400, 300);
    ctx.fillText("Create Game", 400, 350);
}

function createImage(file, x, y) {
    var img = new Image();
    img.src = file;
    img.onload = function() {
        ctx.drawImage(img, x, y, tileWidth, tileHeight);
    }
}

function drawBackground(background) {
    for (var row = 0; row<background.length; row++) {
        for (var col = 0; col<background[row].length; col++) {
            if (background[row][col] != 0) {
                var src = tileDict[background[row][col] -1];
                var x = col*tileWidth;
                var y = row*tileHeight;
                console.log(y);
                createImage(src, x, y);
            }
        }
    }
}

function drawButton(file, x, y, w, h) {
    var btn = new Image();
    btn.src = file;
    btn.onload = function() {
        ctx.drawImage(btn, x, y, btn.width, btn.height);
    };
}

function gameScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScreen = "game";
    btnStartX = 820;
    btnStartY = 450;
    btnWidth = 154;
    btnHeight = 92;
    //TODO: specify background tiles from server
    var background = [[0,0,1,0,1,0,0,2,0,0,0,3,0,1,1,2,0,0,3,0,1,2,0,0,0],[0,3,0,2,1,3,2,2,0,1,0,0,0,0,0,1,0,0,2,2,0,0,0,0,0], [0,0,1,0,1,0,0,2,0,0,0,3,0,1,1,2,0,0,3,0,0,0,2,3,3]];
    drawBackground(background);
    //TODO: change button depending on server
    if (left) {
        drawButton("Buttons/LeftButton.png", btnStartX, btnStartY, btnWidth, btnHeight);
    } else if (right) {
        drawButton("Buttons/RightButton.png", btnStartX, btnStartY, btnWidth, btnHeight);
    } else if (up) {
        drawButton("Buttons/UpButton.png", btnStartX, btnStartY, btnWidth, btnHeight);
    } else {
        drawButton("Buttons/button.png", btnStartX, btnStartY, btnWidth, btnHeight);
    }
    
}

function onClick(e) {
    if (currentScreen == "game" && e.clientX >= btnStartX && e.clientX <= btnStartX + btnWidth && e.clientY >= btnStartY && e.clientY <= btnStartY + btnHeight) {
        //TODO: send button click info to server
        console.log("action");
    } else if (currentScreen == "end" && e.clientX >= btnStartX && e.clientX <= btnStartX + btnWidth && e.clientY >= btnStartY && e.clientY <= btnStartY + btnHeight) {
        startMenu();
    } else if (currentScreen == "start" && e.clientX >= btnStartX && e.clientX <= btnStartX + btnWidth && e.clientY >= btnStartY && e.clientY <= btnStartY + btnHeight) {
        var input = prompt("Please enter the game code:");
    } else if (currentScreen == "start" && e.clientX >= btn2StartX && e.clientX <= btn2StartX + btn2Width && e.clientY >= btn2StartY && e.clientY <= btn2StartY + btn2Height) {
        waitingScreen();
    }
}

function gameOverScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScreen = "end";
    //TODO: change btn values
    btnStartX = 500;
    btnStartY = 400;
    btnWidth = 154;
    btnHeight = 92;
    ctx.font = "52px impact";
    ctx.fillText("Game Over", 400, 200);
    drawButton("button.png", btnStartX, btnStartY, btnWidth, btnHeight);

}

function waitingScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScreen = "wait";
    //TODO: change btn values
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "52px impact";
    ctx.fillText("Waiting ...", 400, 200);
}

startMenu();
//gameOverScreen();
//gameScreen();
