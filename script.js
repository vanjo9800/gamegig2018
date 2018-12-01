var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 563;
var ctx = canvas.getContext("2d");

//TODO: change image srcs
var tileDict = ["red.png", "blue.png", "purple.png"];
var tileWidth = 50;
var tileHeight = 50;

function startMenu() {
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
        ctx.drawImage(img, x, y);
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

function gameScreen() {
    //TODO: specify background tiles from server
    var background = [[0,0,1,0,1,0,0,2,0,0,0,3,0,1,1,2,0,0,3,0],[0,3,0,2,1,3,2,2,0,1,0,0,0,0,0,1,0,0,2,2], [0,0,1,0,1,0,0,2,0,0,0,3,0,1,1,2,0,0,3,0]];
    drawBackground(background);

}

startMenu();
//gameScreen();
