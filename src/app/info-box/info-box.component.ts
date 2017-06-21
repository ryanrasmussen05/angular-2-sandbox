import { Component, HostListener, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'rr-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['./info-box.component.scss']
})

export class InfoBoxComponent {
    @Input() title: string;
    @Input() body: string;

    @ViewChild('modal') modalElement: ElementRef;

    @HostListener('click', ['$event']) onClick(event: MouseEvent) {
        event.preventDefault();
        //$(this.modalElement.nativeElement).modal('show');
    }
}
