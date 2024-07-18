import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  apiUrl: String = 'http://localhost:9090'; //Change me

  constructor(private http: HttpClient) {}

  getUserEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/event/').pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        console.log('error: ' + error.message);
        return of([]);
      })
    );
  }
  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/event/delete/${eventId}`).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        console.log('error: ' + error.message);
        return of(null);
      })
    );
  }

  deleteEventForAll(eventId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/v1/admin/delete/${eventId}`).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        console.log('error: ' + error.message);
        return of(null);
      })
    );
  }

  updateEvent(event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/event/update`, event).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        console.log('error: ' + error.message);
        return of(null);
      })
    );
  }

  saveEvent(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/event/save`, event).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        console.log('error: ' + error.message);
        return of(null);
      })
    );
  }

  getEventUsers(eventId:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/v1/admin/${eventId}/users`).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        console.log('error: ' + error.message);
        return of([]);
      })
    );
  }
  
  unassign(userId:number,eventId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/v1/admin/unassign/${eventId}/${userId}`).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        console.log('error: ' + error.message);
        return of(null);
      })
    );
  }
}
