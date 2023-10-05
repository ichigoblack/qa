import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { Encabezado } from 'app/auth/models/seguridad/encabezado';
//implements Resolve<any>
@Injectable()
export class NotificacionService  {
  rows: any;
  //onDatatablessChanged: BehaviorSubject<any>;

  

  constructor(
    private _httpClient: HttpClient
  ) {
    //this.onDatatablessChanged = new BehaviorSubject({});
  }

  encabezado(encabezados:Array<Encabezado>) {
    let resultado:any[] = []
    encabezados.forEach((element:Encabezado) => {
      if (element.vista_usuario == 1) {
        resultado.push(element.descripcion_usuario)
      }
    });
    return resultado;
  }

  

  /*
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/datatable-rows').subscribe((response: any) => {
        this.rows = response;
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }*/
}
