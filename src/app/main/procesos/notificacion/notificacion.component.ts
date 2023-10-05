import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { AdItem } from 'app/main/directivas/ad-item';
import { environment } from 'environments/environment';
import { VerificacionService } from 'app/auth/service';
import { Encabezado } from 'app/auth/models/seguridad/encabezado';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ServicioService } from 'app/main/directivas/servicio.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Proceso } from 'app/auth/models/proceso';
import { Flitro } from 'app/auth/models/seguridad/filtro';
import { Componente } from 'app/auth/models/seguridad/componente';
import { buscarTagEnJSON } from '../../../utils/generales';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificacionComponent implements OnInit {

  buscar:any;
  titulo:string = "";
  validarEnvioEmpacadora:any;
  camposCabecera: any[];
  camposCabeceraSizes: any[];
  cabeceras: Encabezado[];
  ColumnMode = ColumnMode;
  notificaciones:any[] = [];
  titulo_detalle:string = "";
  nomenclatura:string = "ntf";
  cabecera_detalle:any[] = [];
  cabecerasSeleccionadas = [];
  SelectionType = SelectionType;
  notificacion_detalle:any[] = [];
  allSelectedRows:boolean = false;
  itemsNotificacion: AdItem[] = [];
  visibleTable:boolean = false;
  visibleTableParcial:boolean = false;
  estadoSelectedOption: number = -1;
  urlComponentes = environment.apiUrlComponentes 
  apienviosap:string = ""
  jsonEnvio:any;
  jsonDetalle:any;
  enviar:number=0;
  basicSelectedOption: number = 10;
  loading:boolean = false;
  tiempo:number = 3000;
  private tempData = [];
  tipoEnvioAtunera:boolean = false

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private _http: HttpClient,
    private modalService: NgbModal,
    private _filtrosService: FiltrosService,
    private servicioService: ServicioService,
    private _userService: VerificacionService
  ) { 
    this._filtrosService.filtros.subscribe(x => {
      if(x){
        this.limpiarDatosTabla()
        let temp:Componente
        const user = this._userService.userValue;
        this.tipoEnvioAtunera = false
        //console.log("resultado es para notificar a0 "+user.planta.codplanta+" ss")
        switch (user.planta.codplanta) {
          case "PA":
            temp = x.componentes.find(componente => componente.tag=="notificar" && componente.accion=="final")  
            console.log("resultado es para notificar a1",temp)
            break;
          case "PEP":
            temp = x.componentes.find(componente => componente.tag=="notificar" && componente.accion=="final")  
            break;  
          case "PEN":
            temp = x.componentes.find(componente => componente.tag=="notificar" && componente.accion=="final")  
            console.log("resultado es para notificar a3",temp)
          break;
          default:
            temp = x.componentes.find(componente => componente.tag=="notificar")
            console.log("resultado es para notificar a4",temp)
            break;
        }
        if(temp){
          console.log("resultado es para notificar a3",temp.resultado)
          if(temp.resultado){
            const user = this._userService.userValue;
            let manejar = temp.resultado
            let manejarData = manejar["data"]
            this.validarEnvioEmpacadora = manejarData["validar_enviar"]
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

            this.camposCabeceraSizes = manejarCabeceras;

            console.log("camposca size ",this.camposCabecera.length)
            console.log("camposcaem size ",this.camposCabeceraSizes)

            this.notificaciones = this.jsonDetalle
            this.tempData = this.jsonDetalle
            //console.log("dato corroborar salida notificaciones ",JSON.parse(JSON.stringify(this.notificaciones)))
            //console.log("temp notificaciones ",this.notificaciones)
            
            switch (user.planta.codplanta) {
              case "PA":
                switch (temp.nomenclatura) {
                  case "RHC":
                    this.visibleTable = true
                    this.visibleTableParcial = false
                    this.tipoEnvioAtunera = true
                    break;
                  default:
                    this.visibleTableParcial = true
                    this.estadoSelectedOption = 1
                    this.changeEstado()
                    this.visibleTable = false
                    this.visibleTableParcial = true
                    this.tipoEnvioAtunera = false
                    break;
                }   
                break;
              case "PEN":
                this.visibleTableParcial = true
                this.estadoSelectedOption = 1
                this.changeEstado()
                this.visibleTable = false
                this.visibleTableParcial = true
                break;
               case "PEP":
                console.log("datos de la tabla PEP ",this.notificaciones)
                this.visibleTableParcial = true
                this.estadoSelectedOption = 1
                this.changeEstado()
                //console.log("datos de la tabla PEP ",this.notificaciones)
                this.visibleTable = false
                this.visibleTableParcial = true
                break;          
              default:
                this.visibleTable = true
                this.visibleTableParcial = false
                break;
            }
          }else{
            this.visibleTable = false
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
      //console.log("url comp harina ",url)
      this._http.get(url).subscribe(data => {
        if(data["estado"]=="ok"){
          //console.log("json recibido ",data)
          this.itemsNotificacion = this.servicioService.getAds(data["data"]);
          let filtroTemp:Flitro = {
            estado : false,
            fin : false,
            hijos: [],
            limpieza:[],        
            orden:[],
            control:0,
            componentes:data["data"],
            load:false,
            limpiarNotificacion:false
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
        case "PEP":
          let urlSap1 = this.urlComponentes+"/obtenerApiNotificacionEmpacadora"
          this._http.get(urlSap1).subscribe(data => {
            if(data["estado"]=="ok"){
              let apitemp = data["data"]
              this.apienviosap = apitemp["url"]
              //console.log("apifinal = "+this.apienviosap)
            }
          })
          break;
        case "PEN":
          let urlSap2 = this.urlComponentes+"/obtenerApiNotificacionEmpacadora"
          this._http.get(urlSap2).subscribe(data => {
            if(data["estado"]=="ok"){
              let apitemp = data["data"]
              this.apienviosap = apitemp["url"]
              //console.log("apifinal = "+this.apienviosap)
            }
          })
          break;
        case "PA":
          let urlSap4 = this.urlComponentes+"/obtenerApiNotificacionAtunera"
          this._http.get(urlSap4).subscribe(data => {
            if(data["estado"]=="ok"){
              let apitemp = data["data"]
              this.apienviosap = apitemp["url"]
              //console.log("apifinal = "+this.apienviosap)
            }
          })
          break    
        default:
          let urlSap3 = this.urlComponentes+"/obtenerApiNotificacion"
          this._http.get(urlSap3).subscribe(data => {
            if(data["estado"]=="ok"){
              let apitemp = data["data"]
              this.apienviosap = apitemp["url"]+"/"+user.planta.codplanta
              //console.log("apifinal = "+this.apienviosap)
            }
          })
          break;
      }
      //console.log("apifinal = "+this.apienviosap)
    }
  }
  
  changeEstado(){
    let temp:any = [];
    temp = JSON.parse(JSON.stringify(this.tempData));
    if(this.buscar){
      console.log("buscas ",this.buscar)
      this.filterUpdate()
      return
    }
    if(this.estadoSelectedOption>=0){
      let seleccion:string = this.estadoSelectedOption+"";
      temp = temp.filter(function (d:any) {
        let estadoS:string = d.habilitar_envio+"";
        return estadoS.toLowerCase().indexOf(seleccion) !== -1 || !seleccion;
      });
      this.notificaciones = temp;
      //this.table.offset = 0;
    }else{
      this.notificaciones = temp;
      //this.table.offset = 0;
    }
  }

  filterUpdate(/*event:any*/){
    //let val = event.target.value.toLowerCase();
    let val = this.buscar.toLowerCase();
    let colsAmt = this.camposCabecera.length;
    let keys = this.camposCabecera;
    this.notificaciones = this.tempData.filter(function(item){
      for (let i=0; i<colsAmt; i++){
        if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val){
          return true;
        }
      }
    });
    let temp = JSON.parse(JSON.stringify(this.notificaciones));
    if(this.estadoSelectedOption>=0){
      let seleccion:string = this.estadoSelectedOption+"";
      temp = temp.filter(function (d:any) {
        let estadoS:string = d.habilitar_envio+"";
        return estadoS.toLowerCase().indexOf(seleccion) !== -1 || !seleccion;
      });
      this.notificaciones = temp;
    }
    //this.table.offset = 0;b
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

  isArray(dato: any) {
    return Array.isArray(dato);
  }

  limpiarDatosTabla(){
    this.visibleTable = false
    this.visibleTableParcial = false
    this.jsonEnvio = []
    this.jsonDetalle = []
    this.enviar = 0
    this.camposCabecera =  [];
    this.notificaciones = []
  }

  limpiar() {
    let carga = JSON.parse(JSON.stringify(this._filtrosService.filtrosValue))
    let limpTemp = []
    if(carga){
      carga.componentes.forEach((element:Componente) => {
        element.resultado=null
        element.required=true
        if(element.tag == "notificar"){
          element.accion = null;
        }
        limpTemp.push(element.idnwicomponente)
      });
      carga.estado = true
      carga.control = 0
      carga.fin = true
      carga.hijos = []
      carga.orden = limpTemp
      carga.limpieza = limpTemp
      carga.load = true
      this.limpiarDatosTabla()
      this._filtrosService.asignacion(carga);
    }
  }

  notificar() {
    console.log("inicio cabeceras selecconadas",this.cabecerasSeleccionadas)
    console.log("json completo ",this.jsonEnvio)

    let jsonTratarEnvio = JSON.parse(JSON.stringify(this.jsonEnvio))

    let jsonEnvioFinal:any
    
    const user = this._userService.userValue;
    let envioFinal:Boolean = false

    switch (user.planta.codplanta) {
      case "PEP":
        console.log("el json necesario para enviar en empacadora",jsonTratarEnvio)
        console.log("data del envio",jsonTratarEnvio.data)
        let jsonData:any[] = jsonTratarEnvio.data
        let jsontemp:any[] = new Array();
        if(this.cabecerasSeleccionadas.length>0){
          this.cabecerasSeleccionadas.forEach((element:any,index) => {
            console.log("index ",jsonData[element.POSICION-1])
            jsontemp.push(jsonData[element.POSICION-1])
          });
          console.log("total de dartos a enviar es ",jsontemp.length)
          jsonTratarEnvio.data = jsontemp
          jsonEnvioFinal = jsonTratarEnvio
          envioFinal = true;
        }
        break;
      case "PEN":
        console.log("el json necesario para enviar en empacadora",jsonTratarEnvio)
        console.log("data del envio",jsonTratarEnvio.data)
        let jsonData3:any[] = jsonTratarEnvio.data
        let jsontem3:any[] = new Array();
        if(this.cabecerasSeleccionadas.length>0){
          this.cabecerasSeleccionadas.forEach((element:any,index) => {
            console.log("index ",jsonData3[element.POSICION-1])
            jsontem3.push(jsonData3[element.POSICION-1])
          });
          console.log("total de dartos a enviar es ",jsontem3.length)
          jsonTratarEnvio.data = jsontem3
          jsonEnvioFinal = jsonTratarEnvio
          envioFinal = true;
        }
        break;
      case "PA":
        if(this.tipoEnvioAtunera){
          console.log("jsonTratarEnvio RHC ",jsonTratarEnvio)
          jsonEnvioFinal = jsonTratarEnvio
          envioFinal = true
        }else{
          console.log("el json necesario para enviar en atunera",jsonTratarEnvio.json.NOTIFICACION[0].DETALLE)
          console.log("el json necesario para enviar en atunera 111 ",this.cabecerasSeleccionadas)
          let jsonData2:any[] = jsonTratarEnvio.json.NOTIFICACION[0].DETALLE
          let jsontemp2:any[] = new Array();
          if(this.cabecerasSeleccionadas.length>0){
            this.cabecerasSeleccionadas.forEach((element:any,index) => {
              console.log("index ",jsonData2[element.POSICION-1])
              jsontemp2.push(jsonData2[element.POSICION-1])
            });
            jsonTratarEnvio.json.NOTIFICACION[0].DETALLE = jsontemp2
            jsonEnvioFinal = jsonTratarEnvio
            envioFinal = true;
          }
        }
        break;
      default:
        console.log("el json necesario para enviar en demas plantas",jsonTratarEnvio)
        jsonEnvioFinal = jsonTratarEnvio
        envioFinal = true
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
    if(user.planta.codplanta=="PEP"||user.planta.codplanta=="PEN"||user.planta.codplanta=="PA"){
      valEnvio = true;
    }else{
      if(this.enviar==1){
        valEnvio = true;
      }
    }
    this.loading = true
    let finEmpacadora:boolean = false;
    if(user.planta.codplanta=="PEP"||user.planta.codplanta=="PEN"){
      if(this.validarEnvioEmpacadora===0){
        finEmpacadora = true;
      }
    }
    if(finEmpacadora){
      Swal.fire({
        icon: 'error',
        title: 'Error Envio',
        text: 'No se puede notificar actividades con tiempo 0'
      })
      setTimeout(() => {
        this.loading = false
      }, this.tiempo);
      return;
    }
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
              text: buscarTagEnJSON(data,"mensaje")
            })
            //validar aqui las rows q envie 
            this.notificaciones.forEach(element => {
              if(element.habilitar_envio===0){
                element.estadoEnvio = true
              }
            });
            console.log("this.notificaciones prueba ",this.notificaciones)
            this.cabecerasSeleccionadas = []
            //this.table.offset = 0;
            ///fin de e esto
            setTimeout(() => {
              this.loading = false
            }, this.tiempo);  
            break;
          case "error":
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
        text: 'Actualmente se encuentra procesandose'
      })
      setTimeout(() => {
        this.loading = false
      }, this.tiempo);
    }
    console.log("fin de final ve",jsonEnvioFinal)
  }

  checkedRow(row:any) {
    if(row.habilitar_envio==0){
      return true
    }
    return false;
  }

  onCheckboxChangeRow(event:any,row:any) {
    if(event.target.checked){
      this.cabecerasSeleccionadas.push(row)
    }else{
      this.cabecerasSeleccionadas = this.cabecerasSeleccionadas.filter(x=>x.POSICION !== row.POSICION)
    }
    
    this.notificaciones.forEach((element:any) => {
      if(element.POSICION == row.POSICION){
        element["habilitar_envio"] = event.target.checked ? 0:1
      }
    });

    let control = true
    this.notificaciones.forEach((element:any,index) => {
      if(element["habilitar_envio"]===1){
        control = false
      }
    });
    this.allSelectedRows = control
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

  disabledRow(row:any) {
    if(row.habilitar_envio === 0 && row.estadoEnvio){
      return true
    }
    return false
  }

  obtenerEncabezados(object:any) {
    return Object.keys(object)
  }
  
  modalOpenLGParcial(modalLG:any,titulo:any,data:any) {
    console.log("modal a ",titulo)
    console.log("modal b ",data)
    this.titulo_detalle = titulo.name
    if(data){
      this.notificacion_detalle = data
      this.cabecera_detalle = Object.keys(data[0])
    }
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }

  modalOpenLG(modalLG:any,titulo:any,data:any) {
    console.log("modal a ",titulo)
    console.log("modal b ",data)
    this.titulo_detalle = titulo
    if(data){
      this.notificacion_detalle = data
      this.cabecera_detalle = Object.keys(data[0])
    }
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }

  dataDetalle(col:any,data:any){
    return data[col]
  }

  limpiarNTA(){
    let carga = this._filtrosService.filtrosValue
    let limpTemp = []
    if(carga){
      carga.componentes.forEach((element:Componente) => {
        if(element.tag == "notificar"){
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

}