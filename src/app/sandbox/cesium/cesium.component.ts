import { Component, OnInit } from '@angular/core';

declare let Cesium: any;

@Component({
    selector: 'rr-cesium',
    templateUrl: './cesium.component.html',
    styleUrls: ['./cesium.component.scss']
})

export class CesiumComponent implements OnInit {

    ngOnInit(): void {
        let viewer = new Cesium.Viewer('cesium');
    }
}
