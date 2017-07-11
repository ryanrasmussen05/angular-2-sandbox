import { AfterViewInit, Component, ElementRef, HostBinding, ViewChild } from '@angular/core';
import * as EventPlanner from './event.planner';
import { select, Selection } from 'd3-selection';
import { range } from 'd3-array';
import { drag } from 'd3-drag';

@Component({
    selector: 'rr-event-planner',
    templateUrl: './event.planner.component.html'
})

export class EventPlannerComponent implements AfterViewInit {
    @HostBinding('class') hostClass = 'fullscreen-graphics layout-column';
    @ViewChild('d3') svgElement: ElementRef;

    circles: EventPlanner.CircleData[] = [];
    rectangles: EventPlanner.RectangleData[] = [];
    svg: Selection<SVGElement, {}, HTMLElement, any>;

    width: number;
    height: number;

    radius: number = 32;

    ngAfterViewInit(): void {
        this.svg = select<SVGElement, {}>('svg');
        this.width = this.svgElement.nativeElement.offsetWidth;
        this.height = this.svgElement.nativeElement.offsetHeight;

        range(10).map(() => {
            this.addCircle();
        });

        range(10).map(() => {
            this.addRectangle();
        });
    }

    addCircle() {
        this.circles.push({
            x: Math.round(Math.random() * (this.width - this.radius * 2) + this.radius),
            y: Math.round(Math.random() * (this.height - this.radius * 2) + this.radius)
        });

        //join data to circle elements, set all updating circles to green
        let updateCircles = this.svg.selectAll('circle')
            .data(this.circles)
            .style('fill', 'green');

        updateCircles.enter().append('circle')
            .attr('cx', (data: EventPlanner.CircleData) => data.x)
            .attr('cy', (data: EventPlanner.CircleData) => data.y)
            .attr('r', this.radius)
            .style('fill', 'orange')
            .call(drag<SVGCircleElement, EventPlanner.CircleData>()
                .on('drag', EventPlanner.dragCircleHandler))
            //all updated and entering circles stroke black
            .merge(updateCircles)
            .style('stroke', 'black');
    }

    addRectangle() {
        this.rectangles.push({
            x: Math.round(Math.random() * (this.width - this.radius * 2)),
            y: Math.round(Math.random() * (this.height - this.radius * 2)),
            height: Math.round(Math.random() * 50),
            width: Math.round(Math.random() * 50)
        });

        this.svg.selectAll('rect')
            .data(this.rectangles)
            .enter().append('rect')
            .attr('x', (data: EventPlanner.RectangleData) => data.x)
            .attr('y', (data: EventPlanner.RectangleData) => data.y)
            .attr('width', (data: EventPlanner.RectangleData) => data.width)
            .attr('height', (data: EventPlanner.RectangleData) => data.height)
            .style('fill', 'purple')
            .call(drag<SVGRectElement, EventPlanner.RectangleData>()
                .on('drag', EventPlanner.dragRectangleHandler));
    }

    removeCircle() {
        this.circles.pop();

        this.svg.selectAll('circle')
            .data(this.circles)
            .exit()
            .remove();
    }

    removeRectangle() {
        this.rectangles.pop();

        this.svg.selectAll('rect')
            .data(this.rectangles)
            .exit()
            .remove();
    }
}
