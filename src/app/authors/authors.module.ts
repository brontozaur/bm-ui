import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthorsComponent} from './authors.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [AuthorsComponent],
    imports: [
        FormsModule,
        RouterModule.forChild([{path: '', component: AuthorsComponent}]),
        SharedModule
    ]
})
export class AuthorsModule {
}
