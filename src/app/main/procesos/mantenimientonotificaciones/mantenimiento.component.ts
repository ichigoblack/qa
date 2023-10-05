import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { DataList } from 'app/auth/models/seguridad/dataList';
import { timingSafeEqual } from 'crypto';
import { ApexYAxis } from 'ng-apexcharts';
import { switchAll } from 'rxjs/operators';
import {obtenerFechaActual} from '../../../js/funcionesGenerales';
import {convertirFecha} from '../../../js/funcionesGenerales';
import Swal from 'sweetalert2'
import { MantenimientoService } from './mantenimiento.service';
@Component({
  selector: 'app-mantenimientonotificaciones',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MantenimientoComponent implements OnInit {

  // Propiedades
  fecha:any;
  tipoIntegracion:any;
  listaTipoIntegracion:any[] = [];
  loading = false;
  // datos para tabla
  columnas:any[] = [];
  rows: any[] = [];
  auxRows: any[] = [];
  kitchenSinkRows: any;

  // bandera

  mostrarTabla:boolean = false

  public basicSelectedOption: number = 10;
  public expanded = {};
  public selected = [];
  public editingAge = {};
  public editingName = {};
  public editingSalary = {};
  public editingStatus = {};
  public chkBoxSelected = [];
  
  public ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent) table: DatatableComponent;


  constructor(
    private mantenimientoService:MantenimientoService
  ) { }

  ngOnInit(): void {
    this.fecha = new Date();
    this.fecha = convertirFecha(this.fecha);
    this.cargarTipoIntegracion();
  }

  busqueda(event:any){
    const valor = event.target.value.toLowerCase();
    const temp = this.auxRows.filter((d)=> {  
        return (d[this.columnas[0].prop].toLowerCase().indexOf(valor) !== -1) 
                    || (d[this.columnas[1].prop].toString().toLowerCase().indexOf(valor) !== -1)
                    || (d[this.columnas[2].prop].toString().toLowerCase().indexOf(valor) !== -1)
                    || !valor;
    });
    this.kitchenSinkRows = temp;
    this.table.offset = 0;
  }

  cargarTipoIntegracion(){
    this.mantenimientoService.listarTipoIntegraciones()
          .subscribe(
            (result:any) =>{
              this.listaTipoIntegracion = result.data;
              console.log(result);
            }
    )
  }

  validarFiltros(){

    if(this.fecha == null || this.fecha == undefined || this.fecha == ''){
      Swal.fire({
          title:"Error",
          icon:"warning",
          text:"Debe ingresar una fecha"
        }
      )
      return false;
    }

    if(this.tipoIntegracion == null || this.tipoIntegracion == undefined || this.tipoIntegracion == ''){
      Swal.fire({
          title:"Error",
          icon:"warning",
          text:"Debe ingresar una tipo de Integración"
        }
      )
      return false;
    }
    return true;
  }

  cargarIntegraciones(esBusqueda:boolean){
    if(!this.validarFiltros()){
      return;
    }
    //console.log(this.fecha);
    this.loading = true;
    this.mantenimientoService.listarIntegraciones(this.fecha,this.tipoIntegracion)
            .subscribe(
              (result:any)=>{
                console.log(result);
                if(result.estado == 'ok'){
                  this.mostrarTabla = true
                  this.columnas = result.columnas;
                  this.auxRows = result.data;
                  this.rows = result.data;
                  this.kitchenSinkRows = result.data;
                  
                }else{
                  if(esBusqueda){
                    Swal.fire({
                        title:result.titulo,
                        icon:result.estado,
                        text:result.mensaje
                      }
                    )
                  }
                  this.auxRows = []
                  this.kitchenSinkRows = []
                  this.columnas = []
                  this.mostrarTabla = false
                }
                this.loading = false;
              }
            )
  }

  changeTipoIntegracion(){
    this.limpiarTabla();
  }

  changeFecha(e:any){
    if(e.target.value){
        this.fecha = e.target.value;
        this.limpiarTabla();
    }
  }

  anular(id:any){
    Swal.fire({
      title:"Advertencia",
      icon:"warning",
      text:"Está seguro ? ",
      confirmButtonText:"Sí",
      showCancelButton: true,
      cancelButtonText:"Cancelar",

    }).then(response=>{
        if(response.isConfirmed){
          this.mantenimientoService.anularIntegracion(id)
                  .subscribe((result:any)=>{
                    if(result.estado == 'ok'){
                      Swal.fire({
                          title:'Éxito',
                          text:result.mensaje,
                          icon:'success'
                        }
                      )
                    }else{
                      Swal.fire({
                        title:'Error',
                        text:result.mensaje,
                        icon:'error'
                      }
                    )
                    }
                    this.cargarIntegraciones(false);
                  })
        }
    })
  }

  reversarAnulacion(id:any){
    Swal.fire({
      title:"Advertencia",
      icon:"warning",
      text:"Está seguro ? ",
      confirmButtonText:"Sí",
      showCancelButton: true,
      cancelButtonText:"Cancelar",

    }).then(response=>{
        if(response.isConfirmed){
          this.mantenimientoService.reversarAnulacion(id)
                  .subscribe((result:any)=>{
                    if(result.estado == 'ok'){
                      Swal.fire({
                          title:'Éxito',
                          text:result.mensaje,
                          icon:'success'
                        }
                      )
                    }else{
                      Swal.fire({
                        title:'Error',
                        text:result.mensaje,
                        icon:'error'
                      }
                    )
                    }
                    this.cargarIntegraciones(false);
                  })
        }
    })
  }

  limpiarTabla(){
    this.rows = [];
    this.kitchenSinkRows = [];
    this.mostrarTabla = false;
  }

}
