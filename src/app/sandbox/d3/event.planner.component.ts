import { Component, ViewChild, ElementRef, HostBinding, AfterViewInit } from '@angular/core';
import { select, event } from 'd3-selection';
import { range } from 'd3-array'
import { drag } from 'd3-drag';

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

        let circles = range(20).map(() => {
            return {
                x: Math.round(Math.random() * (width - radius * 2) + radius),
                y: Math.round(Math.random() * (height - radius * 2) + radius)
            };
        });

        svg.selectAll("circle")
            .data(circles)
            .enter().append("circle")
            .attr("cx", (data: {x: number}) => { return data.x; })
            .attr("cy", (data: {y: number}) => { return data.y; })
            .attr("r", radius)
            .style("fill", 'black')
            .call(drag<SVGCircleElement, {x:number, y:number}>()
                .on("drag", dragHandler));

        function dragHandler(data: {x:number, y:number}) {
            select(this).attr("cx", data.x = event.x).attr("cy", data.y = event.y);
        }
    }
}
