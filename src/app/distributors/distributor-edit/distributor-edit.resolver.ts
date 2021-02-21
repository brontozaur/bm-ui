import {Distributor} from '../distributor.model';
import {DistributorsService} from '../distributors.service';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class DistributorEditResolver implements Resolve<Distributor> {
    constructor(private service: DistributorsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const id: number = parseInt(route.params.id);
        if (id === 0) {
            return new Distributor(null, null, "", '', '', '', '', 0, '', '');
        }
        console.log('Get the distributor with id', id);
        return this.service.getDistributor(id);
    }
}
