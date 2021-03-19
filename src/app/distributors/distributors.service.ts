import {Distributor} from './distributor.model';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from "../notification.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {DialogSpinnerDialogComponent} from "../spinner/spinner-dialog.component";
import {MatDialog} from "@angular/material";

export class DistributorsService {

    constructor(private http: HttpClient,
                private notification: NotificationService,
                private router: Router,
                private matDialog: MatDialog) {
    }

    getDistributor(id: number) {
        var dialog = this.matDialog.open(DialogSpinnerDialogComponent, { id: 'DialogSpinnerComponent', disableClose: true });
        return this.http.get<Distributor>(`${environment.apiUrl}/api/v1/distributors/` + id).subscribe(() => {
            dialog.close();
        });
    }

    saveDistributor(distributor: Distributor) {
        var dialog = this.matDialog.open(DialogSpinnerDialogComponent, { id: 'DialogSpinnerComponent', disableClose: true });

        this.http.post<Distributor>(`${environment.apiUrl}/api/v1/distributors`, distributor).subscribe({
            next: data => {
                dialog.close();
                this.router.navigate(['distributors']);
            },
            error: error => {
                dialog.close();
                if (error) {
                    this.notification.showErrorNotification(error);
                } else {
                    this.notification.showErrorNotification("There was an error!");
                }
            }
        })
    }

    deleteDistributor(id: number, callbackFcn: () => void) {
        var dialog = this.matDialog.open(DialogSpinnerDialogComponent, { id: 'DialogSpinnerComponent', disableClose: true });

        return this.http.delete(`${environment.apiUrl}/api/v1/distributors/` + id)
            .subscribe(() => {
                dialog.close();
                callbackFcn();
                this.notification.showOKNotification("Deleted successfully!");
                console.log('Delete successful');
            });
    }

    getAll() {
        var dialog = this.matDialog.open(DialogSpinnerDialogComponent, { id: 'DialogSpinnerComponent', disableClose: true });
        return this.http.get<Distributor>(`${environment.apiUrl}/api/v1/distributors/all`).subscribe(() => {
            dialog.close();
        });
    }

    reloadDistributors(table) {
        var dialog = this.matDialog.open(DialogSpinnerDialogComponent, { id: 'DialogSpinnerComponent', disableClose: true });

        this.http.get<Distributor>(`${environment.apiUrl}/api/v1/distributors/reload`)
            .subscribe({
                next: data => {
                    dialog.close();
                    table.setData();
                },
                error: error => {
                    dialog.close();
                    this.notification.showErrorNotification(error);
                    console.error('There was an error!', error);
                }
            });
    }
}
