import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthenticationService} from "../auth/authentication.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSub: Subscription;
    private loggedUser: string;

    constructor(
        private authService: AuthenticationService
    ) {
    }

    ngOnInit() {
        this.userSub = this.authService.currentUser.subscribe(user => {
            this.isAuthenticated = !!user;
            this.loggedUser = '';
            if (user) {
                this.loggedUser += '(' + user.userResource.name + ")";
            }
        });
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
