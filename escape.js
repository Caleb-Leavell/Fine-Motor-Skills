function resetEscapeGame(){
  escape.gone = "";
  escape.lives = 3;
  escape.messageTimer = null;
  scores.escape.score = 0;
  escape.objects =
  [[false, escape.objStartPos[0][0]+25, escape.objStartPos[0][1]+25, 0, 0, false, null, "Elephant"], 
  [false, escape.objStartPos[1][0]+25, escape.objStartPos[1][1]+25, 0, 0, false, null, "Giraffe"],
  [false, escape.objStartPos[2][0]+25, escape.objStartPos[2][1]+25, 0, 0, false, null, "Monkey"],
  [false, escape.objStartPos[3][0]+25, escape.objStartPos[3][1]+25, 0, 0, false, null, "Pig"],
  [false, escape.objStartPos[4][0]+25, escape.objStartPos[4][1]+25, 0, 0, false, null, "Tiger"],
  [false, escape.objStartPos[5][0]+25, escape.objStartPos[5][1]+25, 0, 0, false, null, "Cow"]];
  escape.objects[0][6] = loadImage('assets/elephant.png');
  escape.objects[1][6] = loadImage('assets/giraffe.png');
  escape.objects[2][6] = loadImage('assets/monkey.png');
  escape.objects[3][6] = loadImage('assets/pig.png');
  escape.objects[4][6] = loadImage('assets/tiger.png');
  escape.objects[5][6] = loadImage('assets/cow.png');
}


function runEscapeGame(){
  background(escape.backgroundImg);
  fill(189,154,122);
  stroke(0);
  strokeWeight(2);
  rect(width/2-60,height/2-85,120,170);
  displayLives();
  if (touches.length==0){
    escape.touchingFlag = false;
  }
  
  for (var i=0; i<6; i++){
    if (!(escape.objects[i][5])){
      drawObj(i);
    }
  }
  
  
  if (escape.gone != ""){
    textSize(25);
    textAlign(CENTER);
    noStroke();
    fill("red");
    text(escape.gone + " has escaped!", width/2, 135);
    if (millis()-escape.messageTimer > 2000){
      escape.gone = "";
      escape.messageTimer = null;
    }
  }
  
}



function drawObj(num){

  fill("blue");
  strokeWeight(2);
  image(escape.objects[num][6], escape.objects[num][1]-25, escape.objects[num][2]-25, 50, 50);

  
  
  if (!(escape.objects[num][0])){
    //if not escaping
    if (random(0, 1000) >= 995-(scores.escape.score/5)){
      //start escape
      escape.objects[num][0] = true;
      while (abs(escape.objects[num][3])<0.25 || abs(escape.objects[num][4])<0.25){
        escape.objects[num][3] = random(-2, 2);
        escape.objects[num][4] = random(-2, 2);
      }

    }
  }else{
    //if escaping
    //draw number
    fill("black");
    
    //if theres a new touch
    if (touches.length > 0 && escape.touchingFlag==false){
      escape.touchingFlag = true;
      //if touch is on object
      
      if(dist(touches[0].x, touches[0].y, escape.objects[num][1], escape.objects[num][2]) <= 25){
        if (volumeOn){
          escape.clickSound.play();
        }
        scores.escape.score++;
        escape.objects[num][0] = false;
        escape.objects[num][1] = escape.objStartPos[num][0]+25;
        escape.objects[num][2] = escape.objStartPos[num][1]+25;
        escape.objects[num][3] = 0;
        escape.objects[num][4] = 0;
        escape.objects[num][5] = false;
      }else{
        escape.touchingFlag = false;
      }
    }
    //if off screen
    if (escape.objects[num][1] > width || escape.objects[num][1] < 0 || 
        escape.objects[num][2] > height || escape.objects[num][2] < 0){
      //"gone" flag true & display message
      escape.objects[num][5] = true;
      escape.gone = "The " + escape.objects[num][7];
      escape.messageTimer = millis();
      escape.lives--;
      if (volumeOn){
        escape.lifeLoseSound.play();
      }
    }
    
    //move position
    escape.objects[num][1] += escape.objects[num][3];
    escape.objects[num][2] += escape.objects[num][4];
    
  }
  
}


function displayLives(){
  textSize(50);
  textAlign(CENTER);
  fill("red");
  if (escape.lives<=0){
    scene = "escape-game-over";
  }
  for (var i=0; i<3; i++){
    if (i<escape.lives){
      image(escape.heartImg, width/2+((i-1)*60)-25, 50, 50, 50);
    }else{
      image(escape.brokenHeartImg, width/2+((i-1)*60)-25, 50, 50, 50);
    }
  }
  
  textSize(20);
  textAlign(CENTER);
  fill("white");
  noStroke();
  textStyle(BOLD);
  text("SCORE", 40, 25);
  textSize(40);
  text("LIVES", width/2, 25);
  textStyle(BOLD);
  textSize(50);
  text(scores.escape.score, 40, 60);
  
  
  
}

function escapeGameOver() {
  background(204,230,255);
  
  fill(0);
  noStroke();
  textSize(30);
  textStyle(BOLD);
  textAlign(CENTER);
  text("GAME OVER", width/2, 50);
  textStyle(NORMAL);
  textSize(25);
  text("SCORE: " + scores.escape.score, width/2, 110);
  if (scores.escape.score > scores.escape.highscore){
    scores.escape.highscore = scores.escape.score;
  }
  text("HIGHSCORE: " + scores.escape.highscore, width/2, 140);
  
  //buttons
  buttons.escape.gameover.homeButton.create();
  buttons.escape.gameover.homeButton.isPressed()
  buttons.escape.gameover.playButton.create();
  if(buttons.escape.gameover.playButton.isPressed()) {
    resetEscapeGame();
  }
     
}

function escapeHome(){
    textStyle(BOLD);
    textSize(50);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text("ESCAPE", width/2, 0.432*height);
  
    buttons.escape.home.playButton.create();
    if (buttons.escape.home.playButton.isPressed()){
      resetEscapeGame();
    }
    buttons.escape.home.homeButton.create();
    buttons.escape.home.homeButton.isPressed();
    buttons.escape.home.howtoButton.create();
    buttons.escape.home.howtoButton.isPressed();
}

function escapeHowTo(){
  background(204,230,255);
  
  buttons.escape.howto.homeButton.create();
  buttons.escape.howto.homeButton.isPressed(); 
  
    let howto = "The animals are trying to escape! Keep them inside as long as you can by tapping on them. Watch out, though, they get more eager as the game goes on!";
  textAlign(CENTER);
  fill(0);
  noStroke();
  textSize(25);
  textStyle(NORMAL);
  text(howto, 20, 200, width-30);
  
  textSize(30);
  textStyle(BOLD);
  text("How To", width/2, 80);
}