import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }  from './app.component';
import { BridgeComponent } from "./sandbox/physicsJs/bridge/bridge.component";
import { FireworksComponent } from './sandbox/canvas/fireworks/fireworks.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { ParticlesComponent } from './sandbox/canvas/particles/particles.component';
import { ParticlesTwoComponent } from "./sandbox/physicsJs/particles-two/particles-two.component";
import { PhysicsIntroComponent } from './sandbox/physicsJs/physics-intro/physics-intro.component';
import { ResumeComponent } from './resume/resume.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { SolarSystemComponent } from "./sandbox/physicsJs/solar-system/solar-system.component";
import { StaticContentService } from './static-content/static-content.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        BridgeComponent,
        FireworksComponent,
        FooterComponent,
        HomepageComponent,
        NavigationMenuComponent,
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
