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

        // AI movement for right paddle
        moveRightPaddleAI();

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
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX = 3 * (Math.random() > 0.5 ? 1 : -1);
        ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
    }

    function moveRightPaddleAI() {
        // Predict where the ball will be
        let predictedY = ball.y + (ball.speedY / ball.speedX) * (rightPaddle.x - ball.x);

        // If the prediction is outside the canvas, adjust for bounce
        while (predictedY > canvas.height || predictedY < 0) {
            if (predictedY > canvas.height) {
                predictedY = 2 * canvas.height - predictedY;
            } else if (predictedY < 0) {
                predictedY = -predictedY;
            }
        }

        // Move the right paddle towards the predicted position
        if (rightPaddle.y + rightPaddle.height / 2 < predictedY) {
            rightPaddle.y += rightPaddle.speed;
        } else {
            rightPaddle.y -= rightPaddle.speed;
        }

        // Prevent the paddle from going out of bounds
        if (rightPaddle.y < 0) {
            rightPaddle.y = 0;
        } else if (rightPaddle.y + rightPaddle.height > canvas.height) {
            rightPaddle.y = canvas.height - rightPaddle.height;
        }
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
