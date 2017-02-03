import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './hero-app/dashboard/dashboard.component';
import { HeroesComponent }      from './hero-app/heroes/heroes.component';
import { HeroDetailComponent }  from './hero-app/hero-detail/hero-detail.component';

import { HomepageComponent } from './homepage/homepage.component';
import { FireworksComponent } from './sandbox/canvas/fireworks/fireworks.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'sandbox/fireworks', component: FireworksComponent },
    { path: 'hero/dashboard',  component: DashboardComponent },
    { path: 'hero/detail/:id', component: HeroDetailComponent },
    { path: 'hero/heroes',     component: HeroesComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
