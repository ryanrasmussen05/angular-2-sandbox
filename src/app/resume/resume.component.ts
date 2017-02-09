import { Component, OnInit } from '@angular/core';

import { EducationItem } from '../static-content/interface/education-item';
import { ResumeItem } from '../static-content/interface/resume-item';
import { StaticContentService } from '../static-content/static-content.service';

@Component({
    selector: 'rr-resume',
    templateUrl: './resume.component.html'
})

export class ResumeComponent implements OnInit {
    educationItems: EducationItem[];
    resumeItems: ResumeItem[];

    constructor(private staticContentService: StaticContentService){}

    ngOnInit() {
        this.staticContentService.getEducationItems()
            .then(educationItems => this.educationItems = educationItems);

        this.staticContentService.getResumeItems()
            .then(resumeItems => this.resumeItems = resumeItems);
    }

    getImage(imageName: string) {
        return require('../../public/images/' + imageName);
    }
}
