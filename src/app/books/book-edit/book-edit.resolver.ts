import {Book} from '../book.model';
import {BooksService} from '../books.service';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class BookResolver implements Resolve<Book> {
    constructor(private service: BooksService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const id: number = parseInt(route.params.id);
        console.log('Get the book with id', id);
        return this.service.getBook(id);
    }
}
