import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Book} from '../book.model';
import {BooksService} from '../books.service';
import {Author} from '../../authors/author.model';

@Component({
    selector: 'app-book-detail',
    templateUrl: './book-edit.component.html',
    styleUrls: ['./book-edit.component.css',
        '../../app.component.css']
})
export class BookEditComponent implements OnInit {
    book: Book;
    defaultImage = '../../../assets/img/no-image.png';
    msg: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: BooksService) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { book: Book }) => {
            this.book = data.book;
        });
    }

    saveBook(bookEditForm) {
        if (bookEditForm.form.status === 'VALID') {
            this.service.saveBook(this.book);
            this.goBack();
        }
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

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (_event) => {
            this.msg = '';
            this.book.image = reader.result;
        };
    }

}
