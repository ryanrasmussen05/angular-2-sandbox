import { event, mouse, select } from 'd3-selection';
import { drag } from 'd3-drag';
import { CircleData, RectangleData } from './core/data.types';
import { config } from './core/config';

export interface EventPlannerD3 {
    initialize: () => void;
}

export function initEventPlanner(svgElementId: string, svgWidth: number, svgHeight: number): EventPlannerD3 {
    let width = svgWidth;
    let height = svgHeight;
    let svgElement = document.getElementById(svgElementId);
    let svg = select<SVGElement, {}>(svgElementId);

    let circles: CircleData[] = [];
    let rectangles: RectangleData[] = [];

    function initialize() {
        select('#initCircle').on('click', initCircle);
        select('#initRectangle').on('click', initRectangle);
    }

    function initCircle() {
        let mouseEvent = mouse(document.body);
        let body = select('body');

        body.on('mousemove', moveNewObject)
            .append('svg')
            .classed('new-object', true)
            .attr('width', config.menuObjectRadius*2)
            .attr('height', config.menuObjectRadius*2)
            .style('position', 'absolute')
            .style('left', (mouseEvent[0] - config.menuObjectRadius) + 'px')
            .style('top', (mouseEvent[1] - config.menuObjectRadius) + 'px')
            .append('circle')
            .attr('r', config.menuObjectRadius)
            .attr('cx', 0).attr('cy', 0)
            .style('transform', 'translate(' + config.menuObjectRadius + 'px, ' + config.menuObjectRadius + 'px)')
            .style('fill', 'pink');

        body.on('mousedown', addNewCircle);
    }

    function initRectangle() {
        let mouseEvent = mouse(document.body);
        let body = select('body');

        body.on('mousemove', moveNewObject)
            .append('svg')
            .classed('new-object', true)
            .attr('width', config.menuObjectRadius*2)
            .attr('height', config.menuObjectRadius*2)
            .style('position', 'absolute')
            .style('left', (mouseEvent[0] - config.menuObjectRadius) + 'px')
            .style('top', (mouseEvent[1] - config.menuObjectRadius) + 'px')
            .append('rect')
            .attr('height', config.menuObjectRadius*2)
            .attr('width', config.menuObjectRadius*2)
            .attr('x', 0).attr('y', 0)
            .style('fill', 'pink');

        body.on('mousedown', addNewRectangle);
    }

    function addCircle() {
        let radius = config.menuObjectRadius; //TODO TEMP
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
                .on('start', raiseToTop)
                .on('drag', dragCircleHandler))
            //all updated and entering circles stroke black
            .merge(updateCircles)
            .style('stroke', 'black');
    }

    function addRectangle() {
        let radius = config.menuObjectRadius; //TODO TEMP
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
            .style('stroke', 'black')
            .call(drag<SVGRectElement, RectangleData>()
                .on('start', raiseToTop)
                .on('drag', dragRectangleHandler));
    }

    function raiseToTop() {
        select(this).raise();
    }

    function dragCircleHandler(data: CircleData) {
        let circle = select(this);
        let mouseEvent = mouse(svgElement);

        if (mouseEvent[0] > 0 && mouseEvent[0] < width) {
            circle.attr('cx', data.cx = event.x);
        }
        if (mouseEvent[1] > 0 && mouseEvent[1] < height) {
            circle.attr('cy', data.cy = event.y);
        }
    }

    function dragRectangleHandler(data: RectangleData) {
        let rectangle = select(this);
        let mouseEvent = mouse(svgElement);

        if (mouseEvent[0] > 0 && mouseEvent[0] < width) {
            rectangle.attr('x', data.x = event.x);
        }
        if (mouseEvent[1] > 0 && mouseEvent[1] < height) {
            rectangle.attr('y', data.y = event.y);
        }
    }

    function moveNewObject() {
        let mouseEvent = mouse(document.body);
        let newObject = select('svg.new-object');

        let newPositionX = mouseEvent[0] - (+newObject.attr('width') / 2);
        let newPositionY = mouseEvent[1] - (+newObject.attr('height') / 2);

        newObject
            .style('left', newPositionX + 'px')
            .style('top', newPositionY + 'px')
    }

    function addNewCircle() {
        select('svg.new-object').remove();

        let body = select('body');
        body.on('mousemove', null);
        body.on('mousedown', null);

        if(isLocationOverSvg(event.clientX, event.clientY)) {
            addCircle();
        }
    }

    function addNewRectangle() {
        select('svg.new-object').remove();

        let body = select('body');
        body.on('mousemove', null);
        body.on('mousedown', null);

        if(isLocationOverSvg(event.clientX, event.clientY)) {
            addRectangle();
        }
    }

    function isLocationOverSvg(x: number, y: number): boolean {
        let stack: Element[] = [];
        let found = false;
        let currentElement;

        do {
            currentElement = document.elementFromPoint(x, y);
            stack.push(currentElement);
            currentElement.classList.add('pointer-events-none');
            if(currentElement.id === svgElementId) {
                found = true;
                break;
            }
        } while(currentElement.tagName !== 'HTML');

        stack.forEach((element: Element) => {
            element.classList.remove('pointer-events-none');
        });

        return found;
    }

    return {
        initialize: initialize
    };
}