import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {UserEditComponent} from './users/user-edit/user-edit.component';
import {UserBookResolver} from './users/user-edit/user-edit.resolver.js';
import {AuthorResolver} from './authors/author-edit/author-edit.resolver';
import {AuthorEditComponent} from './authors/author-edit/author-edit.component';
import {BookEditComponent} from './books/book-edit/book-edit.component';
import {BookResolver} from './books/book-edit/book-edit.resolver';
import {BooksUploadComponent} from './books/books-upload/books-upload.component';
import {AuthorsResolver} from "./authors/authors.resolver";
import {DistributorsResolver} from "./distributors/distributors.resolver";
import {DistributorEditComponent} from "./distributors/distributor-edit/distributor-edit.component";
import {DistributorEditResolver} from "./distributors/distributor-edit/distributor-edit.resolver";
import {LoginComponent} from "./auth/login.component";
import {AuthGuard} from "./auth";

const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './books/books.module#BooksModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'users',
        loadChildren: './users/users.module#UsersModule'
    },
    {
        path: 'edit-users/:id',
        component: UserEditComponent,
        resolve: {
            user: UserBookResolver,
            distributors: DistributorsResolver
        }
    },
    {
        path: 'authors',
        loadChildren: './authors/authors.module#AuthorsModule'
    },
    {
        path: 'edit-authors/:id',
        component: AuthorEditComponent,
        resolve: {
            author: AuthorResolver
        }
    },
    {
        path: 'books',
        loadChildren: './books/books.module#BooksModule'
    },
    {
        path: 'edit-books/:id',
        component: BookEditComponent,
        resolve: {
            book: BookResolver,
            authors: AuthorsResolver
        }
    },
    {
        path: 'upload-books',
        component: BooksUploadComponent
    },
    {
        path: 'distributors',
        loadChildren: './distributors/distributors.module#DistributorsModule'
    },
    {
        path: 'edit-distributors/:id',
        component: DistributorEditComponent,
        resolve: {
            distributor: DistributorEditResolver
        }
    },

    // otherwise redirect to home
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
