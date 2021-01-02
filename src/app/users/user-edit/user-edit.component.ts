import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserBook} from '../user-book.model';
import {UsersService} from '../users.service';
import {NotificationService} from "../../notification.service";

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-edit.component.html',
    styleUrls: ['../../app.component.css']
})
export class UserEditComponent implements OnInit {
    user: UserBook;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: UsersService,
                private notification: NotificationService) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { user: UserBook }) => {
            this.user = data.user;
        });
    }

    saveUser(userEditForm) {
        if (userEditForm.form.status !== 'VALID') {
            this.notification.showErrorNotification("Invalid form. Please complete mandatory fields.");
            return;
        }
        this.service.saveUser(this.user, this.goBack());
    }

    goBack() {
        this.router.navigate(['users']);
    }

}
