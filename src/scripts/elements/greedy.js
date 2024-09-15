import Fruits from "./fruits";
import GameElements from "./gameElements";

export default class Greedy extends GameElements{
    points;
    lives;
    hasEaten;
    
    constructor(imgSrc,x,y,deltaX=0,deltaY=0,){
        super(imgSrc,x,y,deltaX,deltaY);
        this.points = 0;
        this.lives=3;
        this.hasEaten=false;
    }

    /* Checks for collisions between different objects and according to hit object applies the necessary efffect */
    checkCollisions(object) {
        const p1 = [Math.max(this.x, object.x), Math.max(this.y, object.y)];
        const p2 = [Math.min(this.x + this.image.width, object.x + object.image.width), Math.min(this.y + this.image.height, object.y + object.image.height)];
        if(p1[0] < p2[0] && p1[1] < p2[1]){
            if(object instanceof Fruits){
                const totalPoints = document.getElementById("score");
                totalPoints.textContent=parseInt(totalPoints.textContent)+100;
                this.points+=100; //keeping points to keep,track of points without having to laucnh the game
                this.hasEaten=true;
            } else {
                this.lives-=1;
            }
        }
        return (p1[0] < p2[0] && p1[1] < p2[1]);
    }

    draw(context) {
        context.drawImage(this.image,this.x,this.y);
    }

    isAlive(){
        return this.lives>0;
    }

    get lives(){
        return this.lives;
    }

    get points(){
        return this.points;
    }

    moveLeft() {              
        this.deltaX =  - 5;   // le déplacement se fera vers la gauche, par pas de 10px
     }
    moveRight() {
        this.deltaX =  + 5;   // le déplacement se fera vers la droite, par pas de 10px
     }
    moveUp(){
        this.deltaY = - 5;
    }
    moveDown(){
        this.deltaY = + 5;
    }
    stopMoving() {
        this.deltaX = 0;
        this.deltaY = 0;
     }
    move(box) {              // déplace sans sortir des limites de *box*
        this.x = Math.max(0, Math.min(box.width - this.width, this.x + this.deltaX));
        this.y = Math.max(0, Math.min(box.height - this.height, this.y + this.deltaY));
     }
     
    handleMoveKeys(keyManager) {
        this.stopMoving();    // on réinitialise les déplacements
        if (keyManager.left)  // touche flèche gauche pressée ?
           this.moveLeft();
        if (keyManager.right) // touche flèche droite pressée ?
           this.moveRight();
        if (keyManager.up)
            this.moveUp();
        if (keyManager.down)
            this.moveDown();
     }
}