function reflexesGame() {
  background(reflexes.backgroundImg);
  //handle enemy movement
  moveCircles(reflexes.enemies);
  //handle coin movement
  moveCircles(reflexes.coins);
  
  //handle enemies falling past the bottom
  circleConstraints(reflexes.enemies, reflexes.MAX_SPAWN_HEIGHT);
  //handle coins falling past the bottom
  circleConstraints(reflexes.coins, reflexes.MAX_SPAWN_HEIGHT);
  
  //handle coins falling into basket
  for(let i = 0; i < reflexes.coins.pos.length; i ++) {
    if(circleHasFallenIntoBasket(reflexes.coins, i)) {
      reflexes.coins.pos[i].y = 0;
      let r = reflexes.coins.diameter[i];
      reflexes.coins.pos[i].x = random(r, width - r);
      reflexes.score ++;
      if (volumeOn){
        reflexes.collectCoinSound.play();
      }
    }
  }
  //handle enemies falling into basket
  for(let i = 0; i < reflexes.enemies.pos.length; i ++) {
    if(circleHasFallenIntoBasket(reflexes.enemies, i)) {
      if(reflexes.score > reflexes.highscore) {
        reflexes.highscore = reflexes.score;
      }
      scene = "reflexes-game-over";
      if (volumeOn){
        reflexes.loseSound.play();
      }
      reflexesSetup();
      return;
    }
  }
  
  //draw enemies
  drawEnemies(reflexes.enemies, 20);
  //draw coins
  drawCircles(reflexes.coins);

  //ramp difficulty
  rampDifficulty(reflexes.rampingRate);
  
  //handle pressing the basket
  if(touches.length == 1) {
    //lerp takes in (val1, val2, val3)
    //since val3 = 0.1, val1 gets 10% closer to val2 every time the lerp executes
    reflexes.basket.x = lerp(reflexes.basket.x,touches[0].x - reflexes.basket.w / 2, 0.1); 
  }
  

  //draw the basket
  reflexes.basket.create();
  
  //display time and score
  fill(0);
  stroke(0);
  strokeWeight(2);
  textSize(40);
  textAlign(LEFT, CENTER);
  
  text("Score: " + reflexes.score, 10, 40);
  
  
}

function reflexesHome() {
    reflexesReset();
    background(subHomeImg);
    textStyle(BOLD);
    textSize(50);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text("REFLEXES", width/2, 0.432*height);
  
  buttons.reflexes.home.homeButton.create();
  buttons.reflexes.home.homeButton.isPressed();
  buttons.reflexes.home.playButton.create();
  buttons.reflexes.home.playButton.isPressed();
  buttons.reflexes.home.howtoButton.create();
  buttons.reflexes.home.howtoButton.isPressed();
}

function reflexesGameOver() {
  background(204,230,255);
  fill(0);
  noStroke();
  textSize(30);
  textStyle(BOLD);
  textAlign(CENTER);
  text("GAME OVER", width/2, 50);
  
  textSize(25);
  textStyle(NORMAL);
  text("SCORE: " + reflexes.score, width/2, 110);
  text("HIGHSCORE: " + reflexes.highscore, width/2, 140);
  
  //buttons
  buttons.reflexes.gameover.homeButton.create();
  if(buttons.reflexes.gameover.homeButton.isPressed()) {
    reflexesReset();
  }
  buttons.reflexes.gameover.playButton.create();
  if(buttons.reflexes.gameover.playButton.isPressed()) {
    reflexesReset();
  }
}

function reflexesReset(){
  reflexes.ramp = 0;
  createCircles(reflexes.coins, reflexes.MAX_SPAWN_HEIGHT);
  createCircles(reflexes.enemies, reflexes.MAX_SPAWN_HEIGHT);
  reflexes.score = 0;
}

function reflexesHowTo(){
  background(204,230,255);
  
  buttons.reflexes.howto.homeButton.create();
  buttons.reflexes.howto.homeButton.isPressed(); 
  
  let howto = "Move the basket to collect as many coins as possible, but watch out for the spikes!";
  
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

function reflexesSetup() {
//basket
  reflexes.basket = new button(175, 500, 100, 50, "", color('maroon'), color('maroon'), "", "", 4);
  
  //buttons
  /*reflexes.buttons.home.game = new button(20, 100, width - 40, 100, "Play", color('blue'), color(200,200,255), "reflexes-home", "reflexes-game");
  reflexes.buttons.home.howTo = new button(20, 220, width - 40, 100, "How To", color('blue'), color(200, 200, 255), "reflexes-home", "reflexes-howto");
  reflexes.buttons.home.home = new button(20, 340, width - 40, 100, "Home", color('blue'), color(200,200,255), "reflexes-home", "home")
  reflexes.buttons.gameOver.play = new button(20, 200, width - 40, 100, "Play Again", color('blue'), color(200,200,255), "reflexes-game-over", "reflexes-game");
  reflexes.buttons.gameOver.home = new button(20, 320, width - 40, 100, "Home", color('blue'), color(200,200,255), "reflexes-game-over", "reflexes-home");*/
  
  //max height for circles to spawn at
  
  //create coins
  createCircles(reflexes.coins, reflexes.MAX_SPAWN_HEIGHT);
  
  //create enemies
  createCircles(reflexes.enemies, reflexes.MAX_SPAWN_HEIGHT);
}

function setCirclesPhysics(circles, MAX_SPAWN_HEIGHT) {
  
  for(let i = 0; i < circles.num; i ++) {
    setCirclePhysics(circles, i, MAX_SPAWN_HEIGHT);
  }
}

function setCirclePhysics(circles, i, MAX_SPAWN_HEIGHT) {
  let diameter = random(circles.minDiameter, circles.maxDiameter);
    
    circles.diameter[i] = diameter;
    circles.pos[i] = createVector(0,0);
    circles.pos[i].x = random(diameter, width - diameter);
    circles.pos[i].y = random(-diameter, -diameter - MAX_SPAWN_HEIGHT);
    
    let s = random(circles.minSpeed, circles.maxSpeed);
    circles.velocity[i] = (createVector(0,s + reflexes.ramp));
}

function createCircles(circles, MAX_SPAWN_HEIGHT) {
  circles.pos = [];
  circles.velocity = [];
  circles.diameter = [];
  
  for(let i = 0; i < circles.num; i ++) {
    circles.pos.push(null);
    circles.velocity.push(null);
    circles.diameter.push(null);
  }
  
  setCirclesPhysics(circles, MAX_SPAWN_HEIGHT)
  
  
    //coins color init
    let r = circles.colorVal[0];
    let g = circles.colorVal[1];
    let b = circles.colorVal[2];
    circles.color = color(r, g, b);
}

function moveCircles(circleObject) {
  for(let i = 0; i < circleObject.pos.length; i ++) {
    //adding velocity to position creates movement
    circleObject.pos[i].add(p5.Vector.mult(circleObject.velocity[i], deltaTime * 0.05));
  }
}

function circleConstraints(circleObject, MAX_SPAWN_HEIGHT) {
  for(let i = 0; i < circleObject.pos.length; i ++) {
    //reset circle if it has fallen past the bottom of the canvas
    if(circleObject.pos[i].y - circleObject.diameter[i] > height) {
      setCirclePhysics(circleObject, i, MAX_SPAWN_HEIGHT);
    }
  }
}

function drawCircles(circleObject) {
  fill(circleObject.color);
  noStroke();
  for(let i = 0; i < circleObject.pos.length; i ++) {
    image(reflexes.coins.img, circleObject.pos[i].x, circleObject.pos[i].y, 30, 24);
  }
}

function drawEnemies(circleObject, detail) {
  fill(circleObject.color);
  noStroke();
  
  for(let i = 0; i < circleObject.pos.length; i ++) {
    push();
    translate(circleObject.pos[i].x, circleObject.pos[i].y);
    beginShape();
    for(let theda = 0; theda < TWO_PI; theda += TWO_PI / detail) {
      let r = (circleObject.diameter[i] / 2) * random(0.5, 1);
      let x = r * cos(theda);
      let y = r * sin(theda);
      
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();

  }
  
}

function circleHasFallenIntoBasket(circleObject, i) {
  //simplify variable naming
  let x = circleObject.pos[i].x;
  let y = circleObject.pos[i].y;
  let diameter = circleObject.diameter[i];
  let bx = reflexes.basket.x;
  let by = reflexes.basket.y;
  let bw = reflexes.basket.w;
  let bh = reflexes.basket.h;
  
  if(x + diameter / 2 > bx && x - diameter / 2 < bx + bw && y - diameter / 2 > by && y - diameter / 2 < by + bh) {
    return true;
  }
}

function rampDifficulty(rate) {
  reflexes.ramp += rate * deltaTime;
}
