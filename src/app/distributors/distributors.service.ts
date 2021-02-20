import {Distributor} from './distributor.model';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from "../notification.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

export class DistributorsService {

    constructor(private http: HttpClient,
                private notification: NotificationService,
                private router: Router) {
    }

    getDistributor(id: number) {
        return this.http.get<Distributor>(`${environment.apiUrl}/api/v1/distributors/` + id)
    }

    saveDistributor(distributor: Distributor) {
        this.http.post<Distributor>(`${environment.apiUrl}/api/v1/distributors`, distributor).subscribe({
            next: data => {
                this.router.navigate(['distributors']);
            },
            error: error => {
                if (error) {
                    this.notification.showErrorNotification(error);
                } else {
                    this.notification.showErrorNotification("There was an error!");
                }
            }
        })
    }

    deleteDistributor(id: number) {
        return this.http.delete(`${environment.apiUrl}/api/v1/distributors/` + id)
            .subscribe(() => {
                this.notification.showOKNotification("Deleted successfully!");
                console.log('Delete successful');
            });
    }

    getAll() {
        return this.http.get<Distributor>(`${environment.apiUrl}/api/v1/distributors/all`);
    }

    reloadDistributors(table) {
        this.http.get<Distributor>(`${environment.apiUrl}/api/v1/distributors/reload`)
            .subscribe({
                next: data => {
                    table.setData();
                },
                error: error => {
                    this.notification.showErrorNotification("There was an error!");
                    console.error('There was an error!', error);
                }
            });
    }
}
