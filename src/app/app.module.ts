import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {UserEditComponent} from './users/user-edit/user-edit.component';
import {AuthorEditComponent} from './authors/author-edit/author-edit.component';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BookEditComponent} from './books/book-edit/book-edit.component';
import {BooksUploadComponent} from './books/books-upload/books-upload.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DistributorEditComponent} from "./distributors/distributor-edit/distributor-edit.component";
import {LoginComponent} from "./auth/login.component";
import {MatDialogModule} from "@angular/material";
import {ConfirmDialogComponent} from "./dialog/confirm-dialog.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        UserEditComponent,
        BookEditComponent,
        BooksUploadComponent,
        AuthorEditComponent,
        HeaderComponent,
        DistributorEditComponent,
        ConfirmDialogComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatDialogModule
    ],
    bootstrap: [AppComponent],
    entryComponents: [ConfirmDialogComponent]
})
export class AppModule {
}
