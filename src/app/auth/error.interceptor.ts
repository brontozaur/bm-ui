import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(errorResponse => {
      if (errorResponse.status === 401) {
        // auto logout if 401 response returned from api
        if (!errorResponse.url || !errorResponse.url.endsWith("login")) {
          this.authenticationService.logout();
          this.router.navigate(['/login'], {queryParams: {returnUrl: errorResponse.url}});
        }
      }

      const error = errorResponse.error && errorResponse.error.message || errorResponse.statusText;
      return throwError(error);
    }))
  }
}
