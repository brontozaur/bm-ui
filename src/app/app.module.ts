import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {UserEditComponent} from './users/user-edit/user-edit.component';
import {AuthorEditComponent} from './authors/author-edit/author-edit.component';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core.module';
import {FormsModule} from '@angular/forms';
import {BookEditComponent} from './books/book-edit/book-edit.component';
import {BooksUploadComponent} from './books/books-upload/books-upload.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    declarations: [
        AppComponent,
        UserEditComponent,
        BookEditComponent,
        BooksUploadComponent,
        AuthorEditComponent,
        HeaderComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CoreModule,
        FormsModule,
        NoopAnimationsModule,
        MatSnackBarModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
