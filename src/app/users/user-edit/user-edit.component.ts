import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserBook} from '../user-book.model';
import {UsersService} from '../users.service';
import {NotificationService} from "../../notification.service";
import {Distributor} from "../../distributors/distributor.model";
import {DistributorsService} from "../../distributors/distributors.service";
import {AuthenticationService} from "../../auth/authentication.service";

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-edit.component.html',
    styleUrls: ['../../app.component.css']
})
export class UserEditComponent implements OnInit {
    user: UserBook;
    userRole: string;
    distributors: Array<Distributor>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: UsersService,
                private notification: NotificationService,
                private authService: AuthenticationService,
                private distributorService: DistributorsService) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { user: UserBook, distributors: Distributor[] }) => {
            this.user = data.user;
            this.userRole = data.user.role || this.authService.currentUserValue.userResource.role;
            this.distributors = data.distributors;
        });
    }

    saveUser(userEditForm) {
        if (userEditForm.form.status !== 'VALID') {
            this.notification.showErrorNotification("Invalid form. Please complete mandatory fields.");
            return;
        }
        this.service.saveUser(this.user);
    }

    goBack() {
        this.router.navigate(['users']);
    }

}
