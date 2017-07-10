import { select, event } from 'd3-selection';

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

export function dragCircleHandler(data: CircleData) {
    select(this).attr("cx", data.x = event.x).attr("cy", data.y = event.y);
}

export function dragRectangleHandler(data: RectangleData) {
    select(this).attr('x', data.x = event.x).attr('y', data.y = event.y);
}