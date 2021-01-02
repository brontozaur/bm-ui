import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookUpload} from './book-upload.model';
import {BooksService} from '../books.service';

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
                private service: BooksService) {
    }

    ngOnInit() {
    }

    goBack() {
        this.router.navigate(['books']);
    }

    selectFile(bookSelected: BookUpload, event) {
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            this.msg = 'You must select an image';
            return;
        }

        var mimeType = event.target.files[0].type;

        if (mimeType.match(/image\/*/) == null) {
            this.msg = 'Only images are supported';
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (_event) => {
            this.msg = '';
            bookSelected.image = reader.result;
        };
    }

    deleteBook(bookSelected: BookUpload) {
        this.books = this.books.filter(obj => obj !== bookSelected);
    }

    selectEpub(bookSelected: BookUpload, event) {
        var file = event.target.files[0];
        this.addFile(file, bookSelected.title);
    }

    addFile(file, bookName) {
        var mimeType = file.type;
        var isBook = file.name.split('.')[1] === 'epub';

        if (!isBook && (mimeType && mimeType.match(/image\/*/) == null)) {
            this.msg = 'Only images or epub are supported';
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
            if (book == undefined) {
                book = new BookUpload(bookName, null, null);
                this.bookMap.set(bookName, book);
                this.books.push(book);
            }
            if (isBook) {
                book.file = reader.result;
            } else {
                book.image = reader.result;
            }
        };
    }

    load(event) {
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            this.msg = 'You must select a file';
            return;
        }

        for (const i in event.target.files) {
            var file = event.target.files[i];
            var bookName = file.name.split('.')[0];
            this.addFile(file, bookName);
        }
    }

    save() {
        if(!this.isFormValid()) {
            console.log("Invalid form");
            return;
        }
        this.service.uploadBooks(this.bookMap);
    }

    isFormValid() {
        var valid = true;
        if(this.bookMap.size == 0)
            valid = false;
        Array.from(this.bookMap.values()).forEach(value => {
            if(value.file == undefined) {
                valid = false;
            }
        });
        return valid;
    }

    /*
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    this.http.post('my-backend.com/file-upload', uploadData)
      .subscribe(...);
     */

}
