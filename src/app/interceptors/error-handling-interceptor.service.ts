import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, retry, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { LoaderService } from '../services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandingInterceptor implements HttpInterceptor {

  constructor(private readonly loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.loaderOn();
    return next.handle(request)
 
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          window.alert(errorMessage);
          throw new Error(errorMessage);
 
        }),
        finalize(() => this.loaderService.loaderOff())
      )
 
  }
}
