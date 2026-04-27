export class Pencil {
    constructor(posX, posY, fill, estilo) {
        this.antX = posX;
        this.antY = posY;
        this.posX = posX;
        this.posY = posY;
        this.fill = fill;
        this.estilo = estilo;
    } // constructor()

    moveTo(posX, posY) {
        this.antX = this.posX;
        this.antY = this.posY;
        this.posX = posX;
        this.posY = posY;
    } // moveTo()

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.fill;
        ctx.lineWidth = this.estilo;
        ctx.lineCap = "round";
        ctx.moveTo(this.antX, this.antY);
        ctx.lineTo(this.posX, this.posY);
        ctx.stroke();
        ctx.closePath();
     } // draw()

} // class Pen