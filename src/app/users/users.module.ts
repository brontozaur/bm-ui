import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {UsersComponent} from './users.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [UsersComponent],
    imports: [
        FormsModule,
        RouterModule.forChild([{path: '', component: UsersComponent}]),
        SharedModule
    ]
})
export class UsersModule {
}
