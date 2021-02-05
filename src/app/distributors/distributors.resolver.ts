import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Distributor} from "./distributor.model";
import {DistributorsService} from "./distributors.service";

@Injectable({providedIn: 'root'})
export class DistributorsResolver implements Resolve<Distributor[]> {
    constructor(private service: DistributorsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return this.service.getAll();
    }
}
