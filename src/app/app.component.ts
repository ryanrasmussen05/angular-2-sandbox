import { Component, OnInit } from '@angular/core';

import '../styles/styles.scss';
import '../../semantic/dist/semantic.min.css';

@Component({
    selector: 'rr-my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Tour of Heroes';

    ngOnInit(): void {
        $('.ui.dropdown').dropdown();
    }
}
