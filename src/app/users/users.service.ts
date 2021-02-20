import {UserBook} from './user-book.model';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from "../notification.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

export class UsersService {

    constructor(private http: HttpClient,
                private notification: NotificationService,
                private router: Router) {}

    getUser(id: number) {
        return this.http.get<UserBook>(`${environment.apiUrl}/api/v1/users/` + id)
    }

    saveUser(user: UserBook) {
        this.http.post<UserBook>(`${environment.apiUrl}/api/v1/users`, user).subscribe({
            next: data => {
                this.router.navigate(['users']);
            },
            error: error => {
                this.notification.showErrorNotification("There was an error!");
                console.error('There was an error!', error);
            }
        })
    }

    deleteUser(id: number) {
        return this.http.delete(`${environment.apiUrl}/api/v1/users/` + id)
            .subscribe(() => {
                this.notification.showOKNotification("Deleted successfully!");
                console.log('Delete successful');});
    }
}
