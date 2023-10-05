import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Api } from 'app/auth/models/seguridad/api';
import { Padre } from 'app/auth/models/seguridad/padre';
import { DataList } from 'app/auth/models/seguridad/dataList';
import { Componente } from 'app/auth/models/seguridad/componente';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { Flitro } from 'app/auth/models/seguridad/filtro';

@Component({
  selector: 'app-multilistbox',
  templateUrl: './multilistbox.component.html',
  styleUrls: ['./multilistbox.component.scss']
})

export class MultilistboxComponent implements OnInit {

  data: any;
  padre:Padre;
  id:number = 0
  urlProceso: Api;
  nombre:string = ""
  clases:string = "";
  visible:boolean = false;
  estilosLabel:string = "";
  selectMultiSelected = [];
  estilosPrincial:string = "";
  listaElement:DataList[] = []
  estilosComponente:string = "";
  
  constructor(
    private _http: HttpClient,
    private _filtrosService: FiltrosService
  ) { 
    this._filtrosService.filtros.subscribe(x => {
      if(x){
        if(x.estado){
          console.log("entro multi ",this.id);
          let validador = this.validarIngreso(this.id,x)
          if(validador){
            if(x.limpieza.find(limpieza => limpieza===this.id)){
              this.selectMultiSelected = []
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
              let componenteList = x.componentes.find(xc=>xc.idnwicomponente == this.id)
              let jsonEnvio = new Object();     
              if(componenteList){
                if(componenteList.idnwiparametrodependencias.length>0){
                  componenteList.idnwiparametrodependencias.forEach(element => {
                    let  resultTemp = x.componentes.find(comp=>comp.idnwicomponente==element)
                    if(resultTemp){
                      switch (resultTemp.tipodato) {
                        case "date":
                          if(resultTemp.resultado){
                            jsonEnvio[resultTemp.tag] = resultTemp.resultado
                          }
                        break;
                        case "array":
                          if(resultTemp.resultado){
                            let respuestaTemp:DataList = resultTemp.resultado;
                            jsonEnvio[resultTemp.tag] = respuestaTemp.respuestaHijo[resultTemp.tag]
                          }
                        break;
                      default:
                        jsonEnvio[resultTemp.tag] = resultTemp.resultado
                        break;
                      }
                    }
                  });  
                  if(Object.entries(jsonEnvio).length === componenteList.idnwiparametrodependencias.length){
                    this._http.post(this.urlProceso.url,jsonEnvio).subscribe((dataR:DataList[]) => {
                      if(dataR["status"] == "error"){
                        Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: dataR["mensaje"]
                        })
                        this.listaElement = []
                        return
                      }
                      this.listaElement = dataR
                    },error =>{
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Consulte con sistema"
                      })
                      this.listaElement = []
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
        return
      }
    })
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

  capturar(idc:any,e:any){
    let captura = null;
    //if(e.target.value){
    captura = this.selectMultiSelected
    console.log("captura multi ",captura)
    //}
    let tempFiltros = this._filtrosService.filtrosValue
    if(tempFiltros){
      let tempOrden = []
      tempFiltros.componentes.forEach(function(componente:Componente) {
        if(componente.idnwicomponente == idc) {
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