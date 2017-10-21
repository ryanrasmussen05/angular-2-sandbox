import { Component } from '@angular/core';

//custom app-wide styles
import '../public/styles/styles.scss';

@Component({
    selector: 'rr-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    showMenu: boolean = false;

    toggleMenu(event: MouseEvent) {
        this.showMenu = !this.showMenu;
        event.stopPropagation();
    }

    hideMenu() {
        this.showMenu = false;
    }
}
