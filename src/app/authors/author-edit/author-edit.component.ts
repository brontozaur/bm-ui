import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Author} from '../author.model';
import {AuthorsService} from '../authors.service';
import {NotificationService} from "../../notification.service";
import {AuthenticationService} from "../../auth/authentication.service";

@Component({
    selector: 'app-user-detail',
    templateUrl: './author-edit.component.html',
    styleUrls: ['../../app.component.css']
})
export class AuthorEditComponent implements OnInit {
    author: Author;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: AuthorsService,
                private notification: NotificationService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.authenticationService.testIfHasToken("authors");

        this.route.data.subscribe((data: { author: Author }) => {
            this.author = data.author;
        });
    }

    saveAuthor(authorEditForm) {
        if (authorEditForm.form.status !== 'VALID') {
            this.notification.showErrorNotification("Invalid form. Please complete mandatory fields.");
            return;
        }
        this.service.saveAuthor(this.author, null);
    }

    goBack() {
        this.router.navigate(['authors']);
    }

}
