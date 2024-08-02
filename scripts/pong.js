// Get the box1 and box2 elements
const box1 = document.getElementById('box1');
const box2 = document.getElementById('box2');

// Set initial positions of boxes (adjust these based on your CSS)
let box1X = 25; // Initial horizontal position of box1
let box1Y = 350; // Initial vertical position of box1
let box2X = 400; // Initial horizontal position of box2
let box2Y = 100; // Initial vertical position of box2
box1.style.left = box1X + 'px';
box1.style.top = box1Y + 'px';
box2.style.left = box2X + 'px';
box2.style.top = box2Y + 'px';

// Set velocities
const xVelocity = -2.5; // Constant leftward velocity for box2
let yVelocity = Math.random() * 10 - 5; // Random y-velocity for box2

// Update positions and handle collisions every 10 milliseconds
setInterval(() => {
  // Update box2's position
  box2X += xVelocity;
  box2Y += yVelocity;

  // Apply new positions to the boxes
  box2.style.left = box2X + 'px';
  box2.style.top = box2Y + 'px';

  // Check for collisions
  if (
    box2X + box2.offsetWidth >= box1.offsetLeft &&  
    box2X <= box1.offsetLeft + box1.offsetWidth &&
    box2Y + box2.offsetHeight >= box1.offsetTop &&  
    box2Y <= box1.offsetTop + box1.offsetHeight
  ) {
    // Collision detected! Reverse box2's x-velocity
    xVelocity = -xVelocity;

    // Adjust box2's y-velocity to introduce some randomness
    yVelocity = Math.random() * 10 - 5; // Adjust the range as needed
  }

  // Handle bouncing off the top and bottom
  if (box2Y <= 0 || box2Y + box2.offsetHeight >= window.innerHeight) {
    yVelocity = -yVelocity; // Reverse y-velocity
  }
}, 10);
