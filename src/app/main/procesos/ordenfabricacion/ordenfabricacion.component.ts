import { Proceso } from 'app/auth/models/proceso';
import { HttpClient } from '@angular/common/http';
import { AdItem } from 'app/main/directivas/ad-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VerificacionService } from 'app/auth/service';
import { environment } from 'environments/environment';
import { Flitro } from 'app/auth/models/seguridad/filtro';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { ServicioService } from 'app/main/directivas/servicio.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Componente } from 'app/auth/models/seguridad/componente';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-ordenfabricacion',
  templateUrl: './ordenfabricacion.component.html',
  styleUrls: ['./ordenfabricacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrdenfabricacionComponent implements OnInit, OnDestroy, AfterViewInit {

  modal: string = ""
  titulo: string = ""
  nomenclatura: string = "ofb"
  itemsFabricacion: AdItem[] = [];
  urlComponentes = environment.apiUrlComponentes
  urlServicioHarina = environment.apiUrlHarina
  urlServicioAdministrados = environment.apiUrlServicioAdministrativo

  ColumnMode = ColumnMode;

  areaSelectedOption: any = 0
  cajonesHarina: any[] = []
  allSelectedRows: boolean = false;
  idtipoproteina: number = 0
  tiporecepcion: String = ""
  cajonesArray: any[] = [];
  cajonesSeleccionados: any[] = []
  capturainicio: any;
  capturafin: any;
  fechFinCajon: any
  fechInicioCajon: any
  idCompCajon: number = 0
  apiAreaCajonesHarina: any = this.urlServicioHarina + "/nw-integracion/integracion/obtenerAreas"
  apiCajonesHarina: string = ""

  cajonesEnviarArray: any[] = [];
  @ViewChild('modalCajon') cajonModal: any

  constructor(
    private _router: Router,
    private _http: HttpClient,
    private modalService: NgbModal,
    private servicioService: ServicioService,
    private _userService: VerificacionService,
    private _filtrosService: FiltrosService
  ) {
    this._filtrosService.filtros.subscribe(x => {
      if (x) {
        let temp: Componente
        const user = this._userService.userValue;
        if (user.planta.codplanta === "PH") {
          temp = x.componentes.find(componente => componente.tag == "recepcion")
          if (temp.accion === 'limpiarCajon') {
            this.cajonesArray = []
            this.cajonesEnviarArray = []
            temp.accion = null;
          }
          temp = x.componentes.find(componente => componente.tag == "cajones" && componente.accion == "final")
          this.idtipoproteina = 0;
          if (temp) {
            if (temp.resultado) {
              this.tiporecepcion = temp.resultado["tipo"]
              this.idtipoproteina = temp.resultado["id_tipo_proteina"]
              this.modal = temp.resultado["modal"]
              if (this.modal === "modalCajon") {
                this.modalOpenLG(this.cajonModal);
                //temp.resultado = null
                this.idCompCajon = temp.idnwicomponente
                temp.accion = null
              }
            }
          }
        }
      }
    })
  }

  capturarDateInicio(e: any) {
    this.capturainicio = e.target.value;
  }

  capturarDateFin(e: any) {
    this.capturafin = e.target.value;
  }

  formatDate(date: any) {
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

  onCheckboxChangeAllRow(event: any, notificacionesRece: any[]) {
    let cabTemp: any[] = []
    if (event.target.checked) {
      notificacionesRece.forEach((element: any) => {
        element.sel = true
        cabTemp.push(element)
      });
    } else {
      notificacionesRece.forEach((element: any) => {
        element.sel = false
      });
    }
    this.cajonesSeleccionados = cabTemp
    //this.cajonesArray = notificacionesRece
    let control = false
    if (this.cajonesSeleccionados.length === this.cajonesArray.length) {
      control = true
    }
    this.allSelectedRows = control
  }

  onCheckboxChangeRow(event: any, row: any) {
    this.cajonesArray.forEach(cajon => {
      if (cajon.id === row.id) {
        cajon.sel = event.target.checked
      }
    });
    if (event.target.checked) {
      this.cajonesSeleccionados.push(row)
    } else {
      this.cajonesSeleccionados = this.cajonesSeleccionados.filter(x => x.id !== row.id)
    }
    let control = false
    if (this.cajonesSeleccionados.length === this.cajonesArray.length) {
      control = true
    }
    this.allSelectedRows = control
  }

  cerrarModalCajon() {
    let idtemporal = this.idCompCajon
    let arrayTemportal = this.cajonesEnviarArray
    let tempFiltros = this._filtrosService.filtrosValue;
    if (tempFiltros) {
      tempFiltros.componentes.forEach(function (componente: Componente) {
        if (componente.idnwicomponente === idtemporal) {
          componente.resultado = arrayTemportal
        }
      })
    }
    this._filtrosService.asignacion(tempFiltros)
    this.modalService.dismissAll("ok")
  }

  aggCajon() {
    let idtemporal = this.idCompCajon;
    if (this.cajonesSeleccionados.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe Seleccionar un cajon'
      })
      return
    }
    let avanzar: boolean = false
    if (this.cajonesEnviarArray.length > 0) {
      let rowV = this.cajonesSeleccionados[0]
      switch (rowV.id_area) {
        case 1:
          this.cajonesEnviarArray.forEach(cajonVer => {
            if (cajonVer.id_area === 5 || cajonVer.id_area === 6) {
              avanzar = true
            }
          });
          break;
        case 5:
          this.cajonesEnviarArray.forEach(cajonVer => {
            if (cajonVer.id_area === 1) {
              avanzar = true
            }
          });
          break;
        case 6:
          this.cajonesEnviarArray.forEach(cajonVer => {
            if (cajonVer.id_area === 1) {
              avanzar = true
            }
          });
          break;
        default:
          break;
      }
    }
    if (avanzar) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No puede agregar cajones es esta area'
      })
      return
    }
    this.cajonesEnviarArray = JSON.parse(JSON.stringify(this.cajonesSeleccionados))
    this.cajonesEnviarArray.forEach(cajenv => {
      delete cajenv.sel
    });
    this.areaSelectedOption = 0
    this.cajonesSeleccionados = []
    this.cajonesArray = []
    this.fechInicioCajon = null
    this.fechFinCajon = null
    this.modalService.dismissAll("ok")
    this.allSelectedRows = false

    //api que me traiga los id de los componentes a trabajar 
    //{"parametro":20,"campo":"P","accion":"sumar"}
    // cant harina - aceite  poza = [15,18]
    // cant harina - aceite  subp = [124,125]
    let compmod = []
    if (this.tiporecepcion === "S") {
      compmod = [124, 125]
    }
    if (this.tiporecepcion === "P") {
      compmod = [15, 18]
    }

    let acumA = 0
    let acumH = 0
    this.cajonesEnviarArray.forEach(element => {
      acumA = acumA + element["cantidad_aceite"]
      acumH = acumH + element["cantidad_harina"]
    });

    let tempFiltros = this._filtrosService.filtrosValue;

    let arrayTemportal = this.cajonesEnviarArray

    if (tempFiltros) {
      tempFiltros.componentes.forEach(function (componente: Componente) {
        if (componente.idnwicomponente === compmod[0]) {
          if (componente.resultado === null) {
            componente.resultado = 0
          }
          componente.resultado = componente.resultado + acumH
        }
        if (componente.idnwicomponente === compmod[1]) {
          if (componente.resultado === null) {
            componente.resultado = 0
          }
          componente.resultado = componente.resultado + acumA
        }
      })
      tempFiltros.componentes.forEach(function (componente: Componente) {
        if (componente.idnwicomponente === idtemporal) {
          componente.resultado = arrayTemportal
        }
      })
    }
    this._filtrosService.asignacion(tempFiltros)
    //this.tiporecepcion = "";
    ///this.idCompCajon
  }

  onDeleteCajon(row: any) {
    const resultado = this.cajonesEnviarArray.filter(cajon => cajon.id !== row.id);
    this.cajonesEnviarArray = resultado

    let compmod = []
    if (this.tiporecepcion === "S") {
      compmod = [124, 125]
    }
    if (this.tiporecepcion === "P") {
      compmod = [15, 18]
    }

    let acumA = row["cantidad_aceite"]
    let acumH = row["cantidad_harina"]

    let idtemporal = this.idCompCajon
    let arrayTemportal = this.cajonesEnviarArray
    let tempFiltros = this._filtrosService.filtrosValue;
    if (tempFiltros) {
      tempFiltros.componentes.forEach(function (componente: Componente) {
        if (componente.idnwicomponente === compmod[0]) {
          componente.resultado = componente.resultado - acumH
        }
        if (componente.idnwicomponente === compmod[1]) {
          componente.resultado = componente.resultado - acumA
        }
      })
      tempFiltros.componentes.forEach(function (componente: Componente) {
        if (componente.idnwicomponente === idtemporal) {
          componente.resultado = arrayTemportal
        }
      })
    }
    this._filtrosService.asignacion(tempFiltros)
  }

  checkedCajonRow(row: any) {
    if (row.sel) {
      return true
    }
    return false;
  }

  buscarCajon() {
    let info = {
      "fechainicio": this.capturainicio,
      "fechafin": this.capturafin,
      "area": this.areaSelectedOption,
      "id_tipo_proteina": this.idtipoproteina
    }
    this._http.post(this.apiCajonesHarina, info).subscribe((data: any[]) => {
      if (data["status"] === "error") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data["mensaje"]
        })
        return
      }
      try {
        data.forEach(cajonElement => {
          cajonElement.sel = false;
        });
        this.cajonesArray = data
      } catch (error) {
        this.cajonesArray = []
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un problema con el servidor consulte a sistemas'
        })
      })
  }

  modalOpenLG(modalLG: any) {
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }

  ngOnInit(): void {
    let carga = this._filtrosService.filtrosValue
    if (carga) {
      if (carga.load) {
        this._filtrosService.asignacion(null)
        location.reload()
      }
    }
    const user = this._userService.userValue;
    if (user) {
      let tempProceso = user.procesos.find((tp: Proceso) => tp.codproceso == this.nomenclatura);
      if (tempProceso) {
        this.titulo = tempProceso.titulo
      }
      let url = this.urlComponentes + "/listarComponentes/" + user.planta.codplanta + "/" + this.nomenclatura
      this._http.get(url).subscribe(data => {
        if (data["estado"] == "ok") {
          this.itemsFabricacion = this.servicioService.getAds(data["data"]);
          let filtroTemp: Flitro = {
            estado: false,
            componentes: data["data"],
            hijos: [],
            limpieza: [],
            orden: [],
            limpiarNotificacion: false,
            control: 0,
            fin: false,
            load: false
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
        case "PH":
          this._http.get(this.urlServicioAdministrados + "/nw-administrativo/integracion/obtenerApiCajonHarinaBaseIntegrador").subscribe(data => {
            if (data["estado"] == "ok") {
              let apitemp = data["data"][0]
              this.apiCajonesHarina = apitemp["url"]
            }
          })
          this._http.get(this.apiAreaCajonesHarina).subscribe((data: any[]) => {
            this.cajonesHarina = data
          },
            error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrio un problema con el servidor consulte a sistemas'
              })
            })
          break
        default:
          break;
      }
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}