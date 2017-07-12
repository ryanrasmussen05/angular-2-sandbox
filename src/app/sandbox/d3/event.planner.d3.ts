import { event, mouse, select } from 'd3-selection';
import { drag } from 'd3-drag';

export interface EventPlannerD3 {
    drawMenu: () => void;
    addCircle: () => void;
    removeCircle: () => void;
    removeRectangle: () => void;
}

export interface CircleData {
    cx: number;
    cy: number;
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
    let padding = 20;

    function drawMenu() {
        svg.append('circle')
            .classed('menu', true)
            .attr('r', radius).attr('cx', radius + padding).attr('cy', radius + padding)
            .style('fill', 'blue')
            .call(drag<SVGCircleElement, {}>()
                .on('start', addCircle)
                .on('drag', dragNewCircleHandler));

        svg.append('rect')
            .classed('menu', true)
            .attr('x', padding).attr('y', (radius*2) + (padding*3)).attr('height', radius*2).attr('width', radius*2)
            .style('fill', 'blue')
            .call(drag<SVGRectElement, {}>()
                .on('start', addRectangle)
                .on('drag', dragNewRectangleHandler));
    }

    function addCircle() {
        let mouseEvent = mouse(svgElement);

        circles.push({
            cx: mouseEvent[0],
            cy: mouseEvent[1]
        });

        let updateCircles = svg.selectAll('circle:not(.menu)')
            .data(circles)
            .classed('new', false)
            .style('fill', 'green');

        updateCircles.enter().append('circle')
            .classed('new', true)
            .attr('cx', (data: CircleData) => data.cx)
            .attr('cy', (data: CircleData) => data.cy)
            .attr('r', radius)
            .style('fill', 'orange')
            .call(drag<SVGCircleElement, CircleData>()
                .on('drag', dragCircleHandler))
            //all updated and entering circles stroke black
            .merge(updateCircles)
            .style('stroke', 'black');
    }

    function addRectangle() {
        let mouseEvent = mouse(svgElement);

        rectangles.push({
            x: mouseEvent[0] - radius,
            y: mouseEvent[1] - radius,
            height: radius*2,
            width: radius*2
        });

        svg.selectAll('rect:not(.menu)')
            .data(rectangles)
            .classed('new', false)
            .enter().append('rect')
            .classed('new', true)
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
        select(this).attr('cx', data.cx = event.x).attr('cy', data.cy = event.y);
    }

    function dragRectangleHandler(data: RectangleData) {
        select(this).attr('x', data.x = event.x).attr('y', data.y = event.y);
    }

    function dragNewCircleHandler() {
        let data: CircleData = select<SVGCircleElement, CircleData>('circle.new')
            .attr('cx', event.x).attr('cy', event.y)
            .datum();

        data.cx = event.x;
        data.cy = event.y;
    }

    function dragNewRectangleHandler() {
        let rectangle = select<SVGRectElement, RectangleData>('rect.new');

        let rectangleData: RectangleData = rectangle.datum();
        rectangleData.x = rectangleData.x + event.dx;
        rectangleData.y = rectangleData.y + event.dy;

        rectangle.attr('x', rectangleData.x).attr('y', rectangleData.y);
    }

    return {
        drawMenu: drawMenu,
        addCircle: addCircle,
        removeCircle: removeCircle,
        removeRectangle: removeRectangle
    };
}