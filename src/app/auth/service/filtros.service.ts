import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Flitro } from '../models/seguridad/filtro';

@Injectable({
  providedIn: 'root'
})
export class FiltrosService {

  private filtrosSubject: BehaviorSubject<Flitro>;
  public filtros: Observable<Flitro>;

  constructor() {
    this.filtrosSubject = new BehaviorSubject<Flitro>(null);
    this.filtros = this.filtrosSubject.asObservable();
  }

  public get filtrosValue(): Flitro {
    return this.filtrosSubject.value;
  }

  asignacion(filtro:Flitro){
      this.filtrosSubject.next(filtro);
  }

}