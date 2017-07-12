import { AfterViewInit, Component, ElementRef, HostBinding, ViewChild } from '@angular/core';
import { EventPlannerD3, initEventPlanner } from './event.planner.d3';

@Component({
    selector: 'rr-event-planner',
    templateUrl: './event.planner.component.html'
})

export class EventPlannerComponent implements AfterViewInit {
    @HostBinding('class') hostClass = 'fullscreen-graphics layout-column';
    @ViewChild('d3') svgWrapper: ElementRef;

    eventPlannerD3: EventPlannerD3;

    ngAfterViewInit(): void {
        let width = this.svgWrapper.nativeElement.offsetWidth;
        let height = this.svgWrapper.nativeElement.offsetHeight;
        this.eventPlannerD3 = initEventPlanner('svg', width, height);

        this.eventPlannerD3.drawMenu();
    }

    addRectangle() {
        this.eventPlannerD3.addRectangle();
    }

    removeCircle() {
        this.eventPlannerD3.removeCircle();
    }

    removeRectangle() {
        this.eventPlannerD3.removeRectangle();
    }
}
