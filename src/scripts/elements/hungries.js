import GameElements from "./gameElements";
import Fruits from "./fruits";
import imgSrc from "../assets/images/hungry.png"

export default class Hungries extends GameElements{
    fruitCounter;
    #lives;
    hasEaten;
    

    constructor(x,y,greedy,deltaX=0,deltaY=0) {
        super(imgSrc,x,y,);
        this.fruitCounter = 0;
        this.#lives = 1;
        this.hasEaten=false;
        this.target=null;
        this.greedy = greedy;
    }

    //need to code move

    /* Checks for collisions between different objects and according to hit object applies the necessary efffect */
    checkCollisions(object) {
        const p1 = [Math.max(this.x, object.x), Math.max(this.y, object.y)];
        const p2 = [Math.min(this.x + this.image.width, object.x + object.image.width), Math.min(this.y + this.image.height, object.y + object.image.height)];
        if(p1[0] < p2[0] && p1[1] < p2[1]){
            if(object instanceof Fruits){
                this.hasEaten=true;
            } else {
                this.life-=1;
            }
        }
        return (p1[0] < p2[0] && p1[1] < p2[1]);
    }

    move(canvas) {
        if(this.target) {
            this.moveTo(this.target);
        } else {
            this.moveTo(this.greedy);
        }

        let width = canvas.width;
        let height = canvas.height;
        if(this.x+64+this.deltaX>=width||this.x+this.deltaX<=0){
          this.deltaX=-this.deltaX;
        } if (this.y+57+this.deltaY>=height||this.y+this.deltaY<=0){
          this.deltaY=-this.deltaY;
        }
        this.x=this.x+this.deltaX;
        this.y=this.y+this.deltaY; //pourqu'il aille plus vite 
    }

    moveTo(fruit){
        const dist = Math.sqrt((this.x-fruit.x)**2+(this.y-fruit.y)**2);
        this.deltaX=(fruit.x-this.x)/dist;
        this.deltaY=(fruit.y-this.y)/dist;
    }

    isAlive(){
        return this.lives>0;
    }

    changeTarget(target) {
        this.target = target;
    }

    get lives(){
        return this.#lives;
    }

    get fruitCounter(){
        return this.fruitCounter;
    }

    set life(value){
        this.#lives = value;
    }

    set fruitCounter(value){
        this.fruitCounter=value;
    }
}