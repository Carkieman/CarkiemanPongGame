document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    // Ball object
    let ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 6,
        speedX: 3,
        speedY: 3
    };

    // Paddle objects
    const paddleWidth = 10;
    const paddleHeight = 100;

    let leftPaddle = {
        x: 20,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        speed: 10
    };

    let rightPaddle = {
        x: canvas.width - 30,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        speed: 10
    };

    // Score variables
    let leftScore = 0;
    let rightScore = 0;

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle(paddle) {
        ctx.fillStyle = 'white';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function drawScore() {
        ctx.font = '30px Iceland';
        ctx.fillStyle = 'white';
        ctx.fillText('Player 1: ' + leftScore, 20, 40);
        ctx.fillText('Player 2: ' + rightScore, canvas.width - 180, 40);
    }

    function update() {
        // Move paddles
        if (keysDown['w'] && leftPaddle.y > 0) {
            leftPaddle.y -= leftPaddle.speed;
        }
        if (keysDown['s'] && leftPaddle.y + leftPaddle.height < canvas.height) {
            leftPaddle.y += leftPaddle.speed;
        }
        if (keysDown['ArrowUp'] && rightPaddle.y > 0) {
            rightPaddle.y -= rightPaddle.speed;
        }
        if (keysDown['ArrowDown'] && rightPaddle.y + rightPaddle.height < canvas.height) {
            rightPaddle.y += rightPaddle.speed;
        }

        // Move ball
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        // Collision with top and bottom walls
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.speedY = -ball.speedY;
        }

        // Collision with paddles
        if (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
            ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
            ball.speedX = -ball.speedX;
            ball.speedX += 1;
            ball.speedY += 1;
        }

        if (ball.x + ball.radius >= rightPaddle.x &&
            ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
            ball.speedX = -ball.speedX;
            ball.speedX -= 1;
            ball.speedY += 1;
        }

        // Check for scoring
        if (ball.x - ball.radius < 0) {
            // Player 2 (right side) scores
            rightScore++;
            resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
            // Player 1 (left side) scores
            leftScore++;
            resetBall();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        drawBall();
        drawPaddle(leftPaddle);
        drawPaddle(rightPaddle);
        drawScore();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    function resetBall() {
        ball.speedX = 3
        ball.speedY = 3
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX = -ball.speedX; // Reverse direction
    }

    // Handle keyboard controls
    let keysDown = {};
    document.addEventListener('keydown', function(event) {
        keysDown[event.key] = true;
    });

    document.addEventListener('keyup', function(event) {
        delete keysDown[event.key];
    });

    // Start the game loop
    gameLoop();
});
