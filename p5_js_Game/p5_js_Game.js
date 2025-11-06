let numStars = 20; 
let starX = [];
let starY = [];
let starSize = [];
let starColor = [];
let isDanger = [];
let isBonus = [];
let isPenalty = [];
let isYellow = [];
let starSpeed = [];

let playerY;
let score = 0;
let gameOver = false;
let gameStarted = false;

let lastMilestone = 0;
let nextGoldMilestone = 100;

let redProb = 0.01;
let blueProb = 0.001;
let greenProb = 0.001;

let normalSpeed = 3;
let redSpeed = 5;
let blueSpeed = 2.5;
let greenSpeed = 3.5;

let goldStars = [];

let popupText = "";
let popupTimer = 0;
let popupDuration = 120;
let milestoneText = "";
let milestoneTimer = 0;
let milestoneDuration = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerY = height - 30;
  for (let i = 0; i < numStars; i++) resetStar(i);
}

function draw() {
  background(0);

  if(!gameStarted){
    fill(255);
    textAlign(CENTER);
    textSize(48);
    text("Click to Start!", width/2, height/2);
    return;
  }

  if (gameOver) {
    fill(255, 50, 50);
    textAlign(CENTER);
    textSize(60);
    text("GAME OVER!", width / 2, height / 2 - 20);
    textSize(30);
    text("Click to restart", width / 2, height / 2 + 50);
    return;
  }

  // Difficulty increase every 25 points
  if (score >= lastMilestone + 25) {
    lastMilestone = score - (score % 25);
    redProb = min(redProb + 0.002, 0.20);
    blueProb = min(blueProb + 0.001, 0.05);
    greenProb = blueProb;
  }

  // Increase green stars slightly more after 150 points
  if(score >= 150){
    greenProb = min(greenProb + 0.02, 0.12);
  }

  // Gold stars
  if(score >= nextGoldMilestone){
    goldStars.push({x:30, y:30 + goldStars.length*40});
    nextGoldMilestone += 100;
    milestoneText = `⭐ Milestone: ${score}! ⭐`;
    milestoneTimer = milestoneDuration;
  }

  // Player
  fill(255);
  rect(mouseX - 25, playerY, 50, 10);

  // Stars
  for (let i = 0; i < numStars; i++) {
    starY[i] += starSpeed[i];

    // Draw stars
    if(isBonus[i]){
      noStroke();
      fill(0,0,255,40);
      circle(starX[i], starY[i], starSize[i]*2.6);
      let tw = starSize[i] + sin(frameCount*0.35+i)*6;
      fill(starColor[i]);
      circle(starX[i], starY[i], tw);
    } else if(isPenalty[i]){
      // Glowing effect for green penalty stars
      let glow = 20 + sin(frameCount * 0.2 + i) * 10;
      noStroke();
      fill(0,255,0,50);
      circle(starX[i], starY[i], starSize[i]*2 + glow);
      fill(starColor[i]);
      circle(starX[i], starY[i], starSize[i]);
    } else {
      let tw = starSize[i] + sin(frameCount*0.1+i)*3;
      fill(starColor[i]);
      circle(starX[i], starY[i], tw);
    }

    // Collision
    if(starY[i] > playerY-5 && starY[i] < playerY+10 &&
       starX[i] > mouseX-25 && starX[i] < mouseX+25){

      if(isDanger[i]){
        gameOver = true;
      } else if(isBonus[i]){
        score += 10;
        popupText = "+10!";
      } else if(isPenalty[i]){
        score = max(0,score-5);
        popupText = "-5!";
      } else if(isYellow[i]){
        score += 2;
        popupText = "+2!";
      } else{
        score++;
        popupText = "+1!";
      }
      popupTimer = (score>=100)?60:120;
      resetStar(i);
    }

    if(starY[i] > height) resetStar(i);
  }

  // Gold stars
  for(let g=0; g<goldStars.length; g++){
    let gs = goldStars[g];
    fill(255,215,0);
    noStroke();
    circle(gs.x, gs.y, 20);
    fill(255);
    textAlign(CENTER);
    textSize(12);
    text("⭐", gs.x, gs.y+4);
  }

  // Popups
  if(popupTimer>0){
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text(popupText, width/2, height/2-100);
    popupTimer--;
  }

  if(milestoneTimer>0){
    fill(255,215,0);
    textSize(36);
    textAlign(CENTER);
    text(milestoneText, width/2, height/2);
    milestoneTimer--;
  }

  fill(200);
  textAlign(CENTER);
  textSize(22);
  text("Score: "+score, width/2,30);
  textSize(14);
  text("Red = GAME OVER • Blue = +10 • Green = -5 • Yellow = +2", width/2,55);
}

function resetStar(i){
  starX[i] = random(width);
  starY[i] = random(-300,-20);
  starSize[i] = random(8,15);

  let r = random();
  if(r<blueProb){
    starColor[i]=color(0,0,255); isBonus[i]=true; isPenalty[i]=false; isDanger[i]=false; isYellow[i]=false; starSpeed[i]=blueSpeed;
  } else if(r<blueProb+greenProb){
    starColor[i]=color(0,255,0); isBonus[i]=false; isPenalty[i]=true; isDanger[i]=false; isYellow[i]=false; starSpeed[i]=greenSpeed;
  } else if(r<redProb+blueProb+greenProb){
    starColor[i]=color(255,0,0); isBonus[i]=false; isPenalty[i]=false; isDanger[i]=true; isYellow[i]=false; starSpeed[i]=redSpeed;
  } else{
    if(random()<0.5){ starColor[i]=color(255,255,0); isYellow[i]=true; }
    else{ starColor[i]=color(255); isYellow[i]=false; }
    isBonus[i]=false; isPenalty[i]=false; isDanger[i]=false; starSpeed[i]=normalSpeed;
  }
}

function mousePressed(){
  if(!gameStarted){ 
    gameStarted=true; 
    return; 
  }

  score = 0;
  gameOver = false;
  lastMilestone = 0;
  nextGoldMilestone = 100;
  goldStars = [];
  popupTimer = 0;
  milestoneTimer = 0;

  redProb = 0.01;
  blueProb = 0.001;
  greenProb = 0.001;

  for(let i=0; i<numStars; i++) resetStar(i);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  playerY = height-30;
}
