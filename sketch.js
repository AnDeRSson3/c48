var game;
var database
var form;
var player;
var playerCount =0, gameState =0;
var allPlayers = [];
var base, middle, base1;
var bullet, bullet1;
var bullets1grp, bullets2grp;
var p1, p2;
var players =[];
var bg;
var playerImg, playerImg2;
function preload(){
  base = loadImage("base.png")
  bg = loadImage("dirt.jpg");
  playerImg = loadImage("player1.png")
  bullet = loadImage("bullet.png")
  playerImg2 = loadImage("player2.png")
  bullet1 = loadImage("bullet(1).png")
}

function setup() 
{

  createCanvas(windowWidth, windowHeight);
  database = firebase.database()
  game = new Game();
  game.getState();
  game.start();
}

function draw() 
{
background(51);
if(playerCount ==2){
  game.update(1);

}

if(gameState == 1){
  game.play();
}

if (gameState === 2) {
  game.end();
}


}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

