import { Component, ViewChild, ElementRef, HostBinding, AfterViewInit } from '@angular/core';
import { select, event } from 'd3-selection';
import { range } from 'd3-array'
import { drag } from 'd3-drag';

interface CircleData {
    x: number;
    y: number;
}

interface RectangleData {
    x: number;
    y: number;
    height: number;
    width: number;
}

@Component({
    selector: 'rr-event-planner',
    templateUrl: './event.planner.component.html'
})

export class EventPlannerComponent implements AfterViewInit{
    @HostBinding('class') hostClass = 'fullscreen-graphics layout-column';
    @ViewChild('d3') svgElement: ElementRef;

    ngAfterViewInit():void {
        let svg = select("svg");
        let width = this.svgElement.nativeElement.offsetWidth;
        let height = this.svgElement.nativeElement.offsetHeight;
        let radius = 32;

        let circles: CircleData[] = range(10).map(() => {
            return {
                x: Math.round(Math.random() * (width - radius * 2) + radius),
                y: Math.round(Math.random() * (height - radius * 2) + radius)
            };
        });

        let rectangles: RectangleData[] = range(10).map(() => {
            return {
                x: Math.round(Math.random() * (width - radius * 2)),
                y: Math.round(Math.random() * (height - radius * 2)),
                height: Math.round(Math.random() * 50),
                width: Math.round(Math.random() * 50)
            }
        });

        svg.selectAll("circle")
            .data(circles)
            .enter().append("circle")
            .attr("cx", (data: CircleData) => data.x)
            .attr("cy", (data: CircleData) => data.y)
            .attr("r", radius)
            .style("fill", 'black')
            .call(drag<SVGCircleElement, CircleData>()
                .on("drag", dragCircleHandler));

        svg.selectAll('rect')
            .data(rectangles)
            .enter().append('rect')
            .attr('x', (data: RectangleData) => data.x)
            .attr('y', (data: RectangleData) => data.y)
            .attr('width', (data: RectangleData) => data.width)
            .attr('height', (data: RectangleData) => data.height)
            .style('fill', 'teal')
            .call(drag<SVGRectElement, RectangleData>()
                .on('drag', dragRectangleHandler));

        function dragCircleHandler(data: CircleData) {
            select(this).attr("cx", data.x = event.x).attr("cy", data.y = event.y);
        }

        function dragRectangleHandler(data: RectangleData) {
            select(this).attr('x', data.x = event.x).attr('y', data.y = event.y);
        }
    }
}
