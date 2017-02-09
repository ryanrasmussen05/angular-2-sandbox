import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import { AndroidApp } from './interface/android-app';
import { EducationItem } from './interface/education-item';
import { ResumeItem } from './interface/resume-item';

@Injectable()
export class StaticContentService {
    private androidAppsUrl = require('./json/android-apps.json');
    private educationItemsUrl = require('./json/education-items.json');
    private resumeItemsUrl = require('./json/resume-items.json');

    constructor(private http: Http){}

    getAndroidApps(): Promise<AndroidApp[]>{
        return this.http.get(this.androidAppsUrl)
            .toPromise()
            .then(response => response.json() as AndroidApp[])
            .catch(this.handleError);
    }

    getResumeItems(): Promise<ResumeItem[]>{
        return this.http.get(this.resumeItemsUrl)
            .toPromise()
            .then(response => response.json() as ResumeItem[])
            .catch(this.handleError);
    }

    getEducationItems(): Promise<EducationItem[]>{
        return this.http.get(this.educationItemsUrl)
            .toPromise()
            .then(response => response.json() as EducationItem[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
