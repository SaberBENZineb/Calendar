import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl:String="http://localhost:9090"; //Change me

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/api/v1/admin/").pipe(
      tap((response) => {
        return response;
      }),
      catchError(error => {
        console.log("error: "+error.message);
        return of([]);
      })
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/delete/${userId}`).pipe(
      tap((response) => {
        return response;
      }),
      catchError(error => {
        console.log("error: "+error.message);
        return of(null);
      })
    );
  }

  updateUser(user: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/user/update`,user).pipe(
        tap((response) => {
          return response;
        }),
        catchError(error => {
          console.log("error: "+error.message);
          return of(null);
        })
      );
  }

  getUserEventsByEmail(email: String): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/v1/admin/${email}/events`).pipe(
        tap((response) => {
          return response;
        }),
        catchError(error => {
          console.log("error: "+error.message);
          return of(null);
        })
      );
  }

  assignEventToUsers(emails: String[],eventId:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/v1/admin/event/${eventId}`,emails).pipe(
      tap((response) => {
        return response;
      }),
      catchError(error => {
        console.log("error: "+error.message);
        return of(null);
      })
    );
  }
}
