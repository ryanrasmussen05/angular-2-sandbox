import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FireworksComponent } from './sandbox/canvas/fireworks/fireworks.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ParticlesComponent } from './sandbox/canvas/particles/particles.component';
import { ResumeComponent } from './resume/resume.component';
import { SandboxComponent } from './sandbox/sandbox.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'resume', component: ResumeComponent },
    { path: 'sandbox', component: SandboxComponent },
    { path: 'sandbox/fireworks', component: FireworksComponent },
    { path: 'sandbox/particles', component: ParticlesComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
