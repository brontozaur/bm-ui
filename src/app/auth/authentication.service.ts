import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {NotificationService} from "../notification.service";

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,
              private router: Router,
              private notification: NotificationService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    if (localStorage.getItem('currentUser')) {
      return this.currentUserSubject.value;
    }
    return null;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, {username, password})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  public testIfHasToken(url) {
      var currentUser = this.currentUserValue;
      if (currentUser && currentUser.accessToken) {
          return;
      }
      this.logout();
      this.router.navigate(['/login'], {queryParams: {returnUrl: url}});
      this.notification.showErrorNotification("Token expired or invalid. Please login again.");

  }
}
