import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare let Physics: any;

@Component({
    selector: 'rr-particles-two',
    templateUrl: './particles-two.component.html',
    styleUrls: ['./particles-two.component.scss']
})

export class ParticlesTwoComponent implements AfterViewInit {
    @ViewChild('physics') physicsElement: ElementRef;

    ngAfterViewInit() {
        this.draw();
    }

    draw(): void {
        let width = this.physicsElement.nativeElement.offsetWidth;
        let height = this.physicsElement.nativeElement.offsetHeight;
        let viewportBounds = Physics.aabb(0, 0, width, height);

        let world: any = Physics({ sleepDisabled: true });

        let renderer: any = Physics.renderer('canvas', {
            el: 'physics'
        });
        world.add(renderer);

        world.on('step', function() {
            world.render();
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

        world.add(circles);

        world.add([
            Physics.behavior('sweep-prune'),
            Physics.behavior('body-collision-detection'),
            Physics.behavior('body-impulse-response'),
            edgeBounce
        ]);

        Physics.util.ticker.on(function(time: any) {
            world.step( time );
        });

        Physics.util.ticker.start();
    }
}
