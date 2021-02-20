import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {UsersService} from './users/users.service';
import {AuthorsService} from './authors/authors.service';
import {BooksService} from './books/books.service';
import {DistributorsService} from "./distributors/distributors.service";
import {ErrorInterceptor, JwtInterceptor} from "./auth";

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        UsersService,
        BooksService,
        AuthorsService,
        DistributorsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ]
})
export class CoreModule {
}
