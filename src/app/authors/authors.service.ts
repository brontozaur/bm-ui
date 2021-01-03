import {Author} from './author.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotificationService} from "../notification.service";
import {Router} from "@angular/router";

export class AuthorsService {

    constructor(private http: HttpClient,
                private notification: NotificationService,
                private router: Router) {}

    getAuthor(id: number) {
        return this.http.get<Author>('http://localhost:8080/api/v1/authors/' + id);
    }

    saveAuthor(author: Author) {
        this.http.post<Author>('http://localhost:8080/api/v1/authors', author, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).subscribe({
            next: data => {
                this.router.navigate(['authors']);
            },
            error: error => {
                this.notification.showErrorNotification("There was an error!");
                console.error('There was an error!', error);
            }
        })
    }

    deleteAuthor(id: number) {
        return this.http.delete('http://localhost:8080/api/v1/authors/' + id)
            .subscribe(() => {
                this.notification.showOKNotification("Deleted successfully!");
                console.log('Delete successful');});
    }

    getAuthors() {
        return this.http.get<Author>('http://localhost:8080/api/v1/authors/all');
    }
}
