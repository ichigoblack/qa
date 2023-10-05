import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;


  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value; 
  }

  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }
  
  login(email: string, password: string, idEmpresa: string) {
    let usuario = email; 
    return this._http
      .post<any>(`${environment.apiUrl}/api/auth/login`, { usuario, password, idEmpresa })
      .pipe(
        map(user => {
          //console.log(user)
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            sessionStorage.setItem('currentPerfil', user.perfiles);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                '' +
                  user.perfiles +
                  '',
                '' + user.nombres + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);
            this.currentUserSubject.next(user);
          }
          return user;
        })
      );
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentPerfil');
    this.currentUserSubject.next(null);
  }
}
