import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Book} from '../book.model';
import {BooksService} from '../books.service';
import {Author} from '../../authors/author.model';
import {AuthorsService} from "../../authors/authors.service";

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
                private service: BooksService) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { book: Book, authors: Author[] }) => {
            this.book = data.book;
            this.authors = data.authors;
            this.imageFile = this.book.image;
        });

    }

    saveBook(bookEditForm) {
        if (bookEditForm.form.status === 'VALID') {
            this.service.saveBook(this.book, this.goBack());
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
        if(author && author.id) {
            return author.firstName + ' ' + author.lastName;
        }
    }

    saveSelectedAuthor($event, index) {
        let name = $event.target.value;
        let selectedAuthor = this.authors.filter(x => (x.firstName +' '+x.lastName) === name)[0];
        this.book.authors[index] = selectedAuthor;
    }

}
