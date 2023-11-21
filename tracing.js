function tracingHome() {
  //title
    textStyle(BOLD);
    textSize(50);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text("TRACING", width/2, 0.432*height);
    
    //buttons
  buttons.tracing.home.play.create();
  buttons.tracing.home.play.isPressed();
  buttons.tracing.home.howto.create();
  buttons.tracing.home.howto.isPressed();
  buttons.tracing.home.home.create();
  buttons.tracing.home.home.isPressed();
  

  
}

function tracingHowTo() {
  background(204,230,255);
  
  buttons.tracing.howTo.home.create();
  buttons.tracing.howTo.home.isPressed();
  
  let howto = "Trace the black outline of the shape! The shape gets tricker to trace depending on what difficulty you choose. Try to get the highest accuracy possible for each difficulty!";
  
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

function tracingDifficulty() {
  //title
   textStyle(BOLD);
    textSize(35);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text("Choose Difficulty", width/2, 40);
  
    //update button names
    buttons.tracing.difficulty.easy.text = 
      "Easy (Highscore: " + floor(tracing.bestAccuracy.easy) + "%)";
    buttons.tracing.difficulty.medium.text = 
      "Medium (Highscore: " + floor(tracing.bestAccuracy.medium) + "%)";
    buttons.tracing.difficulty.hard.text = 
      "Hard (Highscore: " + floor(tracing.bestAccuracy.hard) + "%)";
    buttons.tracing.difficulty.expert.text = 
      "Expert (Highscore: " + floor(tracing.bestAccuracy.expert) + "%)";
      
  
  
    //buttons
  buttons.tracing.difficulty.easy.create();
  buttons.tracing.difficulty.medium.create();
  buttons.tracing.difficulty.hard.create();
  buttons.tracing.difficulty.expert.create();
  buttons.tracing.difficulty.home.create();
  buttons.tracing.difficulty.home.isPressed();

  
  
    if(buttons.tracing.difficulty.easy.isPressed()) {
      tracing.shapeAmplitude = 25;
      tracing.shapePeriod = 0.25;
      tracing.shape = Point.createShape(width/2, height/2 + 50, 400, random(width*0.182, width*0.244), random(height*0.135, height*0.3), tracing.shapeAmplitude, tracing.shapePeriod);
      tracing.difficulty = "easy";
      return;
    }   
    if(buttons.tracing.difficulty.medium.isPressed()) {
      tracing.shapeAmplitude = 50;
      tracing.shapePeriod = 0.5;
      tracing.shape = Point.createShape(width/2, height/2 + 50, 400, random(width*0.182, width*0.244), random(height*0.135, height*0.3), tracing.shapeAmplitude, tracing.shapePeriod);
      tracing.difficulty = "medium";
      return;
    } 
    if(buttons.tracing.difficulty.hard.isPressed()) {
      tracing.shapeAmplitude = 75;
      tracing.shapePeriod = 0.75;
      tracing.shape = Point.createShape(width/2, height/2 + 50, 400, random(width*0.182, width*0.244), random(height*0.135, height*0.3), tracing.shapeAmplitude, tracing.shapePeriod);
      tracing.difficulty = "hard";
      return;
    }  
    if(buttons.tracing.difficulty.expert.isPressed()) {
      tracing.shapeAmplitude = 100;
      tracing.shapePeriod = 1;
      tracing.shape = Point.createShape(width/2, height/2 + 50, 400, random(width*0.182, width*0.244), random(height*0.135, height*0.3), tracing.shapeAmplitude, tracing.shapePeriod);
      tracing.difficulty = "expert";
      return;
    }  
    
}

function tracingGameOver() {
    noFill();
    tracing.pencilSound.stop();
    Point.displayShape(tracing.shape);
    Point.displayUserPoints(tracing.userPoints);
    fill(0);
    textSize(30);
    noStroke();
    textAlign(LEFT);
    textStyle(BOLD);
    text(floor(tracing.accuracy) + "% Accuracy", 10, 30);
    if(tracing.difficulty == "easy") {
      text(floor(tracing.bestAccuracy.easy) + "% Highscore", 10, 60); 
    }
    if(tracing.difficulty == "medium") {
      text(floor(tracing.bestAccuracy.medium) + "% Highscore", 10, 60); 
    }
    if(tracing.difficulty == "hard") {
      text(floor(tracing.bestAccuracy.hard) + "% Highscore", 10, 60); 
    }
    if(tracing.difficulty == "expert") {
      text(floor(tracing.bestAccuracy.expert) + "% Highscore", 10, 60); 
    }
    
    buttons.tracing.gameOver.play.create();
    buttons.tracing.gameOver.home.create();
    
    if(buttons.tracing.gameOver.play.isPressed() ||
      buttons.tracing.gameOver.home.isPressed()) {
        tracingReset();
    }
}

function tracingGame() {
  
  
  //display shape to be traced
  noFill();
  Point.displayShape(tracing.shape);
  
  if ((!(tracing.screenPressed)) && touches.length >= 1 && volumeOn){
    tracing.pencilSound.play();
  }
 
  
  
  //check if circle is drawn
  if(Point.shapeIsDrawn(tracing.userPoints, 100, tracing.maxEndpointDistance)) {
    //check for high score
    if(tracing.difficulty == "easy" && tracing.accuracy > tracing.bestAccuracy.easy) {
      tracing.bestAccuracy.easy = tracing.accuracy;
    }
    if(tracing.difficulty == "medium" && tracing.accuracy > tracing.bestAccuracy.medium) {
      tracing.bestAccuracy.medium = tracing.accuracy;
    }
    if(tracing.difficulty == "hard" && tracing.accuracy > tracing.bestAccuracy.hard) {
      tracing.bestAccuracy.hard = tracing.accuracy;
    }
    if(tracing.difficulty == "expert" && tracing.accuracy > tracing.bestAccuracy.expert) {
      tracing.bestAccuracy.expert = tracing.accuracy;
    }
    
    if (volumeOn){
      tracing.completionSound.play();
    }
    scene = "tracing-game-over";
    return;
  }

  strokeWeight(10);
  
  //handle adding user points and pressing the screen
  if(touches.length >= 1 && tracing.screenPressed == false) {
    tracing.userPoints = [];
    
  }
  if(touches.length >= 1) {
    let distance = Point.distFromClosestPoint(touches[0].x, touches[0].y, tracing.shape);

    fill(0 + distance * 25, 255-distance * 25, 0, 100);
    noStroke();
    ellipse(touches[0].x, touches[0].y, 30, 30);
      tracing.userPoints.push(new Point(touches[0].x, touches[0].y, color(0 + distance * 20, 255-distance * 20, 0), distance));
    
    tracing.score = Point.averageDistance(tracing.userPoints, tracing.maxTargetDistance);
    
    tracing.screenPressed = true;
  }
  if(touches.length == 0) {
    tracing.pencilSound.stop();
    tracing.screenPressed = false;
  }
  
  
  tracing.accuracy = map(tracing.score, 0, 20, 100, 0);
  
  if(tracing.accuracy < 0) {
    tracing.accuracy = 0;
  }
  
  fill(0);
  textSize(30);
  noStroke();
  textAlign(LEFT);
  textStyle(BOLD);
  text(floor(tracing.accuracy) + "% Accuracy", 10, 30);
  
  Point.displayUserPoints(tracing.userPoints);

  
  //handle pressing the submit button
  
}

function tracingReset() {
  tracing.score = 0;
  tracing.accuracy = 0;
  tracing.userPoints = [];
}

class Point {
  constructor(x,y,color,distance) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.distance = distance;
  }
  
  static displayShape(points) {
    stroke(0);
    strokeWeight(5);
    beginShape(LINES);
    for(let i = 0; i < points.length; i+=5) {
      vertex(points[i].x, points[i].y);
    }
    endShape(CLOSE);
  }
  
  static displayUserPoints(points) {
    for(let i = 1; i < points.length; i ++) {
      stroke(points[i].color);
      strokeWeight(8);
      line(points[i].x, points[i].y, points[i-1].x, points[i-1].y)
    }
  }
  
  static createShape(x, y, numPoints, xRadius, yRadius, amplitude, period) {
    let points = [];
    let angle = 0;
    const SEED = random(1, 99999);
    
    for(let i = 0; i < numPoints; i ++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI);
      
      let xOff = cos(angle);
      let yOff = sin(angle);
      let noiseMagnitude = amplitude * noise(xOff * period + SEED, yOff * period + SEED);
      let pointX = x + (xRadius + noiseMagnitude) * cos(angle);
      let pointY = y + (yRadius + noiseMagnitude) * sin(angle);
      
      //ensures slope isn't straight up or down
      if(i > 0 && distFromLine(pointX, pointY, points[i-1].x, points[i-1].y, 0, 0) < 0) {
        points = Point.createPoints(x, y, numPoints, xRadius, yRadius, amplitude, period);
        break;
      
      }
      
      points.push(new Point(pointX, pointY));
    }
    
    
    return points;
  }
  
  static averageDistance(points, targetMaxDistance) {
    
    if(points.length <= 0) {
      return 0;
    }
    
    let sum = 0;
    
    for(let i = 0; i < points.length; i ++) {
      if(points[i].distance > targetMaxDistance) {
        sum += points[i].distance;
      }
    }
    
    
    
    return sum / points.length;
  }
  
  static pointIsOverPoints(points, x, y, dist) {
    for(let i = 0; i < points.length; i ++) {
      if(distFromLine(points[i-1].x,points[i-1].y,points[i].x, points[i].y, x, y) < dist && 
         Point.pointIsWithinBounds(x, y, points[i].x, points[i].y, points[i-1].x, points[i-1].y)) {
          return true;
      }
    }
    
    return false;
  }
  
  
  static bestDistFromShape(points, x, y) {
    
    let min = 99999;
    
    for(let i = 0; i < points.length; i ++) {
      let x1;
      let y1;
      let x2;
      let y2;
      
      if(i < 1) {
        x1 = points[0].x;
        y1 = points[0].y;
        x2 = points[points.length-1].x;
        y2 = points[points.length-1].y;
      }
      else {
        x1 = points[i].x;
        y1 = points[i].y;
        x2 = points[i-1].x;
        y2 = points[i-1].y;
        
      }
      
      if(!Point.pointIsWithinBounds(x,y,x1,y1,x2,y2)) {
        if(i == 3) {
        }
        continue;
      }
      
      let distance = distFromLine(x1,y1,x2,y2,x,y);
      if(distance < min) {
        min = distance;
      }
    }
    return min;
    
  }
  
  static distFromClosestPoint(x, y, points) {
    let min = points[0];
    for(let i = 0; i < points.length; i ++) {
      if(dist(x,y,points[i].x,points[i].y) < dist(x,y,min.x, min.y)) {
        min = points[i];
      }
    }
    
    return dist(x, y, min.x, min.y);
  }
  
  
  static pointIsWithinBounds(x, y, x1, y1, x2, y2) {
    
    let xIntersect = pointOfIntersection(x, y , x1, y1, x2, y2).x;
    let yIntersect = pointOfIntersection(x, y , x1, y1, x2, y2).y;
    
    if(((xIntersect >= x1 && xIntersect <= x2) || (xIntersect >= x2 && xIntersect <= x1)) ||
       ((yIntersect >= y1 && yIntersect <= y2) || (yIntersect >= y2 && yIntersect <= y1))) {
      return true;
    }
     else {
       return false;
     }
  }
  
  static shapeIsDrawn(points, distance, endpointDist) {
    

    
    if(points.length < 2) {
      return false;
    }
    
    let quarterIndex = floor(points.length / 4);
    let threeQuartersIndex = floor(3 * points.length / 4);
    let quarterPos = createVector(points[quarterIndex].x, points[quarterIndex].y);
    let threeQuartersPos = createVector(points[threeQuartersIndex].x, points[threeQuartersIndex].y);
    
    if(dist(quarterPos.x, quarterPos.y, threeQuartersPos.x, threeQuartersPos.y) < endpointDist) {
      return false;
    }
    
    if(points[1].x > points[0].x && points[points.length-1].x > points[0].x) {
      return false;
    }
    if(points[1].x < points[0].x && points[points.length-1].x < points[0].x) {
      return false;
    }
    
    if(dist(points[0].x, points[0].y, points[points.length-1].x, points[points.length-1].y) > endpointDist) {
      return false;
    }
    for(let i = 0; i < points.length-2; i ++) {
      for(let j = i+1; j < points.length-1; j ++) {
        if(dist(points[i].x, points[i].y, points[j].x, points[j].y) > distance) {
          return true;
        }
      }
    }
    
    return false;
    
    
  }

  static greatestDistFromOtherPoints(point, points) {
    let max = 0;
    for(let i = 0; i < points.length; i ++) {
      let distance = dist(point.x, point.y, points[i].x, points[i].y);
      if(distance > max) {
        max = distance;
      }
    }
    
    return max;
  }
  
  static addUserPoint() {
    //I just need to put the code from the draw and move it to here for organization
  }

}

//given a line containing points (x1,y1) and (x2, y2),
//find the difference between that line and point (x3, y3)
function distFromLine(x1,y1,x2,y2,x3,y3) {
  
  if(x2 == x1 || y2 == y1) {
    return -1;
  }
  
  let slope = (y2 - y1) / (x2 - x1);
  let a = -slope;
  let b = 1;
  let c = -a * x1 - y1;
  let numerator = abs(a*x3 + b*y3 + c);
  let denominator = sqrt(a*a+b);
  
  return numerator / denominator;
}

function slopeBehavior(x1, y1, x2, y2) {
  let slope = (y2 - y1) / (x2 - x1);
  return abs(slope);
}

function pointOfIntersection(x, y, x1, y1, x2, y2) {
  let a1 = -((y2 - y1) / (x2 - x1));
  let a2 = -1/a1;
  let b1 = 1;
  let b2 = 1;
  let c1 = -a1 * x1 - y1;
  let c2 = -a2 * x - y;
  let xIntersect = (b1*c2-b2*c1)/(a1*b2-a2*b1);
  let yIntersect = (c1*a2-c2*a1)/(a1*b2-a2*b1);
  
  return createVector(xIntersect, yIntersect);
  
}