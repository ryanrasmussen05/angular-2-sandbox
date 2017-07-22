interface Coordinate {
    x: number;
    y: number;
}

interface DraggableObject {
    id: string;
    location: Coordinate;
    //x and y are needed for drag to work properly
    x: number;
    y: number;
}

export interface CircleData extends DraggableObject {
    radius: number;
}

export interface RectangleData extends DraggableObject {
    height: number;
    width: number;
}