import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import { AndroidApp } from './interface/android-app';

@Injectable()
export class StaticContentService {
    private androidAppsUrl = require('./json/android-apps.json');

    constructor(private http: Http){}

    getAndroidApps(): Promise<AndroidApp[]>{
        return this.http.get(this.androidAppsUrl)
            .toPromise()
            .then(response => response.json() as AndroidApp[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
