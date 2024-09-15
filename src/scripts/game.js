import Fruits from "./elements/fruits";
import Greedy from "./elements/greedy";
import KeyManager from "./keyManager";
import citronImgSrc from './assets/images/citron.png';
import ananasImgSrc from './assets/images/ananas.png';
import pommeImgSrc from './assets/images/pomme.png';
import greedyImgSrc from './assets/images/greedy.png';
import Hungries from "./elements/hungries";
import GameElements from "./elements/gameElements";

export default class Game {

   #canvas;
   // à compléter

   constructor(canvas) {
      this.#canvas = canvas;
      this.context = canvas.getContext('2d');
      this.keyManager = new KeyManager();
      this.raf = null;
      this.greedy = new Greedy(greedyImgSrc,350,200);
      this.fruit = new Array();
      this.fruitSpawnInterval = null;
      this.fruitDeleteInterval = null;
      this.hungries= [this.newHungry()];
   }

   /** donne accès au canvas correspondant à la zone de jeu */
   get canvas() {
      return this.#canvas;
   }

   startAndStop() {
      if (this.raf != null) {
         // stop
         this.deathScreen(0);
         document.getElementById('stopAndStartGame').textContent='Play';
         window.cancelAnimationFrame(this.raf);
         this.raf = null;
         clearInterval(this.fruitSpawnInterval);
         clearInterval(this.fruitDeleteInterval);
      }
      else {
         // start
         this.hungries = [this.newHungry()];
         document.getElementById('stopAndStartGame').textContent='Stop';
         let livesElmts = document.querySelectorAll("#lifes *");
            livesElmts.forEach((lifeElmt, i) => lifeElmt.style.opacity = "1");
         this.raf=window.requestAnimationFrame(()=>this.animate());
         this.fruitSpawnInterval=setInterval(()=>this.addFruit(),3000);
         this.fruitDeleteInterval=setInterval(()=>this.fruit.shift(),8000);
      }
   }

   animate(){
      this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.greedy.handleMoveKeys(this.keyManager);
      this.greedy.move(this.#canvas);
      
      // check collision greedy / fruits
      this.fruit = this.fruit.filter(fruit => !this.greedy.checkCollisions(fruit)); //filter crée un nvo array
      
      // check collision hungries fruit
      this.hungries.forEach(hungry => hungry.move(this.#canvas));
      this.fruit = this.fruit.filter(fruit => {
         let safe = true;
         this.hungries.forEach(hungry => safe && !hungry.checkCollisions(fruit));
         return safe;
      });

      // check si hungry a collide avec son target
      let count = 0;
      this.hungries.forEach(hungry => {
         // vies
         if(this.greedy.checkCollisions(hungry)) {
            hungry.life = 0;
            this.greedy.life = this.greedy.lives - 1; // ouch
            let livesElmts = document.querySelectorAll("#lifes *");
            livesElmts.forEach((lifeElmt, i) => lifeElmt.style.opacity = (this.greedy.lives > i) ? "1" : ".5");
            if(this.hungries.length == 1) {
               // death screen
               this.startAndStop();
            }
         }

         // manger
         else if (hungry.target) {
            if(hungry.checkCollisions(hungry.target)) {
               hungry.fruitCounter ++;
               hungry.changeTarget(null);
               // remove le fruit vu que les collisions sont bizarres
               let idx = this.fruit.indexOf(hungry.target)
               this.fruit.splice(idx);

               if(hungry.fruitCounter >= 7) {
                  hungry.fruitCounter = 0;
                  count++;
               }

               if(this.fruit.length > 0) {
                  hungry.changeTarget(this.randomFruit());
               }
            }
         } else {
            if(this.fruit.length > 0) {
               hungry.changeTarget(this.randomFruit());
            }
         }
      });
      // ajout hungries
      this.hungries = this.hungries.filter(h => h.isAlive());
      for(let i = 0; i < count; ++i) {
         this.hungries.push(this.newHungry());
      }

      // dessine
      this.hungries.forEach(hungry => hungry.draw(this.context));
      this.fruit.forEach(fruit=>fruit.draw(this.context));
      this.greedy.draw(this.context);

      this.raf=window.requestAnimationFrame(()=>this.animate());
   }

   randomImg(){
      let res = Math.floor(Math.random()*3);
      let imgSrc = [ananasImgSrc,pommeImgSrc,citronImgSrc];
      return imgSrc[res];
  }

  newHungry(){
   const coords = this.randomCoord();
   const newHungry = new Hungries(coords[0],coords[1], this.greedy);
   return newHungry;
  }

  randomCoord(){
      let res1 = Math.floor(Math.random()*(801-64));
      let res2 = Math.floor(Math.random()*(450-64));
      return [res1,res2];
   }

   randomFruit(){
      const index =Math.floor(Math.random()*(this.fruit.length));
      return this.fruit[index];
   }

   addFruit(){
      const img = this.randomImg();
      const coords = this.randomCoord();
      const newFruit = new Fruits(img,coords[0],coords[1]);
      this.fruit.push(newFruit);
   }

   keyDownActionHandler(event) {
      switch (event.key) {
          case "ArrowLeft":
          case "Left":
              this.keyManager.leftPressed();
              break;
          case "ArrowRight":
          case "Right":
              this.keyManager.rightPressed();
              break;
          case "ArrowUp":
          case "Up":
              this.keyManager.upPressed();
              break;
          case "ArrowDown":
          case "Down":
              this.keyManager.downPressed();
              break;
          default: return;
      }
      
  }
  keyUpActionHandler(event) {
      switch (event.key) {
         case "ArrowLeft":
         case "Left":
            this.keyManager.leftReleased();
            break;
         case "ArrowRight":
         case "Right":
            this.keyManager.rightReleased();
            break;
          case "ArrowUp":
          case "Up":
              this.keyManager.upReleased();
              break;
          case "ArrowDown":
          case "Down":
              this.keyManager.downReleased();
              break;
         default: return;
      }
      event.preventDefault();
   }

   deathScreen(score) {
      this.#canvas.style.zIndex -= 2;
   }
}



