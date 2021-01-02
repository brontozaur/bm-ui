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

const appRoutes: Routes = [
    {path: '', redirectTo: '/books ', pathMatch: 'full'},
    {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: 'users',
        loadChildren: './users/users.module#UsersModule'
    },
    {
        path: 'edit-users/:id',
        component: UserEditComponent,
        resolve: {
            user: UserBookResolver
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
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
