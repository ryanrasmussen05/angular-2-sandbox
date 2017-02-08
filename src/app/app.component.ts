import { Component } from '@angular/core';

import '../public/images/favicon.ico';

//semantic-ui
import 'semantic-ui-css/semantic.min.css';
//bass css
import 'basscss/css/basscss-important.css';
//custom app-wide styles
import '../public/styles/styles.scss';

@Component({
    selector: 'rr-my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
}
