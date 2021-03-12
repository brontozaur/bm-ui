import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Book} from '../book.model';
import {BooksService} from '../books.service';
import {Author} from '../../authors/author.model';
import {NotificationService} from "../../notification.service";
import { DomSanitizer } from '@angular/platform-browser';
import {AuthenticationService} from "../../auth/authentication.service";

@Component({
    selector: 'app-book-detail',
    templateUrl: './book-edit.component.html',
    styleUrls: ['./book-edit.component.css',
        '../../app.component.css']
})
export class BookEditComponent implements OnInit {
    book: Book;
    defaultImage = 'books/assets/img/no-image.png';
    imageFile;
    msg: string;
    authors: Author[];
    readOnlyProperties: boolean;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: BooksService,
                private notification: NotificationService,
                private sanitizer: DomSanitizer,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.authenticationService.testIfHasToken("books");

        this.route.data.subscribe((data: { book: Book, authors: Author[] }) => {
            this.book = data.book;
            this.authors = data.authors;

            let objectURL = 'data:image/png;base64,' + this.book.imageBook;
            this.imageFile = this.sanitizer.bypassSecurityTrustUrl(objectURL);

            if (this.book.authors.length == 0) {
                this.book.authors.push(new Author());
            }
            this.readOnlyProperties = this.book.status == 'GREEN';
        });

    }

    saveBook(bookEditForm) {
        for (var index in this.book.authors) {
            if (this.book.authors[index] == undefined || this.book.authors[index].id == undefined) {
                this.notification.showErrorNotification("Please select a valid author");
                return;
            }
        }
        if (bookEditForm.form.status !== 'VALID') {
            this.notification.showErrorNotification("Invalid form. Please complete mandatory fields.");
            return;
        }
        if(this.book.epub == null) {
            this.notification.showErrorNotification("Please select a pdf or epub file");
            return;
        }
        if(this.book.image == null) {
            this.notification.showErrorNotification("Please select an image");
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

    selectFile(event, isImage) {
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            this.msg = 'You must select a file';
            return;
        }

        var mimeType = event.target.files[0].type;

        if (mimeType.match(/image\/*/) == null && isImage) {
            this.msg = 'Only images are supported';
            return;
        }

        var file = event.target.files[0];

        if (file && file.name) {
            let extension = file.name.split('.');
            if (extension.length > 0) {
                var isBook = (extension[1] === 'epub' || extension[1] === 'pdf');
                if(!isImage && !isBook) {
                    this.msg = 'Only epub or pdf are supported';
                    this.notification.showErrorNotification(this.msg);
                    return;
                }
            }
        }

        if (isBook) {
            this.book.format = mimeType;
        }

        this.service.uploadFile(file, this.book, isImage);
        if(isImage) {
            this.readAsDataUrl(file);
        }
    }

    readAsDataUrl(image) {
        var reader = new FileReader();
        reader.readAsDataURL(image);

        reader.onload = (_event) => {
            this.msg = '';
            this.imageFile = reader.result;
        };
    }

    loadEpub(event) {
        this.selectFile(event, false);
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
