import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {UsersService} from './users/users.service';
import {AuthorsService} from './authors/authors.service';
import {BooksService} from './books/books.service';
import {AuthInterceptorService} from './auth/auth-interceptor.service';
import {DistributorsService} from "./distributors/distributors.service";

@NgModule({
    providers: [
        UsersService,
        BooksService,
        AuthorsService,
        DistributorsService
        /*{
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }*/
    ]
})
export class CoreModule {
}
