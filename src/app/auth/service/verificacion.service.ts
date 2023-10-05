import { Injectable } from '@angular/core';
import { User } from './../models/seguridad/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class VerificacionService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(private _router: Router,) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('usuarioIntegrador')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    asignacion(user:User){
        this.userSubject.next(user);
    }

    logout() {
        sessionStorage.removeItem('usuarioIntegrador');
        this.userSubject.next(null);
        this._router.navigate(['/pages/miscellaneous/not-authorized']);
    }
}