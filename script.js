var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var ballImage = new Image();
ballImage.src = "imgs/TNT.png";

var brick = new Image();
brick.src = "imgs/brik.png";

var bedrock = new Image();
bedrock.src = "imgs/bedrock.png";

var x, y, dx, dy, paddleX, rightPressed, leftPressed, score, bricks, isGameRunning;
var sekunde = 0, sekundeI = "00", minuteI = "00", izpisTimer = "00:00";
var imagesLoaded = 0;


function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 3) { 
        initGame();
        draw();
    }
}

ballImage.onload = checkImagesLoaded;
brick.onload = checkImagesLoaded;
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
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    isGameRunning = false;
}


function timer() {
    sekunde++;
    sekundeI = ((sekunde % 60) > 9) ? sekunde % 60 : "0" + (sekunde % 60);
    minuteI = (Math.floor(sekunde / 60) > 9) ? Math.floor(sekunde / 60) : "0" + Math.floor(sekunde / 60);
    izpisTimer = minuteI + ":" + sekundeI;
}


document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.getElementById("startButton").addEventListener("click", function() {
    if (!isGameRunning) {
        isGameRunning = true;
        draw();
    }
});

document.getElementById("stopButton").addEventListener("click", function() {
    isGameRunning = false;
});

document.getElementById("credentialsButton").addEventListener("click", function() {
    Swal.fire({
        title: 'Credits',
        text: 'Made by Nik Ljubic',
        icon: 'info',
        confirmButtonText: 'Exit',
        confirmButtonColor: '#FFB70A'
    });
});


function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}


function keyDownHandler(e) {
    if (e.code === "ArrowRight") {
        rightPressed = true;
    } else if (e.code === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.code === "ArrowRight") {
        rightPressed = false;
    } else if (e.code === "ArrowLeft") {
        leftPressed = false;
    }
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
            if (bricks[c][r].status === 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.drawImage(brick, brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}


function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status === 1) {
                if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth &&
                    y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
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
    timer();
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

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
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
    sekunde = 0; 
    sekundeI = "00"; 
    minuteI = "00"; 
    izpisTimer = minuteI + ":" + sekundeI; 
    initGame(); 
    draw();
}
