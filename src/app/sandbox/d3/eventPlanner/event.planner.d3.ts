import { event, mouse, select } from 'd3-selection';
import { drag } from 'd3-drag';
import { line } from 'd3-shape';
import { scaleLinear, ScaleLinear } from 'd3-scale';
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
    let scale: ScaleLinear<number, number>;

    let circles: CircleData[] = [];
    let rectangles: RectangleData[] = [];

    function initialize() {
        select('#initCircle').on('click', initCircle);
        select('#initRectangle').on('click', initRectangle);
        drawFloorplan();
    }

    function drawFloorplan() {
        let data: [number, number][] = [[0,0],[1200,0],[1200,600],[0,600],[0,0]];
        setScale(data);

        let floorplanPath = line()
            .x(function(d) { return scale(d[0]); })
            .y(function(d) { return scale(d[1]); });

        svg.append('path')
            .attr('d', floorplanPath(data))
            .attr('fill', 'none')
            .style('stroke', 'red');
    }

    function initCircle() {
        let mouseEvent = mouse(document.body);
        let body = select('body');

        body.on('mousemove', moveNewObject)
            .append('svg')
            .classed('new-object', true)
            .attr('width', scale(config.menuObjectRadius*2))
            .attr('height', scale(config.menuObjectRadius*2))
            .style('position', 'absolute')
            .style('left', (mouseEvent[0] - scale(config.menuObjectRadius)) + 'px')
            .style('top', (mouseEvent[1] - scale(config.menuObjectRadius)) + 'px')
            .append('circle')
            .attr('r', scale(config.menuObjectRadius))
            .attr('cx', 0).attr('cy', 0)
            .style('transform', 'translate(' + scale(config.menuObjectRadius) + 'px, ' + scale(config.menuObjectRadius) + 'px)')
            .style('fill', 'pink');

        body.on('mousedown', addNewCircle);
    }

    function initRectangle() {
        let mouseEvent = mouse(document.body);
        let body = select('body');

        body.on('mousemove', moveNewObject)
            .append('svg')
            .classed('new-object', true)
            .attr('width', scale(config.menuObjectRadius*2))
            .attr('height', scale(config.menuObjectRadius*2))
            .style('position', 'absolute')
            .style('left', (mouseEvent[0] - scale(config.menuObjectRadius)) + 'px')
            .style('top', (mouseEvent[1] - scale(config.menuObjectRadius)) + 'px')
            .append('rect')
            .attr('height', scale(config.menuObjectRadius*2))
            .attr('width', scale(config.menuObjectRadius*2))
            .attr('x', 0).attr('y', 0)
            .style('fill', 'pink');

        body.on('mousedown', addNewRectangle);
    }

    function addCircle() {
        let mouseEvent = mouse(svgElement);

        circles.push({
            id: generateGuid(),
            location: {x: scale.invert(mouseEvent[0]), y: scale.invert(mouseEvent[1])},
            radius: config.menuObjectRadius, //TODO TEMP
            x: mouseEvent[0],
            y: mouseEvent[1]
        });

        let updateCircles = svg.selectAll('circle:not(.menu)')
            .data(circles, (data: CircleData) => data.id)
            .classed('new', false)
            .style('fill', 'green');

        updateCircles.enter().append('circle')
            .classed('new', true)
            .attr('cx', (data: CircleData) => scale(data.location.x))
            .attr('cy', (data: CircleData) => scale(data.location.y))
            .attr('r', (data: CircleData) => scale(data.radius))
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
            id: generateGuid(),
            location: {
                x: scale.invert(mouseEvent[0] - scale(radius)),
                y: scale.invert(mouseEvent[1] - scale(radius))
            },
            height: radius*2,
            width: radius*2,
            x: mouseEvent[0] - scale(radius),
            y: mouseEvent[1] - scale(radius)
        });

        svg.selectAll('rect:not(.menu)')
            .data(rectangles, (data: RectangleData) => data.id)
            .classed('new', false)
            .enter().append('rect')
            .classed('new', true)
            .attr('x', (data: RectangleData) => scale(data.location.x))
            .attr('y', (data: RectangleData) => scale(data.location.y))
            .attr('width', (data: RectangleData) => scale(data.width))
            .attr('height', (data: RectangleData) => scale(data.height))
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
            circle.attr('cx', data.x = event.x);
            data.location.x = scale.invert(event.x);
        }
        if (mouseEvent[1] > 0 && mouseEvent[1] < height) {
            circle.attr('cy', data.y = event.y);
            data.location.y = scale.invert(event.y);
        }
    }

    function dragRectangleHandler(data: RectangleData) {
        let rectangle = select(this);
        let mouseEvent = mouse(svgElement);

        if (mouseEvent[0] > 0 && mouseEvent[0] < width) {
            rectangle.attr('x', data.x = event.x);
            data.location.x = scale.invert(event.x);
        }
        if (mouseEvent[1] > 0 && mouseEvent[1] < height) {
            rectangle.attr('y', data.y = event.y);
            data.location.y = scale.invert(event.y);
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

    function setScale(data: [number, number][]) {
        let domain;
        let range;

        let maxX = data.reduce((currentMax, currentData) => {
            if (currentData[0] > currentMax) return currentData[0];
            return currentMax;
        }, 0);

        let maxY = data.reduce((currentMax, currentData) => {
            if (currentData[1] > currentMax) return currentData[1];
            return currentMax;
        }, 0);

        let ratioX = width / maxX;

        if (maxY * ratioX > height) {
            domain = [0, maxY];
            range = [0, height];
        } else {
            domain = [0, maxX];
            range = [0, width];
        }

        scale = scaleLinear().domain(domain).range(range);
    }

    function generateGuid() {
        function _p8(s: boolean) {
            let p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8(false) + _p8(true) + _p8(true) + _p8(false);
    }

    return {
        initialize: initialize
    };
}