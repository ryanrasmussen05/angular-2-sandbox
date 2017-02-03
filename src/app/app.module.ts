import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';
import { HeroDetailComponent } from './hero-app/hero-detail/hero-detail.component';
import { HeroesComponent } from './hero-app/heroes/heroes.component';
import { HeroService } from './hero-app/hero/hero.service';
import { DashboardComponent } from './hero-app/dashboard/dashboard.component';

import { HomepageComponent } from './homepage/homepage.component';

//TODO make sandbox its own module
import { FireworksComponent } from './sandbox/canvas/fireworks/fireworks.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HeroDetailComponent,
        HeroesComponent,
        DashboardComponent,
        HomepageComponent,
        FireworksComponent
    ],
    providers: [ HeroService ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
