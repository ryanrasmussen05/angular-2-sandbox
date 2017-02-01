import { Component, OnInit, ElementRef } from '@angular/core';

//custom app-wide styles
import '../styles/styles.scss';
//semantic-ui
import 'semantic-ui-css/semantic.min.css';
//bass css
import 'basscss/css/basscss.min.css';

@Component({
    selector: 'rr-my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Tour of Heroes';

    constructor(private el: ElementRef) {}

    ngOnInit() :void {
        $(this.el.nativeElement).find('.ui.dropdown').dropdown();
    }
}
