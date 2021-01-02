import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthorsComponent} from './authors.component';

@NgModule({
    declarations: [AuthorsComponent],
    imports: [
        FormsModule,
        RouterModule.forChild([{path: '', component: AuthorsComponent}])
    ]
})
export class AuthorsModule {
}
