import {Subject} from 'rxjs';
import {Author} from './author.model';

export class AuthorsService {
    authorsChanged = new Subject<Author[]>();

    private authors: Author[] = [
        new Author(1, 'Franz', 'Kafka'),
        new Author(2, 'Ernest', 'Hemingway'),
        new Author(3, 'Jules', 'Verne'),
        new Author(4, 'Hector', 'Malot'),
        new Author(5, 'Cezar', 'Petrescu')
    ];

    //private authors: Author[] = [];

    setAuthors(authors: Author[]) {
        this.authors = authors;
        this.authorsChanged.next(this.authors.slice());
    }

    getAuthors() {
        return this.authors.slice();
    }

    getAuthor(id: number) {
        return this.authors[id - 1];
    }

    saveAuthor(author: Author) {
        if (author.id) {
            this.authors[author.id - 1] = author;
            this.authorsChanged.next(this.authors.slice());
        } else {
            this.authors.push(author);
            this.authorsChanged.next(this.authors.slice());
        }
    }

    deleteAuthor(index: number) {
        this.authors.splice(index, 1);
        this.authorsChanged.next(this.authors.slice());
    }
}
