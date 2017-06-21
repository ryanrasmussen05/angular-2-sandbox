import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import { Particle } from "./particle";

interface PhysicsNormal {
    x: number;
    y: number;
}

@Component({
    selector: 'rr-particles',
    templateUrl: './particles.component.html',
    styleUrls: ['./particles.component.scss']
})

export class ParticlesComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas') canvasElement: ElementRef;
    @ViewChild('canvasWrapper') canvasWrapperElement: ElementRef;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    screenWidth: number;
    screenHeight: number;

    gravity: boolean;
    collisions: boolean;
    orbs: number;

    particles: Particle[];

    intervalId: number;

    infoBoxTitle: string = "HTML Canvas Particles";
    infoBoxBody: string = `Free floating particles created with a standard HTML Canvas.  Collision reactions are calculated
                            using a collision normal vector and mass based on two dimensional area.  When gravity is enabled, 
                            a small amount of kinetic energy is lost after a collision to create a more realistic effect.`;

    ngAfterViewInit(): void {
        //$('.ui.dropdown').dropdown();

        this.canvas = this.canvasElement.nativeElement;
        this.ctx = this.canvas.getContext('2d');

        this.screenWidth = this.canvasWrapperElement.nativeElement.offsetWidth;
        this.screenHeight = this.canvasWrapperElement.nativeElement.offsetHeight;
        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;

        this.gravity = false;
        this.collisions = false;
        this.orbs = 30;

        this.particles = [];

        this.initCanvas();
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalId);
    }

    initCanvas(): void {
        for(let i = 0; i < this.orbs; i++) {
            this.particles.push(new Particle(this.screenWidth, this.screenHeight));
        }

        this.intervalId = window.setInterval(() => {
            this.draw();
        }, 16);
    }

    draw(): void {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

        this.ctx.globalCompositeOperation = 'lighter';

        this.particles.forEach((particle) => {
            particle.draw(this.ctx, this.gravity);
        });

        if(this.collisions) {
            this.calculateCollisions();
        }
    }

    calculateCollisions(): void {
        this.particles.forEach((particleA, index) => {
            for(let i = index + 1; i < this.particles.length; i++) {
                let particleB = this.particles[i];

                if(particleA.isCollided(particleB)) {
                    let distance = Math.sqrt(Math.pow(particleA.x - particleB.x, 2) + Math.pow(particleA.y - particleB.y, 2));

                    let collisionNormal: PhysicsNormal = {
                        x: (particleA.x - particleB.x) / distance,
                        y: (particleA.y - particleB.y) / distance
                    };

                    //Decompose particleA velocity into parallel and orthogonal part
                    let particleADot = collisionNormal.x * particleA.vx + collisionNormal.y * particleA.vy;
                    let particleACollide: PhysicsNormal = {
                        x: collisionNormal.x * particleADot,
                        y: collisionNormal.y * particleADot
                    };
                    let particleARemainder: PhysicsNormal = {
                        x: particleA.vx - particleACollide.x,
                        y: particleA.vy - particleACollide.y
                    };

                    //Decompose particleB velocity into parallel and orthogonal part
                    let particleBDot = collisionNormal.x * particleB.vx + collisionNormal.y * particleB.vy;
                    let particleBCollide: PhysicsNormal = {
                        x: collisionNormal.x * particleBDot,
                        y: collisionNormal.y * particleBDot
                    };
                    let particleBRemainder: PhysicsNormal = {
                        x: particleB.vx - particleBCollide.x,
                        y: particleB.vy - particleBCollide.y
                    };

                    //calculate changes in velocity perpendicular to collision plane, conservation of momentum
                    let newVelX1 = (particleACollide.x * (particleA.mass - particleB.mass) + (2 * particleB.mass * particleBCollide.x)) / (particleA.mass + particleB.mass);
                    let newVelY1 = (particleACollide.y * (particleA.mass - particleB.mass) + (2 * particleB.mass * particleBCollide.y)) / (particleA.mass + particleB.mass);
                    let newVelX2 = (particleBCollide.x * (particleB.mass - particleA.mass) + (2 * particleA.mass * particleACollide.x)) / (particleA.mass + particleB.mass);
                    let newVelY2 = (particleBCollide.y * (particleB.mass - particleA.mass) + (2 * particleA.mass * particleACollide.y)) / (particleA.mass + particleB.mass);

                    //add collision result to remaining parallel velocities
                    particleA.vx = newVelX1 + particleARemainder.x;
                    particleA.vy = newVelY1 + particleARemainder.y;
                    particleB.vx = newVelX2 + particleBRemainder.x;
                    particleB.vy = newVelY2 + particleBRemainder.y;
                }
            }
        });
    }

    toggleGravity(): void {
        this.gravity = !this.gravity;
    }

    toggleCollisions(): void {
        this.collisions = !this.collisions;
    }

    setOrbs(orbs: number): void {
        clearInterval(this.intervalId);
        this.orbs = orbs;
        this.particles = [];
        this.initCanvas();
    }
}
