import {Author} from './author.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export class AuthorsService {

    constructor(private http: HttpClient) {}

    getAuthor(id: number) {
        return this.http.get<Author>('http://localhost:8080/api/v1/authors/' + id);
    }

    saveAuthor(author: Author, callbackFcn) {
        this.http.post<Author>('http://localhost:8080/api/v1/authors', author, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).subscribe({
            next: data => {
                callbackFcn();
            },
            error: error => {
                console.error('There was an error!', error);
            }
        })
    }

    deleteAuthor(id: number) {
        return this.http.delete('http://localhost:8080/api/v1/authors/' + id)
            .subscribe(() => {console.log('Delete successful');});
    }

    getAuthors() {
        return this.http.get<Author>('http://localhost:8080/api/v1/authors/all');
    }
}
