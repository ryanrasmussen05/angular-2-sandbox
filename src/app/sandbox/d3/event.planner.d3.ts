import { event, select, mouse } from 'd3-selection';
import { drag } from 'd3-drag';

export interface EventPlannerD3 {
    drawMenu: () => void;
    addCircle: () => void;
    addRectangle: () => void;
    removeCircle: () => void;
    removeRectangle: () => void;
}

export interface CircleData {
    x: number;
    y: number;
}

export interface RectangleData {
    x: number;
    y: number;
    height: number;
    width: number;
}

export function initEventPlanner(svgElementId: string, width: number, height: number): EventPlannerD3 {
    let svgElement = document.getElementById(svgElementId);
    let svg = select<SVGElement, {}>(svgElementId);

    let circles: CircleData[] = [];
    let rectangles: RectangleData[] = [];

    let radius = 32;

    function drawMenu() {
        svg.append('circle')
            .classed('menu', true)
            .attr('r', radius)
            .attr('cx', radius + 20)
            .attr('cy', radius + 20)
            .style('fill', 'blue')
            .call(drag<SVGCircleElement, {}>()
                .on('start', addCircle));
    }

    function addCircle() {
        let mouseEvent = mouse(svgElement);

        circles.push({
            x: mouseEvent[0],
            y: mouseEvent[1]
        });

        let updateCircles = svg.selectAll('circle:not(.menu)')
            .data(circles)
            .style('fill', 'green');

        updateCircles.enter().append('circle')
            .attr('cx', (data: CircleData) => data.x)
            .attr('cy', (data: CircleData) => data.y)
            .attr('r', radius)
            .style('fill', 'orange')
            .call(drag<SVGCircleElement, CircleData>()
                .on('drag', dragCircleHandler))
            //all updated and entering circles stroke black
            .merge(updateCircles)
            .style('stroke', 'black');
    }

    function addRectangle() {
        rectangles.push({
            x: Math.round(Math.random() * (width - radius * 2)),
            y: Math.round(Math.random() * (height - radius * 2)),
            height: Math.round(Math.random() * 50),
            width: Math.round(Math.random() * 50)
        });

        svg.selectAll('rect')
            .data(rectangles)
            .enter().append('rect')
            .attr('x', (data: RectangleData) => data.x)
            .attr('y', (data: RectangleData) => data.y)
            .attr('width', (data: RectangleData) => data.width)
            .attr('height', (data: RectangleData) => data.height)
            .style('fill', 'purple')
            .call(drag<SVGRectElement, RectangleData>()
                .on('drag', dragRectangleHandler));
    }

    function removeCircle() {
        circles.pop();

        svg.selectAll('circle:not(.menu)')
            .data(circles)
            .exit()
            .remove();
    }

    function removeRectangle() {
        rectangles.pop();

        svg.selectAll('rect:not(.menu)')
            .data(rectangles)
            .exit()
            .remove();
    }

    function dragCircleHandler(data: CircleData) {
        select(this).attr('cx', data.x = event.x).attr('cy', data.y = event.y);
    }

    function dragRectangleHandler(data: RectangleData) {
        select(this).attr('x', data.x = event.x).attr('y', data.y = event.y);
    }

    return {
        drawMenu: drawMenu,
        addCircle: addCircle,
        addRectangle: addRectangle,
        removeCircle: removeCircle,
        removeRectangle: removeRectangle
    };
}