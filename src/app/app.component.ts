import { Component } from '@angular/core';

import '../styles/styles.less';

@Component({
    selector: 'rr-my-app',
    template: `
    <h1>{{title}}</h1>
    <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
    </nav>
    <router-outlet></router-outlet>
  `,
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    title = 'Tour of Heroes';
}
