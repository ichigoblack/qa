import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Proceso } from 'app/auth/models/proceso';
import { Componente } from 'app/auth/models/seguridad/componente';
import { Flitro } from 'app/auth/models/seguridad/filtro';
import { VerificacionService } from 'app/auth/service';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { AdItem } from 'app/main/directivas/ad-item';
import { ServicioService } from 'app/main/directivas/servicio.service';
import { environment } from 'environments/environment';
import { buscarTagEnJSON } from '../../../utils/generales';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entradamercancia',
  templateUrl: './entradamercancia.component.html',
  styleUrls: ['./entradamercancia.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class EntradamercanciaComponent implements OnInit {

  titulo:string = ""
  nomenclatura:string = "etm"
  itemsEntrada: AdItem[] = [];
  urlComponentes = environment.apiUrlComponentes 

  tempData = [];
  jsonEnvio:any;
  enviar:number=0;
  jsonDetalle:any;
  tiempo:number = 3000;
  camposCabecera: any[];
  apienviosap:string = ""
  ColumnMode = ColumnMode;
  loading:boolean = false;
  camposCabeceraEmp: any[];
  notificaciones:any[] = [];
  titulo_detalle:string = "";
  cabecera_detalle:any[] = [];
  cabecerasSeleccionadas = [];
  notificacion_detalle:any[] = [];
  allSelectedRows:boolean = false;
  basicSelectedOption: number = 10;
  visibleTableParcial:boolean = false;
  //options = {}

  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(
    private _http: HttpClient,
    private modalService: NgbModal,
    private servicioService: ServicioService,
    private _userService: VerificacionService,
    private _filtrosService: FiltrosService
  ) { 
    this._filtrosService.filtros.subscribe(x => {
      if(x){
        this.limpiarDatosTabla()
        let temp:Componente
        const user = this._userService.userValue;
        if(user.planta.codplanta==="PA"){
          temp = x.componentes.find(componente => componente.tag=="movimientoAtunera" && componente.accion=="final")
          console.log("encontre el final MMA ",temp)
        }
        if(user.planta.codplanta==="PEP"){
          temp = x.componentes.find(componente => componente.tag=="movimientoEmpacadora")
          console.log("encontre movimientoEmpacadora ",temp)
        }
        if(temp){
          if(temp.resultado){
            console.log("resultado es para notificar ",temp.resultado)
            const user = this._userService.userValue;

            let manejar = temp.resultado
            let manejarData = manejar["data"]

            let manejarJson = manejarData["json"]
          
            let manejarDetalle = manejarData["detalle"]
            let manejarCabeceras = manejarData["sizes"]
           
            manejarData["detalle"].forEach((element:any) => {
              element["estadoEnvio"] = false;
              if(element["habilitar_envio"] === 0){
                element["estadoEnvio"] = true;
              }
            });
            let manejarEnvio = manejarData["habilitar_envio"]
            
            this.jsonEnvio = manejarJson
            this.jsonDetalle = manejarDetalle
            this.enviar = manejarEnvio
            this.camposCabecera =  Object.keys(this.jsonDetalle[0]);
            
            const filteredLibraries = this.camposCabecera.filter((item) => item !== 'habilitar_envio')
            const filteredLibraries2 = filteredLibraries.filter((item) => item !== 'estadoEnvio')
            const filteredLibraries3 = filteredLibraries2.filter((item) => item !== 'POSICION')
            const filteredLibraries4 = filteredLibraries3.filter((item) => item !== 'width')
            const filteredLibraries5 = filteredLibraries4.filter((item) => item !== 'VALIDAR')
            this.camposCabecera = filteredLibraries4;
            
            this.camposCabeceraEmp = manejarCabeceras;

            console.log("camposca size ",this.camposCabecera.length)
            console.log("camposcaem size ",this.camposCabeceraEmp)

            this.notificaciones = this.jsonDetalle
            this.tempData = this.jsonDetalle
            
            console.log("temp notificaciones ",this.notificaciones)
            
            if(user.planta.codplanta=="PA" || user.planta.codplanta=="PEP"){
              this.visibleTableParcial = true
            }
          }else{
            this.visibleTableParcial = false
            this.jsonEnvio = []
            this.jsonDetalle = []
            this.enviar = 0
            this.camposCabecera =  [];
            this.notificaciones = []
          }
        }
      }
    })
  }

  options = {
    rowClickEvent: true,
    rowPerPageMenu: [10, 15, 20, 30],
    rowPerPage : 10
  }

  ngOnInit(): void {
    let carga = this._filtrosService.filtrosValue
    if(carga){
      if(carga.load){
        this._filtrosService.asignacion(null)
        location.reload()
      }
    }
    const user = this._userService.userValue;
    if (user) {
      let tempProceso = user.procesos.find((tp:Proceso) => tp.codproceso == this.nomenclatura);
      if(tempProceso){
        this.titulo = tempProceso.titulo
      }
      let url = this.urlComponentes+"/listarComponentes/"+user.planta.codplanta+"/"+this.nomenclatura
      this._http.get(url).subscribe(data => {
        console.log("datadata ",data)
        if(data["estado"]=="ok"){
          this.itemsEntrada = this.servicioService.getAds(data["data"]);
          let filtroTemp:Flitro = {
            estado : false,
            componentes : data["data"],
            hijos: [],
            limpieza:[]
          }
          this._filtrosService.asignacion(filtroTemp)
          return
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data["mensaje"]
        })
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un problema con el servidor consulte a sistemas'
        })
      })
      switch (user.planta.codplanta) {
        case "PA":
          let urlSap2 = this.urlComponentes+"/obtenerApiMovimientoMercanciaAtunera"
          this._http.get(urlSap2).subscribe(data => {
            if(data["estado"]=="ok"){
              let apitemp = data["data"]
              this.apienviosap = apitemp["url"]
              console.log("apifinal = "+this.apienviosap)
            }
          })
          break  
        case "PEP":
          let urlSap1 = this.urlComponentes+"/obtenerApiMovimientoMercanciaEmpacadora"
          this._http.get(urlSap1).subscribe(data => {
            if(data["estado"]=="ok"){
              let apitemp = data["data"]
              this.apienviosap = apitemp["url"]
              console.log("apifinal = "+this.apienviosap)
            }
          }) 
          break;  
        case "PEN":
          let urlSap3 = this.urlComponentes+"/obtenerApiMovimientoMercanciaEmpacadora"
          this._http.get(urlSap3).subscribe(data => {
            if(data["estado"]=="ok"){
              let apitemp = data["data"]
              this.apienviosap = apitemp["url"]
              console.log("apifinal = "+this.apienviosap)
            }
          })
          break    
        default:
          break;
      }
    }
  }

  filterUpdate(event:any){
    let val = event.target.value.toLowerCase();
    let colsAmt = this.camposCabecera.length;
    // get the key names of each column in the dataset
    let keys = this.camposCabecera;
    // assign filtered matches to the active datatable
    this.notificaciones = this.tempData.filter(function(item){
      // iterate through each row's column data
      for (let i=0; i<colsAmt; i++){
        // check for a match
        if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val){
          // found match, return true to add to result set
          return true;
        }
      }
    });
    this.table.offset = 0;
  }

  modalOpenLGParcial(modalLG:any,titulo:any,data:any) {
    console.log("modal a ",titulo)
    console.log("modal b ",data)
    this.titulo_detalle = titulo.name
    if(data){
      this.notificacion_detalle = data
      this.cabecera_detalle = Object.keys(data[0])
    }
    console.log("modal c ",this.cabecera_detalle )
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }

  notificar() {
    console.log("inicio cabeceras selecconadas",this.cabecerasSeleccionadas)
    console.log("json completo ",this.jsonEnvio)

    let jsonTratarEnvio = JSON.parse(JSON.stringify(this.jsonEnvio))

    let jsonEnvioFinal:any
    
    const user = this._userService.userValue;
    let envioFinal:Boolean = false

    switch (user.planta.codplanta) {
      case "PA":
        console.log("el json necesario para enviar en atunera",jsonTratarEnvio.json.DETALLE)
        console.log("el json necesario para enviar en atunera 111 ",this.cabecerasSeleccionadas)
        let jsonData2:any[] = jsonTratarEnvio.json.DETALLE
        let jsontemp2:any[] = new Array();
        if(this.cabecerasSeleccionadas.length>0){
          this.cabecerasSeleccionadas.forEach((element:any,index) => {
            console.log("index ",jsonData2[element.POSICION-1])
            jsontemp2.push(jsonData2[element.POSICION-1])
          });
          jsonTratarEnvio.json.DETALLE = jsontemp2
          jsonEnvioFinal = jsonTratarEnvio
          envioFinal = true;
        }
        break;
      case "PEP":
        let jsonData3:any[] = jsonTratarEnvio.data[0].json.DETALLE
        let jsontemp3:any[] = new Array();
        if(this.cabecerasSeleccionadas.length>0){
          this.cabecerasSeleccionadas.forEach((element:any,index) => {
            console.log("index ",jsonData3[element.POSICION-1])
            jsontemp3.push(jsonData3[element.POSICION-1])
          });
          jsonTratarEnvio.data[0].json.DETALLE = jsontemp3
          jsonEnvioFinal = jsonTratarEnvio
          envioFinal = true;
        }
        break;
      case "PEN":
        let jsonData4:any[] = jsonTratarEnvio.data[0].json.DETALLE
        let jsontemp4:any[] = new Array();
        if(this.cabecerasSeleccionadas.length>0){
          this.cabecerasSeleccionadas.forEach((element:any,index) => {
            console.log("index ",jsonData4[element.POSICION-1])
            jsontemp4.push(jsonData4[element.POSICION-1])
          });
          jsonTratarEnvio.data[0].json.DETALLE = jsontemp4
          jsonEnvioFinal = jsonTratarEnvio
          envioFinal = true;
        }
        break
      default:
        break;
    }
    console.log("el jsonEnvioFinal a enviar es ",jsonEnvioFinal)
    if(!envioFinal){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:"No ha seleccionado datos de envío"
      })
      return;
    }

    let valEnvio = false;
    if(user.planta.codplanta=="PA"||user.planta.codplanta=="PEP"||user.planta.codplanta=="PEN"){
      valEnvio = true;
    }else{
      if(this.enviar==1){
        valEnvio = true;
      }
    }
    this.loading = true
    if(valEnvio){
      this._http.post(this.apienviosap,jsonEnvioFinal).subscribe(data => {
        console.log("data recibida de la respuesta",data)
        let estado:any = buscarTagEnJSON(data,"estado");
        switch (estado) {
          case "ok":
            this.enviar = 0;
            Swal.fire({
              icon: 'success',
              title: 'Exito',
              text:  buscarTagEnJSON(data,"mensaje")
            })
            //validar aqui las rows q envie 
            this.notificaciones.forEach(element => {
              if(element.habilitar_envio===0){
                element.estadoEnvio = true
              }
            });
            console.log("this.notificaciones prueba ",this.notificaciones)
            this.cabecerasSeleccionadas = []
            this.table.offset = 0;
            ///fin de e esto
            setTimeout(() => {
              this.loading = false
            }, this.tiempo);  
            break;
          case "error":
            //console.log("error 1 ",dataRecibida)
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: buscarTagEnJSON(data,"mensaje")
            })
            setTimeout(() => {
              this.loading = false
            }, this.tiempo);   
            break;  
          default:
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrio un problema con el servidor consulte a sistemas'
            })
            break;
        }
      },
      error => {
        console.log("error notifcacion 2",error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un problema con el servidor consulte a sistemas'
        })
      })
      setTimeout(() => {
        this.loading = false
      }, this.tiempo);
    }else{
      console.log(" no ingreso al jsonenvio",jsonTratarEnvio)
      Swal.fire({
        icon: 'error',
        title: 'Error Envio',
        text: 'Ocurrio un problema con el servidor consulte a sistemas'
      })
      setTimeout(() => {
        this.loading = false
      }, this.tiempo);
    }
    console.log("fin de final ")
  }

  limpiarMMA(){
    let carga = this._filtrosService.filtrosValue
    let limpTemp = []
    if(carga){
      carga.componentes.forEach((element:Componente) => {
        if(element.tag == "movimientoAtunera"){
          element.resultado=null
          element.accion = null;
         // limpTemp.push(element.idnwicomponente)
        }
        //element.required=true
      });
      carga.estado = true
      carga.control = 0
      carga.fin = true
      carga.hijos = []
      carga.orden = limpTemp
      carga.limpieza = limpTemp
      carga.load = true
      this._filtrosService.asignacion(carga);
    }
  }

  limpiar() {
    let carga = this._filtrosService.filtrosValue
    let limpTemp = []
    if(carga){
      carga.componentes.forEach((element:Componente) => {
        element.resultado=null
        if(element.tag == "movimientoAtunera"){
          element.accion = null;
        }
        element.required=true
        limpTemp.push(element.idnwicomponente)
      });
      carga.estado = true
      carga.control = 0
      carga.fin = true
      carga.hijos = []
      carga.orden = limpTemp
      carga.limpieza = limpTemp
      carga.load = true
      this.visibleTableParcial = false
      this.notificaciones = []
      this.cabecera_detalle = []
      this._filtrosService.asignacion(carga);
    }
  }

  onCheckboxChangeAllRow(event:any,notificacionesRece:any[]) {
    let cabTemp:any[] = []
    notificacionesRece.forEach((element:any) => {
      if(element["estadoEnvio"] === false){
        element["habilitar_envio"] = event.target.checked ? 0:1
        if(event.target.checked){
          cabTemp.push(element)
        }
      }
    });
    this.cabecerasSeleccionadas = cabTemp
  }

  checkedRow(row:any) {
    if(row.habilitar_envio==0){
      return true
    }
    return false;
  }

  disabledRow(row:any) {
    if(row.habilitar_envio === 0 && row.estadoEnvio){
      return true
    }
    return false
  }

  onCheckboxChangeRow(event:any,row:any) {
    if(event.target.checked){
      this.cabecerasSeleccionadas.push(row)
    }else{
      this.cabecerasSeleccionadas = this.cabecerasSeleccionadas.filter(x=>x.POSICION !== row.POSICION)
    }
    this.notificaciones.forEach((element:any) => {
      if(element.POSICION == row.POSICION){
        //console.log("control de rows encontre")
        element["habilitar_envio"] = 0
        if(event.target.checked){
          element["habilitar_envio"] = 1
        }
      }
    });
    //console.log("control de rows a",row)
    //console.log("control de rows b",this.notificaciones)

    let control = true
    this.notificaciones.forEach((element:any,index) => {
      if(element["habilitar_envio"]===1){
        control = false
      }
    });
    //console.log("control de rows ",control)
    this.allSelectedRows = control
  }

  isArray(dato: any) {
    return Array.isArray(dato);
  }

  nameColumna(row: any,col: any) {
    let dato: any;
    this.camposCabecera.forEach((element) => {
      if (element == col) {
        dato = row[element]
      }
    });
    return dato;
  }

  dataDetalle(col:any,data:any){
    return data[col]
  }

  limpiarDatosTabla(){
    this.visibleTableParcial = false
    this.jsonEnvio = []
    this.jsonDetalle = []
    this.enviar = 0
    this.camposCabecera =  [];
    this.notificaciones = []
  }

}