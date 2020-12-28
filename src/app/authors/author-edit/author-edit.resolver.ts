import {Author} from '../author.model';
import {AuthorsService} from '../authors.service';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthorResolver implements Resolve<Author> {
    constructor(private service: AuthorsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const id: number = parseInt(route.params.id);
        if (id === 0) {
            return new Author(null, '', '');
        }
        console.log('Get the author with id', id);
        return this.service.getAuthor(id);
    }
}
