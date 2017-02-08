import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }  from './app.component';
import { FireworksComponent } from './sandbox/canvas/fireworks/fireworks.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { ResumeComponent } from './resume/resume.component';
import { SandboxComponent } from './sandbox/sandbox.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        FireworksComponent,
        FooterComponent,
        HomepageComponent,
        NavigationMenuComponent,
        ResumeComponent,
        SandboxComponent
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
