import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

declare let Physics: any;

@Component({
    selector: 'rr-particles-two',
    templateUrl: './particles-two.component.html',
    styleUrls: ['./particles-two.component.scss']
})

export class ParticlesTwoComponent implements AfterViewInit, OnDestroy {
    @ViewChild('physics') physicsElement: ElementRef;
    world: any;

    infoBoxTitle: string = "Physics JS Particles";
    infoBoxBody: string = `A Physics JS implementation of the HTML Canvas Particles I created 
                            while learning about canvas.  There are no special interactions available
                            in this implementation.`;

    ngAfterViewInit():void {
        this.draw();
    }

    ngOnDestroy(): void {
        this.world.destroy();
    }

    draw(): void {
        let component = this;

        let width = this.physicsElement.nativeElement.offsetWidth;
        let height = this.physicsElement.nativeElement.offsetHeight;
        let viewportBounds = Physics.aabb(0, 0, width, height);

        component.world = Physics({ sleepDisabled: true });

        let renderer: any = Physics.renderer('canvas', {
            el: 'physics'
        });
        component.world.add(renderer);

        component.world.on('step', function() {
            component.world.render();
        });

        let edgeBounce = Physics.behavior('edge-collision-detection', {
            aabb: viewportBounds,
            restitution: 1.0, //energy % after collision
            cof: 0.0 //friction with boundaries
        });

        window.addEventListener('resize', function () {
            viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
            edgeBounce.setAABB(viewportBounds);
        }, true);

        let circles = [];

        for(let counter = 0; counter < 30; counter++){
            circles.push(
                Physics.body('circle', {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    mass: 1,
                    radius: 30,
                    vx: Math.random() * 1 - 0.5,
                    vy: Math.random() * 1 - 0.5,
                    restitution: 1.0,
                    cof: 0.0,
                    styles: {
                        fillStyle: '#FF0000'
                    }
                })
            );
        }

        component.world.add(circles);

        component.world.add([
            Physics.behavior('sweep-prune'),
            Physics.behavior('body-collision-detection'),
            Physics.behavior('body-impulse-response'),
            edgeBounce
        ]);

        Physics.util.ticker.on(function(time: any) {
            component.world.step( time );
        });

        Physics.util.ticker.start();
    }
}