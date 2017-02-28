import { Component } from '@angular/core';

import '../public/images/favicon.ico';

//cesium
import 'cesium/Build/Cesium/Widgets/widgets.css';
//semantic-ui
import 'semantic-ui-css/semantic.min.css';
//bass css
import 'basscss/css/basscss-important.css';
//custom app-wide styles
import '../public/styles/styles.scss';

@Component({
    selector: 'rr-my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
