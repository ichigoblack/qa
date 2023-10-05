import Swal from 'sweetalert2';
import { AdComponent } from '../../ad.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Api } from 'app/auth/models/seguridad/api';
import { Padre } from 'app/auth/models/seguridad/padre';
import { Flitro } from 'app/auth/models/seguridad/filtro';
import { DataList } from 'app/auth/models/seguridad/dataList';
import { Componente } from 'app/auth/models/seguridad/componente';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { VerificacionService } from 'app/auth/service';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent implements OnInit,AdComponent {
  
  data: any;
  valor:any;
  padre:Padre;
  id:number = 0;
  tag:string = "";
  urlProceso: Api;
  tipo:string = "";
  ancho:number = 0;
  clases:string = "";
  holder:string = "";
  nombre: string = "";
  estado:boolean = true;
  visible:boolean = false;
  estilosLabel:string = "";
  nomenclatura: string = "";
  estilosPrincial:string = "";
  estilosComponente:string = "";

  constructor(
    private _http: HttpClient,
    private _filtrosService: FiltrosService,
    private _userService: VerificacionService
  ) { 
    this._filtrosService.filtros.subscribe(x => {
      if(x){
        const user = this._userService.userValue;
        if(user.planta.codplanta==="PH"){
          x.componentes.forEach((element:Componente) => {
            if(element.idnwicomponente === this.id){
              this.valor = element.resultado
            }
          });
        }

        if(x.estado){
          console.log("entro text ",this.id);
          let validador = this.validarIngreso(this.id,x)
          let valorTemp = null
          
          if(validador){

            /**
             * 
                          case "button":
                            valorTemporal = componenteDependiente.resultado[this.tag]
                            break;
             */

            if(x.limpieza.find(limpieza => limpieza===this.id)){
              this.valor = valorTemp
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
                  //console.log("tag ",this.tag," ",tempDependencia)
                  if(this.urlProceso.idnwiapi===0){
                    let valorConseguido:any
                    if(this.tipo==="number"){
                      valorConseguido = 0
                    }
                    if(this.tipo==="text"){
                      valorConseguido = ""
                    }
                    //console.log("tag a",this.tag," tam",componenteList.idnwiparametrodependencias.length)
                    componenteList.idnwiparametrodependencias.forEach(element => {
                      let valorTemporal:any
                      let componenteDependiente = x.componentes.find(comp=>comp.idnwicomponente==element)
                      if(componenteDependiente){
                        //console.log("ver que voy a hacer v1 ",componenteDependiente)
                        switch (componenteDependiente.tipodato) {
                          case "object":
                            let datTemp:DataList = componenteDependiente.resultado
                            if(componenteDependiente.resultado){
                              let tapTemp = componenteList.tag
                              let campoResult = datTemp.respuestaHijo[tapTemp]
                              if(campoResult){
                                if(componenteList.tipodato==="number"){
                                  try {
                                    campoResult = Number(campoResult)
                                  } catch (error) {
                                    campoResult = 0
                                  }
                                }
                              }
                              valorTemporal = campoResult
                            }else{
                              //valorTemp = null
                              if(componenteList.tipodato==="number"){
                                valorTemporal = 0
                              }
                              if(componenteList.tipodato==="text"){
                                valorTemporal = ""
                              }
                            }
                            break;
                          case "array":
                            if(this.padre){
                              //console.log("ver que voy a hacer v2 ",componenteDependiente.resultado)
                              let valorCal:number = 0;
                              switch (this.padre.accion) {
                                case "sumar":
                                  if(componenteDependiente.resultado){
                                    componenteDependiente.resultado.forEach((element:any) => {
                                      let vaar:number = 0
                                      try {
                                        vaar = Number(element.respuestaHijo[this.tag])
                                      } catch (error) {
                                        vaar = 0
                                      }
                                      valorCal = valorCal + vaar
                                    });
                                  }else{
                                    valorCal = 0
                                  }
                                  break;
                                default:
                                  //this.valor = valorCal
                                  //valorTemp = valorCal
                                  valorTemporal = valorCal
                                  break;
                              }  
                              //this.valor = valorCal
                              //valorTemp = valorCal
                              valorTemporal = valorCal
                            }
                            break;
                          case "date":
                            //this.valor = componenteDependiente.resultado
                            //valorTemp = componenteDependiente.resultado
                            valorTemporal = componenteDependiente.resultado
                            break;                          
                          default:
                            //this.valor = null
                            //valorTemp = null
                            valorTemporal = null
                            break;
                        }
                      }
                      //if(this.tipo==="number"){
                      valorConseguido = valorConseguido + valorTemporal
                      //}
                      //if(this.tipo==="text"){
                        //valorConseguido 
                      //}
                    })
                    console.log("valor cos ",valorConseguido)
                    
                    this.valor = valorConseguido
                    x.componentes.forEach((element:Componente) => {
                      if(element.idnwicomponente === this.id){
                        element.resultado = valorConseguido
                      }
                    })
                    //let tempDependencia = x.componentes.find(element=>element.idnwicomponente===componenteList.idnwiparametrodependencias[0])
                    //console.log("tag ",this.tag," ",tempDependencia)
                    
                    
                    /*
                    ;*/
                  }else{
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
                    console.log("entro a la verificacion api b",jsonEnvio)
                    if(Object.entries(jsonEnvio).length === componenteList.idnwiparametrodependencias.length){
                      this._http.post(this.urlProceso.url,jsonEnvio).subscribe((dataR:any) => {
                        if(dataR["estado"] == "error"){
                          this.estado = true

                          this.valor = ""
                        }else{
                          this.estado = false
                          this.valor = dataR["data"]
                          let tempFiltros = this._filtrosService.filtrosValue;
                          tempFiltros.componentes.forEach(function(componente:Componente) {
                            if(componente.idnwicomponente == componenteList.idnwicomponente) {
                              tempFiltros.orden = []
                              tempFiltros.hijos = []
                              tempFiltros.control = 0
                              tempFiltros.fin = false
                              tempFiltros.load = false
                              tempFiltros.limpieza = []
                              tempFiltros.estado = false
                              tempFiltros.limpiarNotificacion = true
                              if(componente.parametrosorden){
                                tempFiltros.estado = true
                                tempFiltros.hijos = componente.parametroshijos
                                tempFiltros.orden = componente.parametrosorden
                                tempFiltros.limpieza = componente.parametroslimpieza
                              }
                              componente.resultado=dataR["data"]
                            }
                          });
                          this._filtrosService.asignacion(tempFiltros);
                        }
                      },error =>{
                        this.estado = true
                        this.valor = ""
                        Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: "Consulte con sistema"
                        })
                        return
                      })
                    }else{
                      this.estado = true
                      this.valor = ""
                    }
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
    this.tag = this.data.data.tag; 
    this.ancho = this.data.data.ancho; 
    this.nombre = this.data.data.label; 
    this.tipo = this.data.data.tipodato;
    this.clases = this.data.data.clases; 
    this.estado = this.data.data.disabled; 
    this.visible = this.data.data.visible;
    this.urlProceso = this.data.data.nwiApi;
    this.id = this.data.data.idnwicomponente;
    this.holder = this.data.data.defaultValue;
    this.padre = this.data.data.componentesHijos;
    this.estilosLabel = this.data.data.estiloLabel; 
    this.nomenclatura = this.data.data.nomenclatura;
    this.estilosPrincial = this.data.data.estiloPrincipal; 
    this.estilosComponente = this.data.data.estiloComponente;
  }

  capturar(idt:any,e:any){
    let captura = null;
    if(e.target.value){
      captura = e.target.value
    }
    let tempFiltros = this._filtrosService.filtrosValue;
    if(tempFiltros){
      tempFiltros.componentes.forEach(function(componente:Componente) {
        if(componente.idnwicomponente == idt) {
          tempFiltros.orden = []
          tempFiltros.hijos = []
          tempFiltros.control = 0
          tempFiltros.fin = false
          tempFiltros.load = false
          tempFiltros.limpieza = []
          tempFiltros.estado = false
          tempFiltros.limpiarNotificacion = true
          if(componente.parametrosorden){
            tempFiltros.estado = true
            tempFiltros.hijos = componente.parametroshijos
            tempFiltros.orden = componente.parametrosorden
            tempFiltros.limpieza = componente.parametroslimpieza
          }
          componente.resultado=captura
        }
      });
      this._filtrosService.asignacion(tempFiltros);
    }
  }

  validarIngreso(idc:any,filtro:Flitro){
    let bool:boolean = false
    let componente = filtro.componentes.find(xc=>xc.idnwicomponente === idc)
    if(componente){
      if(componente.required){
        bool = true
      }
    }
    return bool;
  }

}