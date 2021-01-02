import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Author} from "./author.model";
import {AuthorsService} from "./authors.service";

@Injectable({providedIn: 'root'})
export class AuthorsResolver implements Resolve<Author[]> {
    constructor(private service: AuthorsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return this.service.getAuthors();
    }
}
