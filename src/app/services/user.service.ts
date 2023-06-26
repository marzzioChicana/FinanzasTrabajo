import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Users } from '../models/users';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL:string = environment.baseURL;

  constructor( private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  handleError(error: HttpErrorResponse) {
    if(error.error instanceof ErrorEvent) {
      console.log(
        `An error occurred ${error.status}, body was: ${error.error}`
      );
    } else {
      console.log(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      'Something happened with request, please try again later.'
    );
  }

  getList(): Observable<Users[]> {
    return this.http
      .get<Users[]>(`${this.baseURL}/users.json`)
      .pipe(retry(2), catchError(this.handleError));
  }

  createItem(item: any): Observable<Users> {
    return this.http
      .post<Users>(`${this.baseURL}/users.json`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
