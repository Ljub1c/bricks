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

var x, y, dx, dy, paddleX, rightPressed, leftPressed, score, bricks, isGameRunning;

ballImage.onload = function() {
    initGame();
    draw();
};

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
    var brickColor = "black"; // Set a fixed color for all bricks

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColor }; 
        }
    }
    isGameRunning = false;
}

var sekunde = 0;
var sekundeI = 0;
var minuteI = 0;
var izpisTimer;

function timer() {
    sekunde++;

    sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0"+sekundeI;
    minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0"+minuteI;
    izpisTimer = minuteI + ":" + sekundeI;
}

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

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

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawBall() {
    if (ballImage.complete && ballImage.naturalWidth !== 0) {
        ctx.drawImage(ballImage, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
    } else {
        
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "gray"; 
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color; 
                ctx.fill();
                ctx.closePath();
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
                    
                    if (x < b.x || x > b.x + brickWidth) {
                        dx = -dx; 
                    } else {
                        dy = -dy; 
                    }
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

    ctx.font = "16px 'Roboto', Arial, sans-serif"; 
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score + "  Time: " + izpisTimer, 8, 20);
}

function paddleCollision() {
    if (y + dy + ballRadius > canvas.height - paddleHeight && dy > 0) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          
            let hitPosition = (x - paddleX) / paddleWidth;
            
            let normalizedHit = (hitPosition - 0.5) * 2;
           
            dx = 1.4 * normalizedHit; 
            dy = -Math.abs(dy); 
           
            return true;
        }
        return false;
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();

    if (isGameRunning) {
        collisionDetection();

        x += dx;
        y += dy;

       
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }

        
        if (!paddleCollision()) {
            if (y + dy > canvas.height + ballRadius) {
                Swal.fire({
                    title: "Game Over!",
                    text: "You lost!",
                    icon: "error"
                });
                resetGame();
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 4;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 4; 
        }

        requestAnimationFrame(draw);
    }
}


function resetGame() {
    sekunde = 0;
    sekundeI = 0;
    minuteI = 0;
    initGame();
    draw();
}


