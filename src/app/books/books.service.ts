import {Subject} from 'rxjs';
import {Book} from './book.model';
import {Author} from '../authors/author.model';

export class BooksService {
    booksChanged = new Subject<Book[]>();

    private books: Book[] = [
        new Book(1, 'America', [new Author(1, 'Franz', 'Kafka')], '978545145415', 2000, 'SF', 'Description', null, 'GREEN', new Date(), 'Mary',
            new Date(), 'oli'),
        new Book(2, 'Batranul si marea', [new Author(2, 'Ernest', 'Hemingway')], '978545145412', 1980, 'FANTASY', 'Description',
            null, 'YELLOW', new Date(), 'oli', new Date(), 'oli'),
        new Book(3, 'Parisul in secolul XX', [new Author(3, 'Jules', 'Verne')], '978545145413', 1999, 'DRAMA', 'Description',
            null, 'RED', new Date(), 'eugen', new Date(), 'oli'),
        new Book(4, 'Singur pe lume', [new Author(4, 'Hector', 'Malot')], '978545145414', 2001, 'SF', 'Description', null, 'GREEN',
            new Date(), 'Mary', new Date(), 'oli'),
        new Book(5, 'Cocosatul de la Notre-Dame', [new Author(5, 'Victor', 'Hugo'), new Author(6, 'Mihai', 'Eminescu')],
            '978545145411', 2002, 'SF', 'Description', null, 'YELLOW', new Date(), 'oli.bob@gmail.com', new Date(), 'oli')
    ];

    setBooks(books: Book[]) {
        this.books = books;
        this.booksChanged.next(this.books.slice());
    }

    getBooks() {
        return this.books.slice();
    }

    getBook(id: number) {
        return this.books[id - 1];
    }

    saveBook(book: Book) {
        if (book.id) {
            this.books[book.id - 1] = book;
            this.booksChanged.next(this.books.slice());
        } else {
            this.books.push(book);
            this.booksChanged.next(this.books.slice());
        }
    }

    deleteBook(index: number) {
        this.books.splice(index, 1);
        this.booksChanged.next(this.books.slice());
    }
}
