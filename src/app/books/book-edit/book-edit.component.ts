import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Book} from '../book.model';
import {BooksService} from '../books.service';
import {Author} from '../../authors/author.model';
import {NotificationService} from "../../notification.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-book-detail',
    templateUrl: './book-edit.component.html',
    styleUrls: ['./book-edit.component.css',
        '../../app.component.css']
})
export class BookEditComponent implements OnInit {
    book: Book;
    defaultImage = '../../../assets/img/no-image.png';
    imageFile;
    msg: string;
    authors: Author[];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: BooksService,
                private notification: NotificationService,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { book: Book, authors: Author[] }) => {
            this.book = data.book;
            this.authors = data.authors;

            let objectURL = 'data:image/png;base64,' + this.book.imageBook;
            this.imageFile = this.sanitizer.bypassSecurityTrustUrl(objectURL);

            if (this.book.authors.length == 0) {
                this.book.authors.push(new Author());
            }
        });

    }

    saveBook(bookEditForm) {
        if (bookEditForm.form.status !== 'VALID') {
            for (var index in this.book.authors) {
                if (this.book.authors[index] == undefined || this.book.authors[index].id == undefined) {
                    this.notification.showErrorNotification("Please select a valid author");
                    return;
                }
            }
            this.notification.showErrorNotification("Invalid form. Please complete mandatory fields.");
            return;
        }
        this.service.saveBook(this.book);
    }

    goBack() {
        this.router.navigate(['books']);
    }

    addAuthor() {
        this.book.authors.push(new Author());
    }

    deleteAuthor(index) {
        this.book.authors.splice(index, 1);
    }

    selectFile(event) {
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            this.msg = 'You must select an image';
            return;
        }

        var mimeType = event.target.files[0].type;

        if (mimeType.match(/image\/*/) == null) {
            this.msg = 'Only images are supported';
            return;
        }
        var file = event.target.files[0];
        this.service.uploadImage(file, this.book);
        this.readAsDataUrl(file);
    }

    readAsDataUrl(image) {
        var reader = new FileReader();
        reader.readAsDataURL(image);

        reader.onload = (_event) => {
            this.msg = '';
            this.imageFile = reader.result;
        };
    }

    getCompleteName(author) {
        if (author && author.id) {
            return author.firstName + ' ' + author.lastName;
        }
    }

    saveSelectedAuthor($event, index) {
        let name = $event.target.value;
        let selectedAuthor = this.authors.filter(x => (x.firstName + ' ' + x.lastName) === name)[0];
        this.book.authors[index] = selectedAuthor;
    }

}
