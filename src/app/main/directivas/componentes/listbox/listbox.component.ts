import Swal from 'sweetalert2';
import { AdComponent } from '../../ad.component';
import { HttpClient } from '@angular/common/http';
import { Api } from 'app/auth/models/seguridad/api';
import { Padre } from 'app/auth/models/seguridad/padre';
import { Flitro } from 'app/auth/models/seguridad/filtro';
import { DataList } from 'app/auth/models/seguridad/dataList';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { Componente } from 'app/auth/models/seguridad/componente';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { VerificacionService } from 'app/auth/service';

@Component({
  selector: 'app-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss']
})

export class ListboxComponent implements OnInit,AdComponent {

  data: any;
  padre:Padre;
  id:number = 0
  element:any
  urlProceso: Api;
  vacio = null
  nombre:string = ""
  clases:string = "";
  visible:boolean = false;
  estilosLabel:string = "";
  estilosPrincial:string = "";
  listaElement:DataList[] = []
  estilosComponente:string = "";
  
  constructor(
    private _http: HttpClient,
    private _filtrosService: FiltrosService,
    private _userService: VerificacionService
  ) {
    this._filtrosService.filtros.subscribe(x => {
      if(x){
        if(x.estado){
          let validador = this.validarIngreso(this.id,x)
          if(validador){
            if(x.limpieza.find(limpieza => limpieza===this.id)){
              this.element = null
              if(this.urlProceso.tipo_metodo=="POST"){
                this.listaElement= []
              }
              x.componentes.forEach((element:Componente) => {
                if(element.idnwicomponente === this.id){
                  element.resultado = null
                }
              });
            }
            if(this.padre){
              let tempPadre = x.componentes.find(element=>element.idnwicomponente==this.padre.parametro)
              if(tempPadre){
                if(tempPadre.resultado){
                  let tempPadreResultado:DataList = tempPadre.resultado
                  if(tempPadreResultado){
                    let respuestaPadre:Padre = tempPadreResultado.respuestaHijo
                    if(respuestaPadre.campo === this.padre.campo){
                      this.visible = true
                    }else{
                      this.visible = false
                    }
                  }
                }else{
                  this.visible = false
                }
              }
            }
            if(x.hijos.find(hijo => hijo===this.id)){
              this.element = null
              let componenteList = x.componentes.find(xc=>xc.idnwicomponente == this.id)
              let jsonEnvio = new Object();
              if(componenteList){
                if(componenteList.idnwiparametrodependencias.length>0){
                  componenteList.idnwiparametrodependencias.forEach(element => {
                    let componenteDependiente = x.componentes.find(comp=>comp.idnwicomponente==element)
                    if(componenteDependiente){
                      switch (componenteDependiente.tipodato) {
                        case "date":
                          jsonEnvio[componenteDependiente.tag] = componenteDependiente.resultado
                        break;
                        case "object":
                          if(componenteDependiente.resultado){
                            let respuestaTemp:DataList = componenteDependiente.resultado;
                            jsonEnvio[componenteDependiente.tag] = respuestaTemp.respuestaHijo[componenteDependiente.tag]
                          }
                        break;
                        default:
                          jsonEnvio[componenteDependiente.tag] = componenteDependiente.resultado
                        break;
                      }
                    }
                  })
                  if(Object.entries(jsonEnvio).length === componenteList.idnwiparametrodependencias.length){
                    const user = this._userService.userValue;
                    jsonEnvio["idusuario"] = user.idusuario;
                    //console.log("data "+this.id+" envio al listbox es ",jsonEnvio)
                    this._http.post(this.urlProceso.url,jsonEnvio).subscribe((dataR:DataList[]) => {
                      if(dataR["status"] == "error"){
                        this.listaElement = []
                        Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: dataR["mensaje"]
                        })
                      }else{
                        if(this.id == 153){
                          dataR = [
                            {
                              "id": 565,
                              "descripcion": "000001000166",
                              "respuestaHijo": {
                                "certificacion": "4",
                                "numero_orden_aceite": "000001000167",
                                "tipoproteina": "2",
                                "version": "13",
                                "numero_orden_harina": "000001000166",
                                "recepcion": "10",
                              },
                              "data": {
                                "id": 565,
                                "ordenharina": "000001000166",
                                "certificacion": "N",
                                "idcertificacion": 4,
                                "idtipoproteina": 2,
                                "tipo_proteina": "B",
                                "idversion": 13,
                                "ordenaceite": "000001000167",
                                "cajones": []
                              },
                              "options": {
                                "recepcion": {
                                  "disable": true
                                }
                              }
                            }]
                        }
                        //console.log("dataR listbox ",dataR);
                        this.listaElement = dataR
                      }
                    },error =>{
                      this.listaElement = []
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Consulte con sistema"
                      })
                      return
                    })
                  }else{
                    this.listaElement = []
                  }
                }
              }
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
    this.clases = this.data.data.clases; 
    this.estilosPrincial = this.data.data.estiloPrincipal; 
    this.estilosLabel = this.data.data.estiloLabel; 
    this.estilosComponente = this.data.data.estiloComponente; 
    this.nombre = this.data.data.label; 
    this.visible = this.data.data.visible;
    this.urlProceso = this.data.data.nwiApi;
    this.id = this.data.data.idnwicomponente;
    this.padre = this.data.data.componentesHijos;
    if(this.data.data.idnwiparametrodependencias.length===0){
      this._http.get(this.data.data.nwiApi.url).subscribe((dataR:DataList[] )=> {
        this.listaElement = dataR
      })
    }
  }

  capturar(idc:any){
    let captura = null;
    const user = this._userService.userValue;
    if(this.element){
      captura = this.element
    }
    let tempFiltros = this._filtrosService.filtrosValue
    if(tempFiltros){
      let tempOrden = []
      tempFiltros.componentes.forEach(function(componente:Componente) {
        if(componente.idnwicomponente === idc) {          
          if (user) {
            if(user.planta.codplanta==="PH"){
              if(componente.tag === "recepcion"){
                componente.accion = "limpiarCajon"
              }
            }
          }
          tempFiltros.orden = []
          tempFiltros.hijos = []
          tempFiltros.control = 0
          tempFiltros.fin = false
          tempFiltros.load = true
          tempFiltros.limpieza = []
          tempFiltros.estado = false
          tempFiltros.limpiarNotificacion = true
          if(componente.parametrosorden){
            tempFiltros.estado = true
            tempFiltros.hijos = componente.parametroshijos
            tempFiltros.orden = componente.parametrosorden
            tempFiltros.limpieza = componente.parametroslimpieza
            tempOrden = componente.parametrosorden
          }
          componente.resultado=captura
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