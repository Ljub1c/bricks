var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var ballImage = new Image();
ballImage.src = "imgs/TNT.png";

var brickFull = new Image();
brickFull.src = "imgs/brik.png";

var brickMedium = new Image();
brickMedium.src = "imgs/medium.jpg";

var brickLow = new Image();
brickLow.src = "imgs/low.jpg";

var bedrock = new Image();
bedrock.src = "imgs/bedrock.png";

var x, y, dx, dy, paddleX, rightPressed, leftPressed, score, bricks, isGameRunning;
var sekunde = 0, izpisTimer = "0s", timerInterval = null;
var imagesLoaded = 0;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 5) {
        initGame();
        draw();
    }
}

ballImage.onload = checkImagesLoaded;
brickFull.onload = checkImagesLoaded;
brickMedium.onload = checkImagesLoaded;
brickLow.onload = checkImagesLoaded;
bedrock.onload = checkImagesLoaded;

function initGame() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 3;
    dy = -3;
    paddleX = (canvas.width - paddleWidth) / 2;
    rightPressed = false;
    leftPressed = false;
    score = 0;
    bricks = [];
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, lives: 3 };
        }
    }
    isGameRunning = false;
}

function timer() {
    sekunde++;
    izpisTimer = sekunde + "s";
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.getElementById("startButton").addEventListener("click", function () {
    if (!isGameRunning) {
        isGameRunning = true;
        sekunde = 0;
        izpisTimer = "0s";
        timerInterval = setInterval(timer, 1000);
        draw();
    }
});

document.getElementById("stopButton").addEventListener("click", function () {
    isGameRunning = false;
    clearInterval(timerInterval);
});

document.getElementById("naslov").addEventListener("click", function () {
    Swal.fire({
        title: 'Informations',
        text: 'Author: Nik Ljubič, 4. RA',
        iconColor: "#ADDB5E",
        confirmButtonColor: "black",
        icon: 'info',
        confirmButtonText: 'Close',
        customClass: {
            popup: 'custom-popup'
        }
    });
});

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function keyDownHandler(e) {
    if (e.code === "ArrowRight") rightPressed = true;
    else if (e.code === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.code === "ArrowRight") rightPressed = false;
    else if (e.code === "ArrowLeft") leftPressed = false;
}

function drawBall() {
    ctx.drawImage(ballImage, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
}

function drawPaddle() {
    ctx.drawImage(bedrock, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.lives > 0) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                b.x = brickX;
                b.y = brickY;

                let imgToUse = brickFull;
                if (b.lives === 2) imgToUse = brickMedium;
                else if (b.lives === 1) imgToUse = brickLow;

                ctx.drawImage(imgToUse, brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.lives > 0) {
                if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth &&
                    y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
                    dy = -dy;
                    b.lives--;

                    
                    
                    if (b.lives === 0) {
                        score++; 
                    }

                    
                    let allDestroyed = true;
                    for (let col = 0; col < brickColumnCount; col++) {
                        for (let row = 0; row < brickRowCount; row++) {
                            if (bricks[col][row].lives > 0) {
                                allDestroyed = false;
                                break;
                            }
                        }
                        if (!allDestroyed) break;
                    }

                    if (allDestroyed) {
                        Swal.fire({
                            title: "CONGRATULATIONS!",
                            text: "You won!",
                            icon: "success"
                        });
                        resetGame();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score + "  Time: " + izpisTimer, 8, 20);
}

function paddleCollision() {
    if (y + dy + ballRadius > canvas.height - paddleHeight && y + dy < canvas.height) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();

    if (isGameRunning) {
        collisionDetection();
        paddleCollision();

        x += dx;
        y += dy;

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
        if (y + dy < ballRadius) dy = -dy;

        if (y + dy > canvas.height - ballRadius) {
            Swal.fire({
                title: "Game Over!",
                text: "Try again!",
                icon: "error"
            });
            resetGame();
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        requestAnimationFrame(draw);
    }
}

function resetGame() {
    clearInterval(timerInterval);
    sekunde = 0;
    izpisTimer = "0s";
    timerInterval = null;
    initGame();
    draw();
}

window.onload = function () {
    Swal.fire({
        title: 'Welcome!',
        text: 'Destroy the bricks to win the game , use your mouse or arrows to move the paddle',
        icon: 'info',
        iconColor: "#ADDB5E",
        confirmButtonColor: "black",
        confirmButtonText: 'GOT IT',
        customClass: {
            popup: 'custom-popup'
        }
    });
};
