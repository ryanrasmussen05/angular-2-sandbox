import { Component, OnInit } from '@angular/core';

import '../styles/styles.scss';
import '../../semantic/dist/semantic.min.css';

@Component({
    selector: 'rr-my-app',
    template: `
    <h1>{{title}}</h1>
    <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
    </nav>
    <router-outlet></router-outlet>
    <div class="ui dropdown">
  <input type="hidden" name="gender">
  <i class="dropdown icon"></i>
  <div class="default text">Gender</div>
  <div class="menu">
    <div class="item" data-value="male">Male</div>
    <div class="item" data-value="female">Female</div>
  </div>
</div>
  `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Tour of Heroes';

    ngOnInit(): void {
        $('.ui.dropdown').dropdown();
    }
}
