import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserBook} from '../user-book.model';
import {UsersService} from '../users.service';
import {NotificationService} from "../../notification.service";
import {Distributor} from "../../distributors/distributor.model";
import {DistributorsService} from "../../distributors/distributors.service";
import {AuthenticationService} from "../../auth/authentication.service";
import {UserRole} from "../../auth/userRole";

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-edit.component.html',
    styleUrls: ['../../app.component.css']
})
export class UserEditComponent implements OnInit {
    user: UserBook;
    distributors: Array<Distributor>;
    userRoles: Array<UserRole>;
    readOnlyRole: boolean;
    readOnlyProperties: boolean;
    confirmPassword: string;

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
            this.distributors = data.distributors;
            this.userRoles = this.getUserRoles();
            this.confirmPassword = this.user.password;
        });
    }

    saveUser(userEditForm) {
        if(this.user.password != this.confirmPassword) {
            this.notification.showErrorNotification("Invalid form. Passwords do not match.");
            return;
        }
        if (userEditForm.form.status !== 'VALID') {
            this.notification.showErrorNotification("Invalid form. Please complete mandatory fields.");
            return;
        }
        this.service.saveUser(this.user);
    }

    goBack() {
        this.router.navigate(['users']);
    }

    /**
     * Handles the edit/ create roles display. Logic is: current user can edit or create only users with role < his role.
     * We should probably restrict the users display entirely!
     */
    getUserRoles() {
        let userRoles = [];
        const currentUserRole = this.authService.currentUserValue.userResource.role;
        const isEditMyself = this.user.id == this.authService.currentUserValue.userResource.id;
        this.readOnlyRole = false;
        this.readOnlyProperties = false;
        switch (currentUserRole) {
            case 'SUPERADMIN': {
                if (isEditMyself) {
                    userRoles.push(new UserRole('SUPERADMIN', 'Super admin'));
                    this.readOnlyRole = true;
                }
                userRoles.push(new UserRole('ADMIN', 'Admin'));
                userRoles.push(new UserRole('USER', 'User'));
                break;
            }
            case 'ADMIN': {
                if (isEditMyself) {
                    userRoles.push(new UserRole('ADMIN', 'Admin'));
                }
                userRoles.push(new UserRole('USER', 'User'));
                break;
            }
            case 'USER': {
                userRoles.push(new UserRole('USER', 'User'));
                this.readOnlyRole = true;
                this.readOnlyProperties = true;
                break;
            }
        }
        return userRoles;
    }
}
