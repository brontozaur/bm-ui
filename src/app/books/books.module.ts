import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BooksComponent} from './books.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [BooksComponent],
    imports: [
        FormsModule,
        RouterModule.forChild([{path: '', component: BooksComponent}]),
        SharedModule
    ]
})
export class BooksModule {
}
