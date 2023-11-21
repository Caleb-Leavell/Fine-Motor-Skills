
/*
pos takes in a vector (postion (x, y))
w takes an int (width)
h takes an int (height)
the grabbable vertexes wil be bottom left and top right
*/
function pinchingSetup() {
  //set up pinching variables
  pinching.pos = createVector(100, 100);
  
  let padding = 50;
  
  pinching.targetWidth = random(50, 200);
  pinching.targetHeight = random(50, 200);
  
  let tx = random(padding, width - pinching.targetWidth - padding);
  let ty = random(padding, height - pinching.targetHeight - padding);
  
  pinching.targetPos = createVector(tx, ty);
}

function rectangleDisplay(pos, w, h, range, color) {
  noStroke();
  fill(color);
  rect(pos.x, pos.y, w, h);
  fill('red');
  circle(pos.x, pos.y + h, range);
  circle(pos.x+ w, pos.y, range);
  
    if(timeIsUp(pinching.timeGiven)) {
      if(scores.pinching.score > scores.pinching.highscore) {
        scores.pinching.highscore = scores.pinching.score;
      }
      scene = "pinching-game-over";
      if (volumeOn){
        pinching.completionSound.play();
      }
    }
}

function rectangleIsPinched(pos, w, h, range) {
  let isPinched1 = false;
  let isPinched2 = false;
  let touch1 = 0;
  let touch2 = 0;
  
  for(let i = 0; i < touches.length; i ++) {
    fill(255, 0, 0, 100);
    noStroke();
    ellipse(touches[i].x, touches[i].y, 100, 100);
    
    if(dist(touches[i].x, touches[i].y, pos.x, pos.y + h) < range) {
      touch1 = i;
      isPinched1 = true;
    }
    if(dist(touches[i].x, touches[i].y, pos.x + w, pos.y) < range) {
      touch2 = i;
      isPinched2 = true;
    }
    if(isPinched1 && isPinched2) {
      rectangleResize(touch1, touch2);
    }
    
  }
  
}

function rectangleIsTarget(pos, w, h, tpos, tw, th, error) {
  let xIsAligned = pos.x > tpos.x - error && pos.x < tpos.x + error;
  let yIsAligned = pos.y > tpos.y - error && pos.y < tpos.y + error;
  let widthIsAligned = w > tw - error && w < tw + error;
  let heightIsAligned = h > th - error && h < th + error;
  
  if(xIsAligned && yIsAligned && widthIsAligned && heightIsAligned) {
    if (volumeOn){
      pinching.collectSound.play();
    }
    return true;
  }
  else {
    return false;
  }
  
  
}

function rectangleResize(touch1, touch2) {
  pinching.rWidth = abs(touches[touch2].x - pinching.pos.x);
  pinching.rHeight = abs(touches[touch1].y - pinching.pos.y);
  
  pinching.pos.x = touches[touch1].x;
  pinching.pos.y = touches[touch2].y;

}

function doRectanglePinching(pos, w, h, range) {
  rectangleIsPinched(pos, w, h, range);
  
  let c;
  if(rectangleIsTarget(pos, w, h, pinching.targetPos, pinching.targetWidth, pinching.targetHeight, pinching.targetError)) {
    c = color('lime');
    
    let padding = 50;

    pinching.targetWidth = random(50, 200);
    pinching.targetHeight = random(50, 200);

    let tx = random(padding, width - pinching.targetWidth - padding);
    let ty = random(padding, height - pinching.targetHeight - padding);

    pinching.targetPos = createVector(tx, ty);
    

    scores.pinching.score ++;    
  }
  else {
    c = color('blue');
  }
  rectangleDisplay(pos, w, h, range / 2, c);
}

function targetDisplay(pos, w, h) {
  noFill();
  stroke(0);
  strokeWeight(3);
  rect(pos.x, pos.y, w, h);
  
}

function timeIsUp(timeGiven) {
  if(pinching.currentTime != second()) {
    pinching.currentTime = second();
    pinching.timeLeft --;
  }
  if(pinching.timeLeft <= 0) {
    //timeLeft = timeGiven;
    return true;
  }
  else {
    return false;
  }
}

function displayTimeAndScore() {
  fill(0);
  stroke(0);
  strokeWeight(2);
  textSize(25);
  textAlign(LEFT);
 
  if(!timeIsUp(pinching.timeGiven)) {
    text("Time Left: " + (pinching.timeLeft) + "\n" + "Score: " + scores.pinching.score, 10, 50);
  }

}

function pinchingHome() {
    textStyle(BOLD);
    textSize(50);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text("PINCHING", width/2, 0.432*height);
  
    buttons.pinching.home.playButton.create();
    buttons.pinching.home.playButton.isPressed();
    buttons.pinching.home.homeButton.create();
    buttons.pinching.home.homeButton.isPressed();
    buttons.pinching.home.howtoButton.create();
    buttons.pinching.home.howtoButton.isPressed();
}

function pinchingHowTo() {
  background(204,230,255);
  

  
   buttons.pinching.howto.homeButton.create();
   buttons.pinching.howto.homeButton.isPressed(); 
  
  let howto = "Pinch the red corners on the rectangle to move it around. Try to match it with the target rectangle to get points!";
  
  fill(0);
  noStroke();
  textSize(25);
  textStyle(NORMAL);
  textAlign(CENTER);
  text(howto, 20, 200, width-30);
  
  textSize(30);
  textStyle(BOLD);
  text("How To", width/2, 80);

}

function pinchingGameOver() {
  background(204,230,255);
  
  fill(0);
  noStroke();
  textSize(30);
  textStyle(BOLD);
  textAlign(CENTER);
  text("TIME'S UP", width/2, 50);
  
  textSize(25);
  textStyle(NORMAL);
  text("SCORE: " + scores.pinching.score, width/2, 110);
  text("HIGHSCORE: " + scores.pinching.highscore, width/2, 140);
  
  //buttons
  buttons.pinching.gameover.homeButton.create();
  if(buttons.pinching.gameover.homeButton.isPressed()) {
    scores.pinching.score = 0;
    pinching.timeLeft = pinching.timeGiven;
  }
  buttons.pinching.gameover.playButton.create();
  if(buttons.pinching.gameover.playButton.isPressed()) {
    scores.pinching.score = 0;
    pinching.timeLeft = pinching.timeGiven;
  }
     
}
