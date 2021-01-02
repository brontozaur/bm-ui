import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BooksComponent} from './books.component';

@NgModule({
    declarations: [BooksComponent],
    imports: [
        FormsModule,
        RouterModule.forChild([{path: '', component: BooksComponent}])
    ]
})
export class BooksModule {
}
