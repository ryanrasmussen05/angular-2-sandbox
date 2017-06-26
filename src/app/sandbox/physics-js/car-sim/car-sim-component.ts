import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostBinding } from '@angular/core';

declare let Physics: any;

@Component({
    selector: 'rr-car-sim',
    templateUrl: './car-sim.component.html'
})

export class CarSimComponent implements AfterViewInit, OnDestroy {
    @HostBinding('class') hostClass = 'fullscreen-graphics layout-column';
    @ViewChild('physics') physicsElement: ElementRef;
    world: any;

    ngAfterViewInit(): void {
        Physics.behavior('torque', function(parent: any) {

            let defaults = {
                torque: 0.1
            };

            return {
                init: function(options: any) {
                    parent.init.call(this);
                    this.options.defaults(defaults);
                    this.options(options);
                },

                behave: function(data: any) {
                    let bodies = this.getTargets();

                    for(let i = 0; i < bodies.length; i++) {
                        let angularAcceleration = this.options.torque / bodies[i].moi;

                        bodies[i].state.angular.vel = bodies[i].state.angular.vel + angularAcceleration;
                    }
                }
            }
        });

        Physics.body('beam', 'rectangle', function(parent: any) {
            return {
                buildFromPoints: function(pointA: any, pointB: any) {

                    let centerPoint = {
                        x: (pointA.x + pointB.x) / 2,
                        y: (pointA.y + pointB.y) / 2
                    };

                    let scratch = Physics.scratchpad();
                    let tempVector = scratch.vector().set(pointB.x - pointA.x, pointB.y - pointA.y);
                    let angle = tempVector.angle() + (Math.PI / 2);
                    let length = tempVector.norm();
                    scratch.done();

                    this.state.pos.x = centerPoint.x;
                    this.state.pos.y = centerPoint.y;

                    this.geometry.width = 5;
                    this.geometry.height = length;

                    this.state.angular.pos = angle;
                }
            }
        });

        this.draw();
    }

    ngOnDestroy(): void {
        this.world.destroy();
    }

    draw(): void {
        let component = this;

        let width = this.physicsElement.nativeElement.offsetWidth;
        let height = this.physicsElement.nativeElement.offsetHeight;

        component.world = Physics();

        component.world.add([
            Physics.behavior('constant-acceleration'),
            Physics.behavior('sweep-prune'),
            Physics.behavior('body-collision-detection'),
            Physics.behavior('body-impulse-response'),
            Physics.behavior('edge-collision-detection', {
                aabb: Physics.aabb(0, 0, width, height),
                restitution: 0.0,
                cof: 0
            })
        ]);

        let renderer = Physics.renderer('canvas', {el: 'physics'});
        component.world.add(renderer);

        component.world.on('step', function() {
            component.world.render();
        });

        Physics.util.ticker.on(function(time: any) {
            component.world.step(time);
        });

        Physics.util.ticker.start();

        //draw road
        let y = height * 0.9;

        for(let x = 0; x < width; x+=100) {
            let leftPoint = {
                x: x,
                y: y
            };

            y = y * 0.95;

            let rightPoint = {
                x: x + 100,
                y: y
            };

            let roadSection = Physics.body('beam', {
                treatment: 'static',
                restitution: 0.0,
                cof: 1.0
            });
            roadSection.buildFromPoints(leftPoint, rightPoint);

            component.world.add(roadSection);
        }

        //draw car
        let wheels = [];

        wheels.push(Physics.body('circle', {
            x: 50,
            y: 50,
            radius: 30,
            cof: 1.0
        }));

        wheels.push(Physics.body('circle', {
            x: 150,
            y: 50,
            radius: 30,
            cof: 1.0
        }));

        let rigidConstraints = Physics.behavior('verlet-constraints', {
            iterations: 3
        });

        rigidConstraints.distanceConstraint(wheels[0], wheels[1], 1);

        component.world.on('render', function(){
            let constraint = rigidConstraints.getConstraints().distanceConstraints[0];
            renderer.drawLine(constraint.bodyA.state.pos, constraint.bodyB.state.pos, 'rgba(0, 0, 0, 1.0)');
        });


        component.world.add(Physics.behavior('torque', {torque: 0.05}).applyTo(wheels));
        component.world.add(wheels);
        component.world.add(rigidConstraints);
    }
}
