import { io } from 'socket.io-client';
import { environment } from 'environments/environment';
import { VerificacionService } from 'app/auth/service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MonitorresumenService } from './monitorresumen.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Proceso } from 'app/auth/models/proceso';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import axios from "axios";

@Component({
  selector: 'app-monitorresumen',
  templateUrl: './monitorresumen.component.html',
  styleUrls: ['./monitorresumen.component.scss', './monitorresumen.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MonitorresumenComponent implements OnInit {

  pipe = new DatePipe('en-US');
  
  socket = io(environment.apiUrlSockect);
  
  urlServicioIntegracion:string;
  urlServicioNotificacion:string;
  private tempData = [];

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
  titulo:string = "";
  nomenclatura:string = "mdr";
  urlGateway = environment.apiUrlGateway 
  
  fechaInicio:any;
  fechaFin:any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(
    private monitorResumenService:MonitorresumenService,
    private _userService: VerificacionService,
    private _http: HttpClient,
  ) {
    this.urlServicioIntegracion = environment.apiUrlServicioIntegracion
    this.urlServicioNotificacion =environment.apiNotificacion
  }

  ngOnInit():void {
    this.fechaInicio = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
    this.fechaFin = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
    //this.funPresentarDatos();
    this.funPresentarDatosAgrupadosFecha();
    this.funCargarDatos();
  }

  funCargarDatos(){
    const user = this._userService.userValue;
    this.socket.on('recibir-notificaciones',(notificaciones)=>{
      console.log("notificacion recibidas services",notificaciones);
      notificaciones.forEach((not:any) => {
        if(not["ID_INTEGRACION"].substring(0, 2)==user.planta.codplanta){
          if(not["ESTATUS"]=="1"){
            this.funPresentarDatosAgrupados(); 
          }
        }
      });
    })
  }

  funPresentarDatos(){
    this.kitchenSinkRows=[];
    const user = this._userService.userValue;
    if (user) {
      let tempProceso = user.procesos.find((tp:Proceso) => tp.codproceso == this.nomenclatura);
      if(tempProceso){
        this.titulo = tempProceso.titulo
      }
      let url = this.urlGateway+"/nw-administrativo/monitorresumen/generarProcesosParaMonitor"
      let json ={
        fecha: this.pipe.transform(this.fechaInicio, 'dd/MM/yyyy'),
        planta: user.planta.codplanta
      }
      console.log(json)
      //let tok = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwZWxhZ2ljbyIsImlhdCI6MTY3NzU5NDI0MCwiZXhwIjoxNjc3NjgwNjQwfQ.VN0CMJ1lL2aCaAUg8cBe3xt-LkfNzOQ_UJEI-OO1KUOtxWmiszb0acXABd3U6caHlP97H_pQRaBraMv8i5jpGA";
      let tok = user.token;

      axios.post(url, json, { headers: { "Authorization": `Bearer ${tok}` } } ).then((data) => {
        console.log(data.data);
        if(data.data.length > 0){
          if(data.data[0].estado){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No hay datos revise el sistema'
            })
          }else{
            this.kitchenSinkRows=data.data
          }
        } 
      },error => {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un problema con el servidor consulte a sistemas'
        })  
      }); 
    }
  }

  funPresentarDatosAgrupadosFecha(){
    this.kitchenSinkRows=[];
    const user = this._userService.userValue;
    if (user) {
      let tempProceso = user.procesos.find((tp:Proceso) => tp.codproceso == this.nomenclatura);
      if(tempProceso){
        this.titulo = tempProceso.titulo
      }
      let url = this.urlGateway+"/nw-administrativo/monitorresumen/generarProcesosAgrupadosParaMonitor"
      let json ={
        fechaInicio: this.pipe.transform(this.fechaInicio, 'dd/MM/yyyy'),
        fechaFin: this.pipe.transform(this.fechaFin, 'dd/MM/yyyy'),
        planta: user.planta.codplanta
      }
      console.log(json)
      //let tok = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwZWxhZ2ljbyIsImlhdCI6MTY3NzY4NDk3MSwiZXhwIjoxNjc3NzcxMzcxfQ.TBpRMZWMERe_0Eyp-lrnxHfWo_HPkF0EiQ08nPvAW5fOqywNlsBqWbKk4RIn00ktaonbpdBwd_5m7eeYYwsyew"

      let tok = user.token;

      axios.post(url, json, { headers: { "Authorization": `Bearer ${tok}` } } ).then((data) => {
        console.log(data.data);
        if(data.data.length > 0){
          if(data.data[0].estado){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No hay datos revise el sistema'
            })
          }else{
            this.kitchenSinkRows=data.data
          }
        } 
      },error => {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un problema con el servidor consulte a sistemas'
        })
      }); 
    }
  }

  funPresentarDatosAgrupados(){
    this.kitchenSinkRows=[];
    const user = this._userService.userValue;
    if (user) {
      let tempProceso = user.procesos.find((tp:Proceso) => tp.codproceso == this.nomenclatura);
      if(tempProceso){
        this.titulo = tempProceso.titulo
      }
      let url = this.urlGateway+"/nw-administrativo/monitorresumen/generarProcesosAgrupadosParaMonitor"
      let json ={
        fechaInicio: this.pipe.transform(this.fechaInicio, 'dd/MM/yyyy'),
        fechaFin: this.pipe.transform(this.fechaFin, 'dd/MM/yyyy'),
        planta: user.planta.codplanta
      }
      console.log(json)
      //let tok = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwZWxhZ2ljbyIsImlhdCI6MTY3NzY4NDk3MSwiZXhwIjoxNjc3NzcxMzcxfQ.TBpRMZWMERe_0Eyp-lrnxHfWo_HPkF0EiQ08nPvAW5fOqywNlsBqWbKk4RIn00ktaonbpdBwd_5m7eeYYwsyew"

      let tok = user.token;

      axios.post(url, json, { headers: { "Authorization": `Bearer ${tok}` } } ).then((data) => {
        console.log(data.data);
        if(data.data.length > 0){
          if(data.data[0].estado){
           
          }else{
            this.kitchenSinkRows=data.data
          }
        } 
      },error => {
        console.log(error)
      }); 
    }
  }

  getCellClass(row): string {
    console.log(row)
    let claserespuesta = "";
    if(row.column.headerClass == "is-oc"){
      if( row.row.porc_orden_compra == "0" ){
        claserespuesta = "row-porcentaje_bajo";
      }else {
        if( row.row.porc_orden_compra == "100" ){
          claserespuesta = "row-porcentaje_alto";
        }
      }
    }
    if(row.column.headerClass == "is-orhalb"){
      if( row.row.porc_orden_halb >= 0 && row.row.porc_orden_halb < 70){
        claserespuesta = "row-porcentaje_bajo";
      }else{
        if(row.row.porc_orden_halb >=70 && row.row.porc_orden_halb < 90){
          claserespuesta = "row-porcentaje_medio";
        }else{
          if(row.row.porc_orden_halb >=90 && row.row.porc_orden_halb <= 100){
            claserespuesta = "row-porcentaje_alto";
          }
        }
      }
    }
    
    
    return claserespuesta;
  };

}
