import {UserBook} from './user-book.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export class UsersService {

    constructor(private http: HttpClient) {}

    getUser(id: number) {
        return this.http.get<UserBook>('http://localhost:8080/api/v1/users/' + id)
    }

    saveUser(user: UserBook, callbackFcn) {
        this.http.post<UserBook>('http://localhost:8080/api/v1/users', user).subscribe({
            next: data => {
                callbackFcn();
            },
            error: error => {
                console.error('There was an error!', error);
            }
        })
    }

    deleteUser(id: number) {
        return this.http.delete('http://localhost:8080/api/v1/users/' + id)
            .subscribe(() => {console.log('Delete successful');});
    }
}
