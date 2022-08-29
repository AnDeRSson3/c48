class Game {
    constructor() {

      this.resetButton = createButton("");
      this.plr1 = createElement("h2");
      this.plr2 = createElement("h2");
    }
    
    getState(){
      database.ref("gameState").on("value", data=>{
          gameState = data.val();
      })
    }

    update(state){
      database.ref("/").update({
        gameState : state
      })

    }
  
    start() {
      form = new Form();
      form.display();
      player = new Player();
      playerCount = player.getCount();

      p1 = createSprite(-967, 640,20, 20);
      p1.shapeColor = "green";
      p1.addImage(playerImg);
      p1.debug = true;
      p2 = createSprite(967, 640 ,20 ,20);
      p2.shapeColor = "red"
      p2.addImage(playerImg2);
      p2.debug = true;

      players = [p1, p2];
      
      base1 = createSprite(0, 200, 50, 50);
      base1.addImage(base);

      bullets1grp =new Group();
      bullets2grp = new Group();
    }

    handleElements() {
      form.hide();

      this.resetButton.class("resetButton");
      this.resetButton.position(width / 2 + 970, 50);

      this.plr1.position(width / 3 - 50, 80);
      this.plr1.class("playersText")

      this.plr2.position(width / 3 - 50, 130);
      this.plr2.class("playersText")
  
    }
  
    play() {
      this.handleElements();
      this.playerControl();
      this.handleResetButton();
      Player.getPlayersInfo();
      
      if (allPlayers !== undefined) {
        image(bg,-width*4, -height*4, width*5, height*5);
        this.showDetails();
        this.showHealth();
        this.showAmo();
        this.showBaseHealth();

        var index =0;
        for(var plr in allPlayers){
          index  = index +1;
          
          var x = allPlayers[plr].positionX;
          var y = height- allPlayers[plr].positionY;

          players[index-1].position.x = x;
          players[index-1].position.y = y;

          if(player.health <= 0){
            gameState = 2;
            player.alive = false;
            this.gameOver();
          }

          

          if(index ==1){
            console.log("player"+index)
            this.collisionWithBullets2();
          }else{
            console.log("player"+index)
            this.collisionWithBullets1();
          }
          if(index == player.index){
            this.handleBullets(index);
            camera.position.x = players[index-1].position.x
            camera.position.y = players[index-1].position.y
        
          }
        }

        
  
        drawSprites();
      }
    }
    playerControl(){
      if (keyIsDown(UP_ARROW) && player.positionY<3470){
        player.positionY += 10;
        player.update();
      }
      if (keyIsDown(DOWN_ARROW) && player.positionY>530){
        player.positionY -= 10;
        player.update();
      }
      if (keyIsDown(RIGHT_ARROW) && player.positionX <836){
        player.positionX += 10;
        player.update();
      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > -5000){
        player.positionX -= 10
        player.update();
      }

    }

    handleBullets(index){
      if(keyDown("space") && player.bullets>0){
        player.bullets -=1;
        player.update();
        this.spawnBullets(index)
      }
    }

    spawnBullets(index){
      
      if(index==1){
        var b1 = createSprite(player.positionX, height-player.positionY, 10, 10);
        b1.velocityX=30;
        b1.addImage(bullet1);
        b1.scale=0.07;
        bullets1grp.add(b1);
      }else{
        var b = createSprite(player.positionX, height-player.positionY, 10, 10);
        b.velocityX=-30;
        b.addImage(bullet);
        b.scale=0.07
        bullets2grp.add(b);
      }
      
    }

    handleResetButton() {
      this.resetButton.mousePressed(() => {
        database.ref("/").set({
          playerCount: 0,
          gameState: 0,
          players: {}
        });
        window.location.reload();
      });
    }

    //index ==2
    collisionWithBullets1(){
      players[1].overlap(bullets1grp,function(collector, collected){
        console.log("working");
        if(player.health>=0){
          players[2].health-=20;
          player.update();
          collected.remove()
        }
      })

    }
    collisionWithBullets2(){
      players[0].overlap(bullets2grp,function(collector, collected){
        console.log("working");
        if(player.health>=0){
          players[1].health-=20;
          player.update();
          collected.remove()
        }

      })
    }

      collisionWithBase(){
        players[0].overlap(bullets2grp,function(collector, collected){
          console.log("working base");
          if(player.baseHealth>=0){
            player.baseHealth-=40;
            player.update();
            collected.remove()
          }
        })
      
    }
  
    showDetails(){
      
      var plr1, plr2;
      var allP = Object.values(allPlayers)
      console.log(allP[0]);
      

       //plr1 = allPlayers[0].bullets +"&emsp;" +  allP[0].health;
       //plr2 = allPlayers[1].bullets +"&emsp;" +  allP[1].health;

      //this.plr1.html(plr1);
      //this.plr2.html(plr2);
      
    }  

    showHealth() {
      push();
      fill("white");
      rect(player.positionX, height - player.positionY - 400, 200, 20);
      fill("green");
      rect(player.positionX, height - player.positionY - 400, player.health, 20);
      noStroke();
      pop();
    }
  
    showAmo() {
      push();
      fill("white");
      rect(player.positionX, height - player.positionY - 350, 180, 20);
      fill("#ffc400");
      rect(player.positionX, height - player.positionY - 350, player.bullets*6 , 20);
      noStroke();
      pop();
    } 

    showBaseHealth() {
      push();
      fill("white");
      rect(player.positionX, height - player.positionY - 300, 200, 20);
      fill("red");
      rect(player.positionX, height - player.positionY - 300, player.baseHealth/5, 20);
      noStroke();
      pop();
    }

    gameOver() {
      swal({
        title: `Game Over`,
        text: "Try again!!!",
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize: "100x100",
        confirmButtonText: "Thanks For Playing"
      });
    }

    victory() {
      swal({
        title: `You Won!!!`,
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
    }

    end() {
      console.log("Game Over");
      console.log(player.alive);
      if(player.alive){
        this.victory();
      }
    }

    
    
  }
  