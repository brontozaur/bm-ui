import {UserBook} from '../user-book.model';
import {UsersService} from '../users.service';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserBookResolver implements Resolve<UserBook> {
    constructor(private service: UsersService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const id: number = parseInt(route.params.id);
        if (id === 0) {
            return new UserBook(null, '', '', 'ADMIN', '', '', '');
        }
        console.log('Get the user with id', id);
        return this.service.getUser(id);
    }
}
