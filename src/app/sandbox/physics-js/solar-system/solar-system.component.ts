import { Component, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';

declare let Physics: any;

@Component({
    selector: 'rr-solar-system',
    templateUrl: './solar-system.component.html',
    styleUrls: ['./solar-system.component.scss']
})

export class SolarSystemComponent implements AfterViewInit {
    @ViewChild('physics') physicsElement: ElementRef;
    bodies: number = 0;

    infoBoxTitle: string = "Physics JS Solar System";
    infoBoxBody: string = `I created this to experiment with the "Newtonian" behavior of the 
                           Physics JS library.  The idea is to model the formation of a solar system,
                           with hundreds of small bodies orbiting a central start, and merging to form
                           larger planets`;

    constructor(private zone: NgZone) {}

    ngAfterViewInit() {
        this.draw();
    }

    draw(): void {
        let width = this.physicsElement.nativeElement.offsetWidth;
        let height = this.physicsElement.nativeElement.offsetHeight;
        let xMin = (width / 2) - (height / 2);
        let xMax = (width / 2) + (height / 2);
        let gravityStrength = 0.01;

        let world:any = Physics({ sleepDisabled: true });

        let renderer: any = Physics.renderer('canvas', {
            el: 'physics'
        });
        world.add(renderer);

        world.on('step', function() {
            world.render();
        });

        let sun = Physics.body('circle', {
            x: width / 2,
            y: height / 2,
            mass: 333,
            radius: 20,
            treatment: 'static',
            sun: true,
            styles: {
                fillStyle: '#0000FF'
            }
        });
        world.add(sun);

        let circles = [];

        for(let counter = 0; counter < 200; counter++){
            let circle = Physics.body('circle', {
                x: this.random(xMin, xMax),
                y: this.random(0, height),
                mass: 0.1,
                restitution: 0,
                cof: 1,
                radius: 2,
                styles: {
                    fillStyle: '#FF0000'
                }
            });

            if(width/2 - 15 < circle.state.pos.x && circle.state.pos.x < width/2 + 15) {
                circle.state.pos.x = circle.state.pos.x + 30;
            }
            if(height/2 - 15 < circle.state.pos.y && circle.state.pos.y < height/2 + 15) {
                circle.state.pos.y = circle.state.pos.y + 30;
            }

            let vector = Physics.vector(circle.state.pos.x - width / 2,circle.state.pos.y - height / 2);
            let orbitRadius = vector.norm();
            vector.perp(true);
            vector.normalize();

            let orbitSpeed = Math.sqrt(gravityStrength * 333 / orbitRadius);

            circle.state.vel = vector.mult(orbitSpeed);

            circles.push(circle);
        }

        world.add(circles);

        world.add([
            Physics.behavior('newtonian', { strength: gravityStrength }),
            Physics.behavior('sweep-prune'),
            Physics.behavior('body-collision-detection', { checkAll: false })
        ]);

        world.on('collisions:detected', function(data: any) {
            let behavior = Physics.behavior('body-impulse-response');

            //apply default impulse first
            behavior.respond(data);

            ////combine bodies
            for(let i = 0; i < data.collisions.length; i++) {
                let bodyA = data.collisions[i].bodyA;
                let bodyB = data.collisions[i].bodyB;

                if(bodyA.sun) {
                    world.remove(bodyB);
                } else if(bodyB.sun) {
                    world.remove(bodyA);
                } else {
                    let newBodyVolume = (4/3 * Math.PI * Math.pow(bodyA.radius, 3)) + (4/3 * Math.PI * Math.pow(bodyB.radius, 3));
                    let newBodyRadius = Math.pow(((3 / (4 * Math.PI)) * newBodyVolume), 1/3);

                    let centerOfMass = Physics.body.getCOM([bodyA, bodyB]);

                    let centerOfMassVelocity: any = {};
                    centerOfMassVelocity.x = ((bodyA.mass * bodyA.state.vel.x) + (bodyB.mass * bodyB.state.vel.x)) / (bodyA.mass + bodyB.mass);
                    centerOfMassVelocity.y = ((bodyA.mass * bodyA.state.vel.y) + (bodyB.mass * bodyB.state.vel.y)) / (bodyA.mass + bodyB.mass);

                    let newBody = Physics.body('circle', {
                        x: centerOfMass.x,
                        y: centerOfMass.y,
                        vx: centerOfMassVelocity.x,
                        vy: centerOfMassVelocity.y,
                        mass: bodyA.mass + bodyB.mass,
                        radius: newBodyRadius,
                        styles: {
                            fillStyle: '#FF0000'
                        }
                    });

                    world.add(newBody);
                    world.remove(bodyA);
                    world.remove(bodyB);
                }
            }
        });

        let that = this;

        Physics.util.ticker.on(function(time: any) {
            world.step( time );
            that.updateBodyCount(world.getBodies().length);
        });

        Physics.util.ticker.start();
    }

    random(min: number, max: number): number {
        return (Math.random() * (max - min)) + min;
    }

    updateBodyCount(bodies: number) {
        //updates triggered in function from outside libraries don't trigger updates
        this.zone.run(() => {
            this.bodies = bodies;
        });
    }
}
