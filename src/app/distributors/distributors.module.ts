import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DistributorsComponent} from './distributors.component';

@NgModule({
    declarations: [DistributorsComponent],
    imports: [
        FormsModule,
        RouterModule.forChild([{path: '', component: DistributorsComponent}])
    ]
})
export class DistributorsModule {
}
