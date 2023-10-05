import Swal from 'sweetalert2';
import { AdComponent } from '../../ad.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from 'app/auth/models/seguridad/api';
import { Padre } from 'app/auth/models/seguridad/padre';
import { DataList } from 'app/auth/models/seguridad/dataList';
import { Componente } from 'app/auth/models/seguridad/componente';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { Flitro } from 'app/auth/models/seguridad/filtro';
import { VerificacionService } from 'app/auth/service/verificacion.service';
import { buscarTagEnJSON } from '../../../../utils/generales'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit,AdComponent {

  data: any;
  padre:Padre;
  id: number = 0
  urlProceso: Api
  tag: string = ""
  iddepenencia:any[]
  accion: string = ""
  nombre: string = ""
  clases:string = "";
  loading:boolean = false;
  visible:boolean = false;
  estilosLabel:string = "";
  estilosPrincial:string = "";
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
            this.avanzar(x)
          }
        }
      }
    })
  }

  ngOnInit(): void {
    this.tag = this.data.data.tag;
    this.nombre = this.data.data.label;
    this.clases = this.data.data.clases; 
    this.accion = this.data.data.accion;
    this.visible = this.data.data.visible;
    this.urlProceso = this.data.data.nwiApi;
    this.id = this.data.data.idnwicomponente;
    this.padre = this.data.data.componentesHijos;
    this.estilosLabel = this.data.data.estiloLabel; 
    this.estilosPrincial = this.data.data.estiloPrincipal; 
    this.estilosComponente = this.data.data.estiloComponente; 
    this.iddepenencia = this.data.data.idnwiparametrodependencias;
  }

  proceso(idb:any){
    const user2 = this._userService.userValue;
    let tempFiltros = this._filtrosService.filtrosValue;
    let jsonEnvio = new Object();
    let contadorResultados = 0;
    if(this.id === idb){
      //console.log("camposdependienctes ",this.iddepenencia)
      if(this.iddepenencia.length>0){
        for (let index = 0; index < this.iddepenencia.length; index++) {
          const sub = this.iddepenencia[index];
          let subTemp = tempFiltros.componentes.find(x => x.idnwicomponente === sub);
          //console.log("campo dependiente ",subTemp)
          if(subTemp.resultado){
            //console.log("tiene result a")
            contadorResultados = contadorResultados + 1;
            switch (subTemp.tipodato) {
              case "object":
                jsonEnvio[subTemp.tag] = subTemp.resultado.data
                break;
              case "number":
                let num = Number(subTemp.resultado).toFixed(2)
                let numTemp = Number(num)
                jsonEnvio[subTemp.tag] = numTemp
                break;
              default:
                jsonEnvio[subTemp.tag] = subTemp.resultado
                break;
            };
          }else if(!subTemp.optional){
            Swal.fire({
              icon: 'error',
              title: 'Campo Pendiente',
              text: 'Falta '+subTemp.label
            })
            return
          }else{
            console.log("tiene result b")
            contadorResultados = contadorResultados +1;
          }
        }
      }
    }
    console.log("json envio para prueba",jsonEnvio)
    //console.log("contador a ",contadorResultados)
    //console.log("contador b",this.iddepenencia.length)
    if(contadorResultados == this.iddepenencia.length){
      this.loading = true
      switch (this.urlProceso.tipo_metodo) {
        case "GET":
          if(user2.planta.codplanta==="PH"){
            if(this.tag==="cajones"){
              let itp = 0;
              let rtp = "";
              let oje = Object.keys(jsonEnvio)
              let rje = oje[0]
              let nje = oje[1]
              rtp = jsonEnvio[rje].nomenclatura
              itp = jsonEnvio[nje].id_tipo_proteina
              let camposCajon = {
                "tipo":rtp,
                "id_tipo_proteina":Number(itp),
                "modal":"modalCajon"
              }
              this.limpiarComponentes(this.id,camposCajon)
              this.loading = false
              return 
            }
          }
          break;
        case "POST":
          if(this.accion){
            jsonEnvio["accion"]=this.accion
          }
          const user = this._userService.userValue;
          if(user.planta.codplanta==="PEP"||user.planta.codplanta==="PEN"||user.planta.codplanta==="PA"){
            jsonEnvio["usuario"] = user.idusuario
          }
          console.log("json envio v3",jsonEnvio)
          this._http.post(this.urlProceso.url,jsonEnvio).subscribe(dataR => {
            console.log("json recibido por consulta",dataR)
            let estado:any = buscarTagEnJSON(dataR,"estado");
            console.log("estado ",estado)
            switch (estado) {
              case "ok":
                Swal.fire({
                  icon: 'success',
                  title: 'Exito',
                  text: buscarTagEnJSON(dataR,"mensaje")  
                })
                this.limpiarComponentes(this.id,dataR)
                this.loading = false
                break;
              case "error":
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: buscarTagEnJSON(dataR,"mensaje")  
                })
                this.limpiarComponentes(this.id,null)
                this.loading = false    
                break;
              default:
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Ocurrio un problema,Consulte con sistema'
                })
                this.limpiarComponentes(this.id,null)
                this.loading = false
                break;
            }
          },error=> {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrio un problema,Consulte con sistema'
            })
            this.limpiarComponentes(this.id,null)
            this.loading = false
          })
          break;
        default:
          break;
      }
    }
  }

  limpiarComponentes(idc:any,respuesta:any){
    let filtro = this._filtrosService.filtrosValue
    if(filtro){
      let compButton:Componente = filtro.componentes.find(fc=>fc.idnwicomponente===idc)
      if(compButton){
        filtro.componentes.forEach((element:Componente) => {
          if(element.tag=="cajones" || element.tag=="movimientoAtunera" 
            || element.tag=="notificar" || element.tag==="recepcion"){
            element.accion = null;
          }
          if(element.idnwicomponente === idc && element.tag=="cajones"){
            if(respuesta) {
              element.resultado = respuesta
              element.accion = "final"
            }
          }
          if(element.idnwicomponente === idc && element.tag=="movimientoAtunera"){
            if(respuesta) {
              element.resultado = respuesta
              const user = this._userService.userValue;
              if(user.planta.codplanta==="PA"){
                element.accion = "final";
                console.log("final ",idc)
              }
            }
          }
          if(element.idnwicomponente === idc && element.tag=="movimientoEmpacadora"){
            if(respuesta) {
              element.resultado = respuesta
              /*const user = this._userService.userValue;
              if(user.planta.codplanta==="PA"){
                element.accion = "final";
                console.log("final ",idc)
              }*/
            }
          }
          if(element.idnwicomponente === idc && element.tag=="notificar"){
            if(respuesta) {
              element.resultado = respuesta
              const user = this._userService.userValue;
              if(user.planta.codplanta==="PEP"||user.planta.codplanta==="PEN"||user.planta.codplanta==="PA"){
                element.accion = "final";
                console.log("final ntfa",idc)
              }
            }
          }
          if(compButton.parametroslimpieza.find(cb=>cb===element.idnwicomponente)){
            element.resultado=null
            element.required = true
            const user = this._userService.userValue;
            if(user.planta.codplanta==="PH" && element.tag==="recepcion"){
              element.accion = "limpiarCajon";
            }
          }
        });
        filtro.estado = true
        filtro.control = 0
        filtro.fin = true
        filtro.hijos = []
        filtro.limpiarNotificacion = false
        filtro.orden = compButton.parametrosorden
        filtro.limpieza = compButton.parametroslimpieza
        filtro.load = true
      }
      this._filtrosService.asignacion(filtro);
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