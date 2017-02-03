import { Component, ElementRef, OnInit } from '@angular/core';

import { Hero } from '../hero/hero';
import { HeroService } from '../hero/hero.service';

@Component({
    selector: 'rr-my-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
    title = 'Tour of Heroes';
    heroes: Hero[] = [];

    constructor(
        private heroService: HeroService,
        private el: ElementRef) { }

    ngOnInit(): void {
        this.heroService.getHeroes()
            .then(heroes => this.heroes = heroes.slice(1, 5));

        $(this.el.nativeElement).find('.ui.dropdown').dropdown();
    }
}

