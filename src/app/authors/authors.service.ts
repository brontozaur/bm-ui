import {Author} from './author.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotificationService} from "../notification.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

export class AuthorsService {

    constructor(private http: HttpClient,
                private notification: NotificationService,
                private router: Router) {
    }

    getAuthor(id: number) {
        return this.http.get<Author>(`${environment.apiUrl}/api/v1/authors/` + id);
    }

    saveAuthor(author: Author) {
        this.http.post<Author>(`${environment.apiUrl}/api/v1/authors`, author, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).subscribe({
            next: data => {
                this.router.navigate(['authors']);
            },
            error: error => {
                this.notification.showErrorNotification("There was an error: " + error);
                console.error('There was an error!', error);
            }
        })
    }

    deleteAuthor(id: number, callbackFcn: () => void) {
        return this.http.delete(`${environment.apiUrl}/api/v1/authors/` + id)
            .subscribe(() => {
                callbackFcn();
                this.notification.showOKNotification("Deleted successfully!");
                console.log('Delete successful');
            });
    }

    getAuthors() {
        return this.http.get<Author>(`${environment.apiUrl}/api/v1/authors/all`);
    }
}
