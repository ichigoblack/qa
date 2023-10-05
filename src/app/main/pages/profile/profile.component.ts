import { Component, OnInit,OnDestroy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subject } from 'rxjs';

import { ProfileService } from 'app/main/pages/profile/profile.service';
import { UsuarioService } from 'app/services/seguridad/usuario.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit{
  // public
  user: any = {};
  nombres: string;
  apellidos: string;
  cedula: string;
  direccion: string;
  telefono: string;
  usuario: string;
  correo: string;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * 
   */
  constructor(private usuarioService: UsuarioService) {
  }

  
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Load More
   */
 /*  loadMore() {
    this.loadMoreRef = !this.loadMoreRef;
    setTimeout(() => {
      this.loadMoreRef = !this.loadMoreRef;
    }, 2000);
  } */

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(){
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.usuarioService.prueba(this.user.identificacion).then((response: any)=>{
      this.nombres = response.data.nombres;
      this.apellidos = response.data.apellidos;
      this.direccion = response.data.direccion;
      this.cedula = response.data.cedula;
      this.telefono = response.data.telefono;
      this.correo = response.data.email;
      this.usuario = response.data.usuario;
    });
  }
}
