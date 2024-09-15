/*defines game elements such as greedy, fruits, hungries*/
export default class GameElements{
    image;
    #x;
    #y;
    #deltaX;
    #deltaY;
    /*
    Builds game element 
    @param String the img source
    @param int x the x coordinate
    @param int y the y coordinate
    @param deltaX the x axis speed
    @param deltaY the y axis speed
    */
   constructor(imgSrc,x,y,deltaX=0,deltaY=0){
        this.image = this.#createImage(imgSrc);
        this.#x=x;
        this.#y=y; //# means private
        this.#deltaX = deltaX;
        this.#deltaY = deltaY;
   }

   /* Draws an element into the canva */
   draw(context){
    context.drawImage(this.image,this.#x,this.#y);
   }

   /* Creates an img element for the constructor */
   #createImage(imageSource){
    const newImg = new Image();
    newImg.src = imageSource;
    return newImg;
   }

        /**
     * Checks for collisions with other elements
     * 
     * @param {*} object The object to check collisions
     * @returns True if collision detected, else false
     */
    checkCollisions(object) {
    const p1 = [Math.max(this.x, object.x), Math.max(this.y, object.y)];
    const p2 = [Math.min(this.x + this.image.width, object.x + object.image.width), Math.min(this.y + this.image.height, object.y + object.image.height)];
    return (p1[0] < p2[0] && p1[1] < p2[1]);
    }

     /**
     * Moves the element by adding deltaX and deltaY to x and y
     */
    move() {
        this.#x = this.#x + this.#deltaX;
        this.#y = this.#y + this.#deltaY;
    }

    /* Getters and setters */
    set x(value){
        this.#x=value;
    }

    set y(value){
        this.#y=value;
    }

    set deltaX(value){
        this.#deltaX=value;
    }

    set deltaY(value){
        this.#deltaY=value;
    }

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }

    get deltaX(){
        return this.#deltaX;
    }

    get deltaY(){
        return this.#deltaY;
    }

    get width() {
        return this.image.width;
      }

    get height() {
        return this.image.height;
    }

}