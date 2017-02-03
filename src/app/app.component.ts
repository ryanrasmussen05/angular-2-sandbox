import { Component } from '@angular/core';

import '../public/images/favicon.ico';

//custom app-wide styles
import '../public/styles/styles.scss';
//semantic-ui
import 'semantic-ui-css/semantic.min.css';
//bass css
import 'basscss/css/basscss.min.css';

@Component({
    selector: 'rr-my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
}
