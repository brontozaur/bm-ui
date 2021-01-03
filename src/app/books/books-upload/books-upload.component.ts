import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookUpload} from './book-upload.model';
import {BooksService} from '../books.service';
import {NotificationService} from "../../notification.service";

@Component({
    selector: 'app-book-upload',
    templateUrl: './books-upload.component.html',
    styleUrls: ['./books-upload.component.css',
        '../../app.component.css']
})
export class BooksUploadComponent implements OnInit {
    public books: Array<BookUpload> = [];
    defaultImage = '../../../assets/img/no-image.png';
    bookMap = new Map();
    msg = '';

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: BooksService,
                private notification: NotificationService) {
    }

    ngOnInit() {
    }

    goBack() {
        this.router.navigate(['books']);
    }

    selectFile(bookSelected: BookUpload, event) {
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            this.msg = 'You must select an image';
            this.notification.showErrorNotification(this.msg);
            return;
        }

        var mimeType = event.target.files[0].type;

        if (mimeType.match(/image\/*/) == null) {
            this.msg = 'Only images are supported';
            this.notification.showErrorNotification(this.msg);
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (_event) => {
            this.msg = '';
            bookSelected.image = reader.result;
            bookSelected.imageFile = event.target.files[0];
        };
    }

    deleteBook(bookSelected: BookUpload) {
        this.books = this.books.filter(obj => obj !== bookSelected);
        this.bookMap.delete(bookSelected.title);
    }

    selectEpub(bookSelected: BookUpload, event) {
        var file = event.target.files[0];
        this.addFile(file, bookSelected.title);
    }

    addFile(file, bookName) {
        var mimeType = file.type;
        var isBook = false;
        if (file && file.name) {
            let extension = file.name.split('.');
            if (extension.length > 0) {
                isBook = (extension[1] === 'epub' || extension[1] === 'pdf');
            }
        }

        if (!isBook && (mimeType && mimeType.match(/image\/*/) == null)) {
            this.msg = 'Only images or epub or pdf are supported';
            this.notification.showErrorNotification(this.msg);
            return;
        }

        var reader = new FileReader();
        if (isBook) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsDataURL(file);
        }

        reader.onload = (_event) => {
            var book = this.bookMap.get(bookName);
            if (typeof book == "undefined") {
                book = new BookUpload(bookName, null, !isBook ? file : null, isBook ? file : null);
                this.bookMap.set(bookName, book);
                this.books.push(book);
            } else {
                if (!isBook) {
                    book.imageFile = file;
                } else {
                    book.epubFile = file;
                }
            }

            if (!isBook) {
                book.image = reader.result;
            }
        };
    }

    load(event) {
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            this.msg = 'You must select a file';
            this.notification.showErrorNotification(this.msg);
            return;
        }

        for (const i in event.target.files) {
            if(i == 'item' || i == 'length') {
                continue;
            }
            var file = event.target.files[i];
            if (file && file.name) {
                let fileName = file.name;
                if(fileName.includes('.')) {
                    fileName = file.name.split('.')[0];
                }
                this.addFile(file, fileName);
            }
        }
    }

    save() {
        if (!this.isFormValid()) {
            console.log("Invalid form");
            this.notification.showErrorNotification("Invalid form. Please check loaded files.");
            return;
        }
        this.service.uploadBooks(this.bookMap);
    }

    isFormValid() {
        var valid = true;
        if (this.bookMap.size == 0)
            valid = false;
        Array.from(this.bookMap.values()).forEach(value => {
            if (typeof value.epubFile === 'undefined' || value.epubFile == null) {
                valid = false;
            }
        });
        return valid;
    }

    toggleEditState(field, label) {
        if(field.type == 'text') {
            field.type = 'hidden';
            label.hidden = false;
        } else {
            field.type = 'text';
            label.hidden = true;
        }
    }
}
