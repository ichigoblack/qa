import { AdComponent } from '../../ad.component';
import { Component, OnInit } from '@angular/core';
import { Componente } from 'app/auth/models/seguridad/componente';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { Flitro } from 'app/auth/models/seguridad/filtro';

@Component({
  selector: 'app-dateboxs',
  templateUrl: './datebox.component.html',
  styleUrls: ['./datebox.component.scss']
})

export class DateboxComponent implements OnInit,AdComponent {

  data:any;
  id:number;
  element:any
  tipo:string = "";
  clases:string = "";
  nombre:string = "";
  estilosLabel:string = "";
  estilosPrincial:string = "";
  estilosComponente:string = "";
  fechaActual:Date = new Date()

  constructor(
    private _filtrosService: FiltrosService
  ) { 
    this._filtrosService.filtros.subscribe(x => {
      if(x){
        if(x.estado){
          let validador = this.validarIngreso(this.id,x)
          if(validador){
            if(x.limpieza.find(limpieza => limpieza===this.id)){
              this.element = null
              x.componentes.forEach((element:Componente) => {
                if(element.idnwicomponente === this.id){
                  element.resultado = null
                }
              });
            }
            this.avanzar(x)
          }
        }
      }
    })
  }

  avanzar(filtro:Flitro){
    if(filtro){
      filtro.control = filtro.control + 1
      filtro.estado = true
      let size:number = filtro.orden.length
      filtro.componentes.forEach((element:Componente) => {
        if(element.idnwicomponente === this.id){
          element.required = false
        }
      });
      if(filtro.control == size){
        filtro.hijos = []
        filtro.orden = []
        filtro.control = 0
        filtro.limpieza = []
        filtro.estado = false
      }
      this._filtrosService.asignacion(filtro);
    }
  }

  ngOnInit(): void {
    this.nombre = this.data.data.label;
    this.clases = this.data.data.clases; 
    this.tipo = this.data.data.tipodato;
    this.id = this.data.data.idnwicomponente;
    this.estilosLabel = this.data.data.estiloLabel; 
    this.estilosPrincial = this.data.data.estiloPrincipal; 
    this.estilosComponente = this.data.data.estiloComponente; 
  }

  capturar(idc:any,e:any){
    let captura = null;
    if(e.target.value){
      captura = e.target.value
    }
    let tempFiltros = this._filtrosService.filtrosValue;
    if(tempFiltros){
      let tempOrden = []
      tempFiltros.componentes.forEach((element:Componente) => {
        if(element.idnwicomponente == idc) {
          tempFiltros.orden = []
          tempFiltros.hijos = []
          tempFiltros.control = 0
          tempFiltros.fin = false
          tempFiltros.load = true
          tempFiltros.limpieza = []
          tempFiltros.estado = false
          tempFiltros.limpiarNotificacion = true
          if(element.parametrosorden){
            tempFiltros.estado = true
            tempFiltros.hijos = element.parametroshijos
            tempFiltros.orden = element.parametrosorden
            tempFiltros.limpieza = element.parametroslimpieza
            tempOrden = element.parametrosorden
          }
          element.resultado=captura
        }
      });
      tempFiltros.componentes.forEach((element:Componente) => {
        if(tempOrden.find(t=>t==element.idnwicomponente)){
          element.required = true
        }
      })
      this._filtrosService.asignacion(tempFiltros);
    }
  }

  validarIngreso(idc:any,filtro:Flitro){
    let bool:boolean = false
    let componente = filtro.componentes.find(xc=>xc.idnwicomponente == this.id)
    if(componente){
      if(componente.required){
        bool = true
      }
    }
    return bool;
  }

}