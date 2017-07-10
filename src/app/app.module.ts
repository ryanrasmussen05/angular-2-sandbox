import { NgModule }      from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CovalentLayoutModule } from '@covalent/core';
import {
    MdButtonModule, MdCardModule, MdCheckboxModule, MdIconModule, MdSelectModule,
    MdToolbarModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }  from './app.component';
import { BridgeComponent } from "./sandbox/physics-js/bridge/bridge.component";
import { CarSimComponent } from "./sandbox/physics-js/car-sim/car-sim-component";
import { EventPlannerComponent } from './sandbox/d3/event.planner.component';
import { FireworksComponent } from './sandbox/canvas/fireworks/fireworks.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MontyHallComponent } from "./sandbox/monty-hall/monty-hall.component";
import { ParticlesComponent } from './sandbox/canvas/particles/particles.component';
import { ParticlesTwoComponent } from "./sandbox/physics-js/particles-two/particles-two.component";
import { PhysicsIntroComponent } from './sandbox/physics-js/physics-intro/physics-intro.component';
import { ResumeComponent } from './resume/resume.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { SolarSystemComponent } from "./sandbox/physics-js/solar-system/solar-system.component";
import { StaticContentService } from './static-content/static-content.service';

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CovalentLayoutModule,
        FormsModule,
        HttpModule,
        MdButtonModule,
        MdCardModule,
        MdCheckboxModule,
        MdIconModule,
        MdSelectModule,
        MdToolbarModule
    ],
    declarations: [
        AppComponent,
        BridgeComponent,
        CarSimComponent,
        EventPlannerComponent,
        FireworksComponent,
        FooterComponent,
        HomepageComponent,
        MontyHallComponent,
        ParticlesComponent,
        ParticlesTwoComponent,
        PhysicsIntroComponent,
        ResumeComponent,
        SandboxComponent,
        SolarSystemComponent
    ],
    providers: [ StaticContentService ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
