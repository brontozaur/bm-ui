import {Component, OnInit} from '@angular/core';

import {LoggingService} from './logging.service';
import {AuthenticationService} from "./auth/authentication.service";

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(
        private authService: AuthenticationService,
        private loggingService: LoggingService
    ) {
    }

    ngOnInit() {
    }
}
