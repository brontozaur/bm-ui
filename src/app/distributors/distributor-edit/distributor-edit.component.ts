import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Distributor} from '../distributor.model';
import {DistributorsService} from '../distributors.service';
import {NotificationService} from "../../notification.service";
import {AuthenticationService} from "../../auth/authentication.service";

@Component({
    selector: 'app-distributor-detail',
    templateUrl: './distributor-edit.component.html',
    styleUrls: ['../../app.component.css']
})
export class DistributorEditComponent implements OnInit {
    distributor: Distributor;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: DistributorsService,
                private notification: NotificationService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.authenticationService.testIfHasToken("distributors");

        this.route.data.subscribe((data: { distributor: Distributor }) => {
            this.distributor = data.distributor;
        });
    }

    saveDistributor(distributorEditForm) {
        if (distributorEditForm.form.status !== 'VALID') {
            this.notification.showErrorNotification("Invalid form. Please complete mandatory fields.");
            return;
        }
        this.service.saveDistributor(this.distributor);
    }

    goBack() {
        this.router.navigate(['distributors']);
    }

}
