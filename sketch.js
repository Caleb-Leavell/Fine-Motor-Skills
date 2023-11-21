document.addEventListener("touchstart", function(e){
e.preventDefault();
},{passive: false});

let buttons;
let screenSize = [innerWidth, innerHeight];
if (innerWidth/innerHeight > 0.66667){
  screenSize[0] = innerHeight*0.66667;
}
let mainHomeImg;
let subHomeImg;
let volumeOn = true;
let volOnImg;
let volOffImg;
let pauseImg;
let paused = false;
let returnScene;


let escape = {
  touchingFlag: false,
  objStartPos: [[screenSize[0]/2-55, screenSize[1]/2-80],
                [screenSize[0]/2+5, screenSize[1]/2-80],
                [screenSize[0]/2-55, screenSize[1]/2-25],
                [screenSize[0]/2+5, screenSize[1]/2-25],
                [screenSize[0]/2-55, screenSize[1]/2+30],
                [screenSize[0]/2+5, screenSize[1]/2+30]],
  objects: [],
  //objects: [0:escaped, 1:x, 2:y, 3:xVel, 4:yVel, 5:gone, 6:img, 7:name]
  gone: "",
  messageTimer: null,
  lives: 3,
  heartImg: null,
  brokenHeartImg: null,
  backgroundImg: null,
  clickSound: null,
  lifeLoseSound: null
}

let pinching = {
  pos: null,
  rWidth: 100,
  rHeight: 50,
  targetPos: null,
  targetWidth: null,
  targetHeight: null,
  targetError: 10,
  //higher = less precision needed to match to target
  timeGiven: 21,
  //number of seconds the game will last
  timeLeft: 21,
  //time left for the user
  currentTime: null,
  //used to check if a second has passed
  collectSound: null,
  completionSound: null,
  backgroundImg: null
}

let reflexes = {
  //Coins
  coins: {
    num: 5,
    pos: [],
    diameter: [],
    minDiameter: 25,
    maxDiameter: 25,
    velocity: [],
    minSpeed: 4,
    maxSpeed: 8,
    colorVal: [255, 215, 0],
    color: null,
    img: null
  },
  //Enemies
  enemies: {
    num: 4,
    pos: [],
    diameter: [],
    minDiameter: 30,
    maxDiameter: 50,
    velocity: [],
    minSpeed: 3,
    maxSpeed: 6,
    numPoints: 10,
    colorVal: [255, 0, 0], //rgb value
    color: null
  },
  //Basket (it uses the button class)
  basket: null,
  basketIsPressed: false,
  //scores
  score: 0,
  highscore: 0,
  //max spawn height
  MAX_SPAWN_HEIGHT: 1000,
  //difficulty ramping
  ramp: 0,
  rampingRate: 0.0001,
  collectCoinSound: null,
  loseSound: null,
  backgroundImg: null
}

let tracing = {
  shape: [],
  userPoints: [],
  screenPressed: false,
  score: 0,
  difficulty: "easy",
  circleIsDrawn: false,
  maxTargetDistance: 3,
  maxEndpointDistance: 15,
  accuracy: 0,
  bestAccuracy: {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0
  },
  shapeAmplitude: 50,
  shapePeriod: 0.5,
  pencilSound: null,
  completionSound: null,
  backgroundImg: null
}


let scores = {
  pinching: {
    score: 0,
    highscore: 0
  },
  
  escape: {
    score: 0,
    highscore: 0
  }
}





let scene = "main-home";

/*
  ESCAPE SUBSCENES
    
  escape-home
  escape-game
  escape-menu
  escape-howto


  PINCHING SUBSCENES
    
  pinching-home
  pinching-game
  pinching-menu
  pinching-howto


  OTHER SCENES
  
  main-home
  not-done
  tracing-home
  reflexes-home
  credits
  
*/




function preload(){
  
  escape.heartImg = loadImage('assets/heart.png');
  escape.brokenHeartImg = loadImage('assets/brokenHeart.png');
  escape.backgroundImg = loadImage('assets/grassBackground.jpg');
  pinching.backgroundImg = loadImage('assets/mountainBackground.jpg');
  reflexes.coins.img = loadImage('assets/coin.png');
  reflexes.backgroundImg = loadImage('assets/skyBackground.jpg');
  tracing.backgroundImg = loadImage('assets/tracingBackground.jpg');
  mainHomeImg = loadImage('assets/homeBackground.jpg');
  subHomeImg = loadImage('assets/subHomeBackground.jpg');
  volOnImg = loadImage('assets/volumeOn.png');
  volOffImg = loadImage('assets/volumeOff.png');
  pauseImg = loadImage('assets/pause.png');
  
  
  
  soundFormats('wav', 'mp3');
  escape.clickSound = loadSound('assets/click.wav');
  escape.lifeLoseSound = loadSound('assets/lifeLose.wav');
  pinching.collectSound = loadSound('assets/collectSound.wav');
  pinching.completionSound = loadSound('assets/completion.wav');
  reflexes.collectCoinSound = loadSound('assets/collectCoin.wav')
  reflexes.loseSound = loadSound('assets/lose.wav');
  tracing.pencilSound = loadSound('assets/pencil.mp3');
  tracing.completionSound = loadSound('assets/completion.wav');
}

function setup() {
  createCanvas(screenSize[0], screenSize[1]);
  resetEscapeGame();
  pinchingSetup();
  reflexesSetup();
  
  buttons = {
    escape: {
      home: {
        playButton: new button(20, 0.486*height, width - 40, 0.135*height, "Play", color(0,71,171), color(200,200,255), "escape-home", "escape-game", 10),
      homeButton: new button(20, 0.811*height, width - 40, 0.135*height, "Home", color(0,71,171), color(200,200,255), "escape-home", "main-home", 10),
      howtoButton: new button(20, 0.649*height, width - 40, 0.135*height, "How To", color(0,71,171), color(200, 200, 255), "escape-home", "escape-howto", 10)
      },
      howto: {
    homeButton: new button(20, 340, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "escape-howto", "escape-home", 10)
      },
      gameover: {
        playButton: new button(20, 200, width - 40, 100, "Play Again", color(0,71,171), color(200,200,255), "escape-game-over", "escape-game", 10),  
    homeButton: new button(20, 320, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "escape-game-over", "escape-home", 10)
      },
      pauseButton: new button(width-70, 20, 50, 50, "", color(0,71,171), color(200,200,255), "escape-game", "pause", 10)
    },
    
    
    main: {
      home: {
        escapeButton: new button(20, (0.554*height)-100, width/2 - 30, 100, "Escape", color(0,71,171), color(200,200,255), "main-home", "escape-home", 10),
        pinchingButton: new button(width/2 + 10, (0.554*height)-100, width/2 - 30, 100, "Pinching", color(0,71,171), color(200,200,255), "main-home", "pinching-home", 10),
        tracingButton: new button(20, (0.716*height), width/2 - 30, 100, "Tracing", color(0,71,171), color(200,200,255), "main-home", "tracing-home", 10),
        reflexesButton: new button(width/2 + 10, (0.716*height), width/2 - 30, 100, "Reflexes", color(0,71,171), color(200,200,255), "main-home", "reflexes-home", 10),
        volumeSwitch: new button(20, height-60, 50, 50, "", color(0,71,171), color(200,200,255), "main-home", "main-home", 10),
        creditsButton: new button(width-(width/4)-20, height-60, width/4, 50, "Credits", color(0,71,171), color(200,200,255), "main-home", "credits", 10)
        
      }
    },
    
    pinching: {
      home: {
        playButton: new button(20, 0.486*height, width - 40, 0.135*height, "Play", color(0,71,171), color(200,200,255), "pinching-home", "pinching-game", 10),
        homeButton: new button(20, 0.811*height, width - 40, 0.135*height, "Home", color(0,71,171), color(200,200,255), "pinching-home", "main-home", 10),
        howtoButton: new button(20, 0.649*height, width - 40, 0.135*height, "How To", color(0,71,171), color(200, 200, 255), "pinching-home", "pinching-howto", 10)
      },
      howto: {
        homeButton: new button(20, 340, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "pinching-howto", "pinching-home", 10)
      },
      gameover: {
        playButton: new button(20, 200, width - 40, 100, "Play Again", color(0,71,171), color(200,200,255), "pinching-game-over", "pinching-game", 10),  
        homeButton: new button(20, 320, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "pinching-game-over", "pinching-home", 10)
      },
      pauseButton: new button(width-70, 20, 50, 50, "", color(0,71,171), color(200,200,255), "escape-game", "pause", 10)
    },
    
    reflexes: {
      home: {
        playButton: new button(20, 0.486*height, width - 40, 0.135*height, "Play", color(0,71,171), color(200,200,255), "reflexes-home", "reflexes-game", 10),
        homeButton: new button(20, 0.811*height, width - 40, 0.135*height, "Home", color(0,71,171), color(200,200,255), "reflexes-home", "main-home", 10),
        howtoButton: new button(20, 0.649*height, width - 40, 0.135*height, "How To", color(0,71,171), color(200, 200, 255), "reflexes-home", "reflexes-howto", 10)
      },
      
      howto: {
        homeButton: new button(20, 340, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "reflexes-howto", "reflexes-home", 10),
      },
      
      gameover: {
        playButton: new button(20, 200, width - 40, 100, "Play Again", color(0,71,171), color(200,200,255), "reflexes-game-over", "reflexes-game", 10),
        homeButton: new button(20, 320, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "reflexes-game-over", "reflexes-home", 10),
      },
      pauseButton: new button(width-70, 20, 50, 50, "", color(0,71,171), color(200,200,255), "escape-game", "pause", 10)
    },
    
    tracing: {
      home: {
        play: new button(20, 0.486*height, width - 40, 0.135*height, "Play", color(0,71,171), color(200,200,255), "tracing-home", "tracing-difficulty", 10),
        howto: new button(20, 0.649*height, width - 40, 0.135*height, "How To", color(0,71,171), color(200,200,255), "tracing-home", "tracing-howTo", 10),
        home: new button(20, 0.811*height, width - 40, 0.135*height, "Home", color(0,71,171), color(200,200,255), "tracing-home", "main-home", 10)
      },
      
      gameOver: {
        home: new button(width - (width/4) - 10, 70, width / 4, 50, "Home", color(0,71,171), color(200,200,255), "tracing-game-over", "tracing-home", 10),
        play: new button(width - (width/4) - 10, 10, width / 4, 50, "Play Again", color(0,71,171), color(200,200,255), "tracing-game-over", "tracing-difficulty", 10)
      }, 
      
      difficulty: {
        easy: new button(20, height*0.135, width - 40, height*0.135, "Easy", color('lime'), color(150), "tracing-difficulty", "tracing-game", 10),
        medium: new button(20, height*0.297, width - 40, height*0.135, "Medium", color('orange'), color(150), "tracing-difficulty", "tracing-game", 10),
        hard: new button(20, height*0.459, width - 40, height*0.135, "Hard", color('maroon'), color(150), "tracing-difficulty", "tracing-game", 10),
        expert: new button(20, height*0.622, width - 40, height*0.135, "Expert", color(50,0,100), color(150), "tracing-difficulty", "tracing-game", 10),
        home: new button(50, height*0.838, width - 100, height*0.101, "Home", color(0,71,171), color("lightblue"), "tracing-difficulty", "tracing-home", 10)
      },
      
      howTo: {
        home: new button(20, 340, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "tracing-howTo", "tracing-home", 10)
      },
      
      pauseButton: new button(width-70, 20, 50, 50, "", color(0,71,171), color(200,200,255), "tracing-game", "pause", 10)
    },
    
    credits: {
      homeButton: new button(20, height-(height/4), width - 40, 100, "Home", color(0,71,171), color(200,200,255), "credits", "main-home", 10)
    },
    
    pause: {
      volumeSwitch: new button(20, height-60, 50, 50, "", color(0,71,171), color(200,200,255), "pause", "pause", 10),
      creditsButton: new button(width-(width/4)-20, height-60, width/4, 50, "Credits", color(0,71,171), color(200,200,255), "pause", "credits", 10),
      playButton: new button(20, 200, width - 40, 100, "Resume", color(0,71,171), color(200,200,255), "pause", "pause", 10),
      homeButton: new button(20, 320, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "pause", "main-home", 10),
    },
    
    
    
    tempToHome: new button(20, 400, width - 40, 100, "Home", color(0,71,171), color(200,200,255), "not-done", "main-home", 10)
  }
}


function draw() {
  background(220);
  if (scene == "escape-game"){
    runEscapeGame();
    buttons.escape.pauseButton.create();
    image(pauseImg, width-65, 25, 40, 40);
    if (buttons.escape.pauseButton.isPressed()){
      returnScene = "escape-game";
    }
    
  }
  if (scene == "escape-game-over") {
    escapeGameOver();
  }
  if (scene == "escape-home"){
    background(subHomeImg);
    escapeHome();
  }
  if (scene == "escape-howto"){
    escapeHowTo();
  }
  if (scene == "main-home"){
    mainHome();
  }
  
  
  if (scene == "pinching-home") {
    background(subHomeImg);
    scores.pinching.score = 0;
    pinching.timeLeft = pinching.timeGiven;
    pinchingHome();
  }
  if (scene == "pinching-game") {
    background(pinching.backgroundImg);
    //player rectangle
    doRectanglePinching(pinching.pos, pinching.rWidth, pinching.rHeight, 50);
    //target
    targetDisplay(pinching.targetPos, pinching.targetWidth, pinching.targetHeight);
    //time left and score
    displayTimeAndScore();
    
    buttons.pinching.pauseButton.create();
    image(pauseImg, width-65, 25, 40, 40);
    if (buttons.pinching.pauseButton.isPressed()){
      returnScene = "pinching-game";
    }
  }
  if (scene == "pinching-howto") {
    pinchingHowTo();
  }
  if (scene == "pinching-game-over") {
    pinchingGameOver();
  }
  
  
  if(scene == "reflexes-game") {
    reflexesGame();
    buttons.reflexes.pauseButton.create();
    image(pauseImg, width-65, 25, 40, 40);
    if (buttons.reflexes.pauseButton.isPressed()){
      returnScene = "reflexes-game";
    }
  }
  if(scene == "reflexes-game-over") {
    reflexesGameOver();
  }
  if(scene == "reflexes-howto") {
    reflexesHowTo();
  }
  if(scene == "reflexes-home") {
    reflexesHome();
  }
  
  
  if (scene == "tracing-home"){
    background(subHomeImg);
    tracingHome();
  }
  if(scene == "tracing-game") {
    background(tracing.backgroundImg);
    tracingGame();
    buttons.tracing.pauseButton.create();
    image(pauseImg, width-65, 25, 40, 40);
    if (buttons.tracing.pauseButton.isPressed()){
      returnScene = "tracing-game";
    }
  }
  if(scene == "tracing-game-over") {
    background(tracing.backgroundImg);
    tracingGameOver();
  }
  if(scene == "tracing-difficulty") {
    tracingDifficulty();
  }
  if(scene == "tracing-howTo") {
    tracingHowTo();
  }
  
  
  if (scene == "credits"){
    credits();
  }
  
  if (scene == "pause"){
    pause();
  }
  
  
  if (touches.length > 0 && scene != "pinching-game"){
    fill(255, 0, 0, 100);
    noStroke();
    ellipse(touches[0].x, touches[0].y, 75, 75);
  }
}

function mainHome(){
  background(mainHomeImg);
  
  buttons.main.home.escapeButton.create();
  buttons.main.home.escapeButton.isPressed();
  buttons.main.home.pinchingButton.create();
  buttons.main.home.pinchingButton.isPressed();
  buttons.main.home.tracingButton.create();
  buttons.main.home.tracingButton.isPressed();
  buttons.main.home.reflexesButton.create();
  buttons.main.home.reflexesButton.isPressed();
  buttons.main.home.volumeSwitch.create();
  if (buttons.main.home.volumeSwitch.isPressed()){
    volumeOn = !(volumeOn);
  }
  buttons.main.home.creditsButton.create();
  buttons.main.home.creditsButton.isPressed();
  
  if (volumeOn){
    image(volOnImg, 20, height-60, 50, 50);
  }else{
    image(volOffImg, 20, height-60, 50, 50);
  }
  
}


function credits(){
  background(204,230,255);
  
  buttons.credits.homeButton.create();
  buttons.credits.homeButton.isPressed();
  
  
  fill(0);
  noStroke();
  textSize(20);
  textStyle(NORMAL);
  textAlign(CENTER);
  text("iconfinder.com\nclipartmag.com\nstock.adobe.com\nalldesgincreative.com\nistockphoto.com\nmixkit.co", 20, height/2, width-30);
  
  textSize(25);
  textStyle(BOLD);
  text("These sites offered the free image and sound assets which were utilized.\nThank you!", 20, height/5, width-30);
}

function pause(){
  background(204,230,255);
  
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(50);
  textStyle(BOLD);
  text("PAUSED", 20, height/5, width-30);
  
  buttons.pause.volumeSwitch.create();
  if (buttons.pause.volumeSwitch.isPressed()){
    volumeOn = !(volumeOn);
  }
  buttons.pause.creditsButton.create();
  buttons.pause.creditsButton.isPressed();
  buttons.pause.playButton.create();
  if (buttons.pause.playButton.isPressed()){
    scene = returnScene;
  }
  buttons.pause.homeButton.create();
  buttons.pause.homeButton.isPressed();
  
  
  
  if (volumeOn){
    image(volOnImg, 20, height-60, 50, 50);
  }else{
    image(volOffImg, 20, height-60, 50, 50);
  }
}


function notDone(){
  textAlign(CENTER)
  textStyle(NORMAL);
  noStroke();
  fill("BLACK");
  textSize(25);
  let message = ":\(\n\nSorry, this game has not been implemented into this page yet. It is being worked on.\n\nIn the meantime, here's a complimentary home page button.";
  text(message, width/2-175, 50, 350, 275);
  
  buttons.tempToHome.create();
  buttons.tempToHome.isPressed();
}





