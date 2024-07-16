import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  apiUrl:String="http://localhost:9090/api/v1/auth"; //Change me
  
  constructor(private http: HttpClient) {
    this.loggedIn.next(!!localStorage.getItem('jwtToken'));
  }

  saveUser(user: any): Observable<any> {
      if(user.password===user.conformPassword){
        delete user.conformPassword;
        console.log("save:", JSON.stringify(user));
        return this.http.post(`${this.apiUrl}/register`,user).pipe(
          tap((response) => {
            return response;
          }),
          catchError(error => {
            console.log("error: "+error.message);
            return of(null);
          })
        );
      }else{
        console.log("password not confirmed");
        return of(null);
      }
  }

  login(user:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, user).pipe(
      tap((response) => {
        return response;
      }),
      catchError(error => {
        console.log("error: "+error.message);
        return of(null);
      })
    );
  }


  store(token: string,role: string) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('role', role);
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
  }

  isAuthenticated() {
    return this.loggedIn.asObservable();
  }
  
  getToken() {
    return localStorage.getItem('jwtToken');
  }

  getRole() {
    return localStorage.getItem('role');
  }
  
}
