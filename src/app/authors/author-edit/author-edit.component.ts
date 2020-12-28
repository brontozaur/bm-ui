import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Author} from '../author.model';
import {AuthorsService} from '../authors.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './author-edit.component.html',
    styleUrls: ['../../app.component.css']
})
export class AuthorEditComponent implements OnInit {
    author: Author;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: AuthorsService) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { author: Author }) => {
            this.author = data.author;
        });
    }

    saveAuthor(authorEditForm) {
        if (authorEditForm.form.status === 'VALID') {
            this.service.saveAuthor(this.author);
            this.goBack();
        }
    }

    goBack() {
        this.router.navigate(['authors']);
    }

}
