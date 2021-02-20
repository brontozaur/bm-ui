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
    metadataImage = '../../../assets/img/configuration.jpg';
    bookMap = new Map();
    metadataMap = new Map();
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
        if (bookSelected.isCSV) {
            this.metadataMap.delete(bookSelected.title);
        } else {
            this.bookMap.delete(bookSelected.title);
        }
    }

    selectEpub(bookSelected: BookUpload, event) {
        var file = event.target.files[0];
        this.addFile(file, bookSelected.title);
    }

    processBook(bookName, file) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (_event) => {
            var book = this.bookMap.get(bookName);
            if (typeof book == "undefined") {
                book = new BookUpload(bookName, null, null, file, false);
                this.bookMap.set(bookName, book);
                this.books.push(book);
            } else {
                book.epubFile = file;
            }
        };
    }

    processImage(bookName, file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (_event) => {
            var book = this.bookMap.get(bookName);
            if (typeof book == "undefined") {
                book = new BookUpload(bookName, null, file, null, false);
                this.bookMap.set(bookName, book);
                this.books.push(book);
            } else {
                book.imageFile = file;
            }
            book.image = reader.result;
        };
    }

    processMetadata(fileName, file) {
        var csvFile = new BookUpload(fileName, null, null, null, true);
        this.books.push(csvFile);
        this.metadataMap.set(fileName, file);
    }

    addFile(file, bookName) {
        var mimeType = file.type;
        var isBook = false;
        var isConfiguration = false;
        if (file && file.name) {
            let extension = file.name.split('.');
            if (extension.length > 0) {
                isBook = (extension[1] === 'epub' || extension[1] === 'pdf');
                isConfiguration = extension[1] === 'csv';
            }
        }

        if (!isBook && (mimeType && mimeType.match(/image\/*/) == null)) {
            this.msg = 'Only images or epub or pdf are supported';
            this.notification.showErrorNotification(this.msg);
            return;
        }

        if (isBook) {
            this.processBook(bookName, file);
        } else if (isConfiguration) {
            this.processMetadata(bookName, file);
        } else {
            this.processImage(bookName, file);
        }
    }

    load(event) {
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            this.msg = 'You must select a file';
            this.notification.showErrorNotification(this.msg);
            return;
        }

        for (const i in event.target.files) {
            if (i == 'item' || i == 'length') {
                continue;
            }
            var file = event.target.files[i];
            if (file && file.name) {
                let fileName = file.name;
                if (fileName.includes('.')) {
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
        this.service.uploadBooks(this.bookMap, this.metadataMap);
    }

    isFormValid() {
        var valid = true;
        if (this.bookMap.size == 0)
            valid = false;
        Array.from(this.bookMap.values()).forEach(value => {
            if (typeof value.epubFile === 'undefined' || value.epubFile == null
                || typeof value.imageFile === 'undefined' || value.imageFile == null) {
                valid = false;
            }
        });
        return valid;
    }

    toggleEditState(field, label) {
        if (field.type == 'text') {
            field.type = 'hidden';
            label.hidden = false;
        } else {
            field.type = 'text';
            label.hidden = true;
        }
    }
}
