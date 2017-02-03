export class Firework {
    coordinates: number[][];
    vx: number;
    vy: number;
    brightness: number;
    fuseTime: number;
    currentTime: number;

    constructor(public x: number, public y: number, public targetX: number, public targetY: number){
        this.coordinates = [];
        this.coordinates.push([x, y]);

        let angle = Math.atan2(targetY - y, targetX - x);
        let speed = this.getRange(10, 13);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.brightness = this.getRange(50, 70);

        this.fuseTime = 100;
        this.currentTime = 0;
    }

    update(): boolean {
        //remove last coordinate, add current coordinate
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.vy = this.vy + 0.1;
        this.currentTime++;

        //blow up if fuse timer runs out, or near edges
        if(this.fuseTime <= this.currentTime || this.x < 50 || this.x > 500 - 50 || this.y < 50) {
            return true;
        } else {
            this.x += this.vx;
            this.y += this.vy;
            return false;
        }
    }

    draw(ctx: CanvasRenderingContext2D, hue: number): void {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = 'hsl(' + hue + ',100%,' + this.brightness + '%';
        ctx.stroke();
    }

    getRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}