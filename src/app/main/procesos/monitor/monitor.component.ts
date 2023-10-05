import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { VerificacionService } from 'app/auth/service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { CoreTranslationService } from '@core/services/translation.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MonitorComponent implements OnInit {
  
  socket = io(environment.apiUrlSockect);
  urlComponentes = environment.apiUrlComponentes 

  urlServicioIntegracion:string;
  urlServicioNotificacion:string;
  private tempData = [];
  
  private tempDataFiltrarEstado:any[] = new Array();
  private tempDataFiltrarIntegr:any[] = new Array();
  private tempDataFiltrarBuscar:any[] = new Array();

  listaTipoIntegracion:any[] = [];
  public expanded = {};
  public selected = [];
  public editingAge = {};
  public editingName = {};
  public editingSalary = {};
  public editingStatus = {};
  public chkBoxSelected = [];
  public rows: Notification[];
  public kitchenSinkRows: any;
  public ColumnMode = ColumnMode;
  public basicSelectedOption: number = 10;
  public estadoSelectedOption: number = -1;
  public intSelectedOption: string = "";
  public buscar: string = ""

  public capturainiticio:any;
  public capturafin:any; 

  fechaActual:Date = new Date()
  fechaActualFin:Date = new Date()

  public menTemp = []

  public cabe = [
    "IDDOCO","MENSAJE"
  ]

  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(
    private modalService: NgbModal,
    private _httpClient: HttpClient,
    private _verificacion:VerificacionService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this.urlServicioNotificacion =environment.apiNotificacion
  }

  changefiltro(val:string){
    const value = val.toString().toLowerCase().trim();
    // get the amount of columns in the table
    // get the key names of each column in the dataset
    //const keys = Object.keys(this.temp[0]);
    const keys = ["id_integracion","descripcion_integracion","mandante","estado","respuesta"];
    const count = keys.length;
    // assign filtered matches to the active datatable
    let temp:any[] = []
    temp = this.tempData.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < count; i++) {
        // check for a match
        if (
          (item[keys[i]] &&
            item[keys[i]]
              .toString()
              .toLowerCase()
              .indexOf(value) !== -1) ||
          !value
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    this.tempDataFiltrarBuscar = temp
    
    if(this.buscar!="" || this.intSelectedOption!=""){
      console.log("ingreso a validar en changeEstado")
      if(this.tempDataFiltrarIntegr.length>0){
        console.log("ingreso a validar en changeEstado en filtro integracion")
        let tempie:any[] = new Array()
        temp.forEach((elementi:any) => {
          this.tempDataFiltrarIntegr.forEach((elemente:any) => {
            if(elementi.id_integracion===elemente.id_integracion){
              tempie.push(elemente)
            }
          });
        });
        temp = tempie;
      }
      if(this.tempDataFiltrarEstado.length>=0){
        console.log("ingreso a validar en changeEstado en filtro buscar")
        let tempib:any[] = new Array()
        temp.forEach((elementi:any) => {
          this.tempDataFiltrarEstado.forEach((elemente:any) => {
            if(elementi.id_integracion===elemente.id_integracion){
              tempib.push(elemente)
            }
          });
        });
        temp = tempib;
      }
    }

    this.kitchenSinkRows = temp;
  }

  filterUpdate(event:any) {
    let val:string = event.target.value
    this.changefiltro(val)
  }
 
  changeEstado(){
    if(this.estadoSelectedOption>=0){
      let seleccion:string = this.estadoSelectedOption+"";
      let temp:any = [];
      temp = this.tempData.filter(function (d) {
        let estadoS:string = d.estado+"";
        return estadoS.toLowerCase().indexOf(seleccion) !== -1 || !seleccion;
      });
      this.tempDataFiltrarEstado = temp;

      if(this.buscar!="" || this.intSelectedOption!=""){
        console.log("ingreso a validar en changeEstado")
        if(this.tempDataFiltrarIntegr.length>0){
          console.log("ingreso a validar en changeEstado en filtro integracion")
          let tempie:any[] = new Array()
          temp.forEach((elementi:any) => {
            this.tempDataFiltrarIntegr.forEach((elemente:any) => {
              if(elementi.id_integracion===elemente.id_integracion){
                tempie.push(elemente)
              }
            });
          });
          temp = tempie;
        }
        if(this.tempDataFiltrarBuscar.length>0){
          console.log("ingreso a validar en changeEstado en filtro buscar")
          let tempib:any[] = new Array()
          temp.forEach((elementi:any) => {
            this.tempDataFiltrarBuscar.forEach((elemente:any) => {
              if(elementi.id_integracion===elemente.id_integracion){
                tempib.push(elemente)
              }
            });
          });
          temp = tempib;
        }
      }
      console.log("tempDataFiltrarEstado",this.tempDataFiltrarEstado)
      this.kitchenSinkRows = temp;
      this.table.offset = 0;
    }else{
      let valf:boolean = true
      if(this.intSelectedOption!=""){
        this.changeTipoIntegracion()
        valf = false
      }
      if(this.buscar!=""){
        this.changefiltro(this.buscar)
        valf = false
      }
      if(valf){
        this.kitchenSinkRows = this.tempData;
        this.table.offset = 0;
      }
    }
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  compararfechar(di:Date,df:Date){
    let val:boolean = true
    let dia = new Date();
    dia.setFullYear(di.getFullYear()); 
    dia.setMonth(di.getMonth()); 
    dia.setDate(di.getDate());
    let dib = new Date();
    dib.setFullYear(df.getFullYear()); 
    dib.setMonth(df.getMonth()); 
    dib.setDate(df.getDate());
    if(dia>dib){
      val = false;
    }
    return val
  }

  capturar(e:any){
    this.buscar = ""
    this.intSelectedOption = ""
    this.estadoSelectedOption = -1
    if(e.target.value){
      this.capturainiticio = e.target.value;
      if(this.capturainiticio && this.capturafin){
        let di = this.formatoDate(this.capturainiticio);
        let df = this.formatoDate(this.capturafin);
        let est:boolean = this.compararfechar(di,df);
        if(!est){
          this.kitchenSinkRows = []
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "La fecha de inicio no puede ser mayor que la fecha fin"
          })
        }else{
          this.capturarNotificaciones(this.capturainiticio,this.capturafin);
        }
      }
    }else{
      this.kitchenSinkRows = []
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Debe ingresar fecha de inicio"
        })
    }
  }

  capturarFin(e:any){
    this.buscar = ""
    this.intSelectedOption = ""
    this.estadoSelectedOption = -1
    if(e.target.value){
      this.capturafin = e.target.value;
      if(this.capturainiticio && this.capturafin){
        let di = this.formatoDate(this.capturainiticio);
        let df = this.formatoDate(this.capturafin);
        let est:boolean = this.compararfechar(di,df);
        if(!est){
          this.kitchenSinkRows = []
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "La fecha de fin no puede ser menor que la fecha inicio"
          })
        }else{
          this.capturarNotificaciones(this.capturainiticio,this.capturafin);
        }
      }
    }else{
      this.kitchenSinkRows = []
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Debe ingresar fecha de fin"
        })
    }
  }

  nameColumna(row: any,col: any) {
    let dato: any;
    this.cabe.forEach((element) => {
      if (element == col) {
        //dato = row[element.descripcion]
        dato = row[element];
      }
    });
    return dato;
  }

  isArray(dato: any) {
    return Array.isArray(dato);
  }
  
  modalOpenLG(modalLG:any,mensaje:any) {
    this.menTemp = mensaje;
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }

  formatDate(date:any) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
  }

  formatoDate(fecha:string){
    let cadenaa = fecha.substr(0,4)
    let cadenam = fecha.substr(5,2)
    let cadenad = fecha.substr(8,2)
    let an:number = parseInt(cadenaa)
    let mn:number = parseInt(cadenam)
    let dn:number = parseInt(cadenad)
    return new Date(an,mn,dn)
  }

  ngOnInit() {
    let fechaA = new Date()
    let fechae =  this.formatDate(fechaA)
    this.capturainiticio = fechae
    let fechaF = new Date()
    let fechaz =  this.formatDate(fechaF)
    this.capturafin = fechaz
    this.listarTipoIntegraciones()
      .subscribe(
        (result:any) =>{
          this.listaTipoIntegracion = result.data;
          console.log(result);
      }
    )

    this.capturarNotificaciones(fechae,fechaz);
    this.obtenerData();
    this.obtenerEnvio();
    this.obtenerError();
  }

  changeTipoIntegracion(){
    if(this.intSelectedOption){
      let seleccion:string = this.intSelectedOption+"";
      let temp:any = [];
      temp = this.tempData.filter(function (d) {
        let estadoS:string = d.tipo_integracion+"";
        return estadoS.indexOf(seleccion) !== -1 || !seleccion;
      });
      this.tempDataFiltrarIntegr = temp;
      if(this.buscar!="" || this.estadoSelectedOption>=0){
        console.log("ingreso a validar en changeTipoIntegracion")
        if(this.tempDataFiltrarEstado.length>=0){
          console.log("ingreso a validar en changeTipoIntegracion filtro estado")
          let tempie:any[] = new Array()
          temp.forEach((elementi:any) => {
            this.tempDataFiltrarEstado.forEach((elemente:any) => {
              if(elementi.id_integracion===elemente.id_integracion){
                tempie.push(elemente)
              }
            });
          });
          temp = tempie;
        }
        if(this.tempDataFiltrarBuscar.length>0){
          console.log("ingreso a validar en changeTipoIntegracion filtro buscar")
          let tempib:any[] = new Array()
          temp.forEach((elementi:any) => {
            this.tempDataFiltrarBuscar.forEach((elemente:any) => {
              if(elementi.id_integracion===elemente.id_integracion){
                tempib.push(elemente)
              }
            });
          });
          temp = tempib;
        }
      }
      console.log("tempDataFiltrarIntegr",this.tempDataFiltrarIntegr)
      this.kitchenSinkRows = temp;
      this.table.offset = 0;

    }else{
      this.tempDataFiltrarIntegr = []
      let valf:boolean = true
      if(this.estadoSelectedOption>=0){
        this.changeEstado()
        valf = false
      }
      if(this.buscar!=""){
        this.changefiltro(this.buscar)
        valf = false
      }
      if(valf){
        this.kitchenSinkRows = this.tempData;
        this.table.offset = 0;
      }
    }
  }

  capturarNotificaciones(fechaInicio:string,fechaFin:string){
    let urlTemp = this.urlServicioNotificacion+"/sap/listarIntegraciones"
    console.log("url noti ",urlTemp)
    let temp = this._verificacion.userValue;
    let planta = temp.planta.codplanta;
    if(planta === "PEP" || planta === "PEN"){
      planta = "PE"
    }
    let envio = {
      "fechainicio":fechaInicio,
      "fechafin":fechaFin,
      "codPlanta":planta
    }
    console.log("url monitor ",urlTemp)
    console.log("datos para monitor ",envio)
    this.kitchenSinkRows = []
    this.tempData = this.kitchenSinkRows
    this._httpClient.post(urlTemp,envio).subscribe((result:any)=> {
        console.log("respuesta de la primera consulta ",result)
        if(result["estado"]==="ok"){    
          let dat:any[] = result["data"]
          this.rows = dat;
          this.rows = this.ordenarArreglo(this.rows)
          this.tempData = this.rows;
          this.kitchenSinkRows = this.rows;
          return;
        }
        if(result["estado"]==="warning"){
          Swal.fire({
            icon: result["estado"],
            title: 'Error',
            text: result["mensaje"]
          })
          return;
        } 
        if(result["estado"]==="error"){
          Swal.fire({
            icon: result["estado"],
            title: 'Error',
            text: result["mensaje"]
          })
          return;
        }
      },error =>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Ocurrio un problema, consulte con sistema"
        })
        return; 
      }
    )
  }

  obtenerData(){
    this.socket.on('recibir-notificaciones',(notificaciones)=>{
      console.log("notificacion disponible od",this.kitchenSinkRows);
      console.log("notificacion recibidas services od",notificaciones);
      notificaciones.forEach((not:any) => {
        let temp = this._verificacion.userValue;
        let planta = temp.planta.codplanta;
        if(planta === "PEP" || planta === "PEN"){
          planta = "PE"
        }
        this.rows.map((rowNoT:Notification)=>{
          if(rowNoT["id_integracion"].includes(planta)){
            if(not["ID_INTEGRACION"]==rowNoT["id_integracion"]){
              if(not["POSICION"]==rowNoT["posicion"]){
                let estadoRecibido:number = parseInt(not["ESTATUS"]);
                rowNoT["estado"] = estadoRecibido
                if(estadoRecibido == 1){
                  rowNoT["respuesta"] = not["DETALLE"][0].IDDOCO;
                }
                if(estadoRecibido == 2){
                  rowNoT["respuesta"] = not["DETALLE"];
                }
              }
            }
          }
        })
      });
      console.log("notificacion recibidas final",this.rows);
      this.rows = this.ordenarArreglo(this.rows)
      this.kitchenSinkRows = this.rows;
      this.tempData = this.rows;
    })
  }

  listarTipoIntegraciones(){
    return this._httpClient.get(this.urlComponentes+"/listarTipoIntegraciones");
  }

  obtenerEnvio(){
    this.socket.on('recibir-envio',(recibo)=>{
      console.log("notificacion recibidas recibo oe ",recibo)
      let temp = this._verificacion.userValue;
      let planta = temp.planta.codplanta;
      if(planta === "PEP" || planta === "PEN"){
        planta = "PE"
      }
      let rev:boolean = false
      if(recibo["id_integracion"].includes(planta)){
        rev = true;
      }
      console.log("bien aqui")
      if(rev === false){
        return;
      }
      if(this.rows){
        let validador = true;
        this.rows.map((rowNoT:Notification)=>{
            if(recibo["id_integracion"]===rowNoT["id_integracion"]){
              rowNoT = recibo;
              validador = false;
            }
        })
        if(validador){
          this.rows.unshift(recibo);
        }
      }else{
        this.rows.unshift(recibo);
      }
      let tempArray = JSON.parse(JSON.stringify(this.rows))
      console.log("notificacion final es ",tempArray)
      this.kitchenSinkRows =tempArray;
      this.tempData = tempArray;
    })
  }

  obtenerError(){
    this.socket.on('recibir-error-flota',(error)=>{
      console.log("notificacion recibidas error ",error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error["mensaje"]
      })
      return;
    })
  }

  ordenarArreglo(array:any){    
    array.sort(function (x, y) {
      if (y.id_integracion < x.id_integracion) {
          return -1;
      }
      if (y.id_integracion > x.id_integracion) {
          return 1;
      }
      return 0;
    });
    return array
  }

  recargar(){
    if(this.capturainiticio && this.capturafin){
      let di = this.formatoDate(this.capturainiticio);
      let df = this.formatoDate(this.capturafin);
      let est:boolean = this.compararfechar(di,df);
      console.log("est ",est)
      if(!est){
        this.kitchenSinkRows = []
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "La fecha de fin no puede ser menor que la fecha inicio"
        })
      }else{
        this.capturarNotificaciones(this.capturainiticio,this.capturafin);
      }
    }else{
      this.kitchenSinkRows = []
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Debe ingresar el rango de fecha"
        })
    }

    this.buscar = ""
    this.intSelectedOption = ""
    this.estadoSelectedOption = -1
  }

}