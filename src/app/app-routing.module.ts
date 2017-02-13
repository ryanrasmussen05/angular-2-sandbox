import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BridgeComponent } from "./sandbox/physicsJs/bridge/bridge.component";
import { FireworksComponent } from './sandbox/canvas/fireworks/fireworks.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ParticlesComponent } from './sandbox/canvas/particles/particles.component';
import { ParticlesTwoComponent } from "./sandbox/physicsJs/particles-two/particles-two.component";
import { PhysicsIntroComponent } from './sandbox/physicsJs/physics-intro/physics-intro.component';
import { ResumeComponent } from './resume/resume.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { SolarSystemComponent } from "./sandbox/physicsJs/solar-system/solar-system.component";

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'resume', component: ResumeComponent },
    { path: 'sandbox', component: SandboxComponent },
    { path: 'sandbox/fireworks', component: FireworksComponent },
    { path: 'sandbox/particles', component: ParticlesComponent },
    { path: 'sandbox/physicsIntro', component: PhysicsIntroComponent },
    { path: 'sandbox/particlesTwo', component: ParticlesTwoComponent },
    { path: 'sandbox/solarSystem', component: SolarSystemComponent },
    { path: 'sandbox/bridge', component: BridgeComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
