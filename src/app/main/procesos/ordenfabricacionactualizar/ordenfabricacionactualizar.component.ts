import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Proceso } from 'app/auth/models/proceso';
import { DataList } from 'app/auth/models/seguridad/dataList';
import { Flitro } from 'app/auth/models/seguridad/filtro';
import { VerificacionService } from 'app/auth/service';
import { FiltrosService } from 'app/auth/service/filtros.service';
import { AdItem } from 'app/main/directivas/ad-item';
import { ServicioService } from 'app/main/directivas/servicio.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-ordenfabricacionactualizar',
  templateUrl: './ordenfabricacionactualizar.component.html',
  styleUrls: ['./ordenfabricacionactualizar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrdenfabricacionactualizarComponent implements OnInit {

  modal: string = ""
  titulo: string = ""
  nomenclatura: string = "aof"
  itemsFabricacion: AdItem[] = [];
  urlServicioHarina = environment.apiUrlHarina
  urlComponentes = environment.apiUrlComponentes
  urlServicioAdministrados = environment.apiUrlServicioAdministrativo

  planta: string = ""

  fecha: any

  descripcionModal: string = ""

  listboxa: any
  listboxb: any
  listboxc: any
  listboxd: any
  listboxe: any
  listboxf: any
  listboxg: any
  listaElementlistboxa: DataList[] = []
  listaElementlistboxb: DataList[] = []
  listaElementlistboxc: DataList[] = []
  listaElementlistboxd: DataList[] = []
  listaElementlistboxe: DataList[] = []
  listaElementlistboxf: DataList[] = []
  listaElementlistboxg: DataList[] = []

  texta: any
  textb: any
  textc: any = 0
  textd: any
  texte: any = 0
  textf: any = 0
  textg: any
  texth: any = 0

  visibleP: boolean = false
  visibleS: boolean = false

  ColumnMode = ColumnMode
  cajonesEnviarArray: any[] = []
  @ViewChild('modalCajon') cajonModal: any

  fechFinCajon: any
  fechInicioCajon: any
  capturainicio: any;
  capturafin: any;

  cajonesArray: any[] = [];
  cajonesSeleccionados: any[] = []

  idtipoproteina: number = 0
  allSelectedRows: boolean = false;

  cajonesHarina: any[] = []
  areaSelectedOption: any = 0
  apiCajonesHarina: string = ""
  apiAreaCajonesHarina: any = this.urlServicioHarina + "/nw-integracion/integracion/obtenerAreas"

  loading: boolean = false;

  constructor(
    private _http: HttpClient,
    private modalService: NgbModal,
    private servicioService: ServicioService,
    private _userService: VerificacionService,
    private _filtrosService: FiltrosService
  ) { }

  modalOpenLG(tipo: any) {
    this.descripcionModal = tipo
    let avanzar: boolean = false
    let mensaje: string = ""
    this.idtipoproteina = 0
    switch (tipo) {
      case "poza":
        if (!this.listboxc) {
          avanzar = true
          mensaje = "Debe seleccionar un horario"
        } else {
          this.idtipoproteina = this.listboxc.data.id_tipo_proteina
          console.log("poza idtp ", this.idtipoproteina)
        }
        break;
      case "sub":
        if (!this.listboxf) {
          avanzar = true
          mensaje = "Debe seleccionar un tipo de proteina"
        } else {
          //console.log("sub  ",this.listboxf)
          this.idtipoproteina = this.listboxf.data.id_tipo_proteina
          console.log("sub idtp ", this.idtipoproteina)
        }
        break;
      default:
        break;
    }

    if (avanzar) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje
      })
    }
    this.areaSelectedOption = 0
    this.modalService.open(this.cajonModal, {
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
      this.planta = user.planta.codplanta
      let tempProceso = user.procesos.find((tp: Proceso) => tp.codproceso == this.nomenclatura);
      if (tempProceso) {
        this.titulo = tempProceso.titulo
      }
      let url = this.urlComponentes + "/listarComponentes/" + user.planta.codplanta + "/" + this.nomenclatura
      this._http.get(url).subscribe(data => {
        if (data["estado"] == "ok") {
          this.itemsFabricacion = this.servicioService.getAds(data["data"]);
          console.log("a ", this.itemsFabricacion)
          if (this.itemsFabricacion.length > 0) {

            let itemRecepcion = this.itemsFabricacion.find(obj => obj.data.data.tag == "recepcion");
            if (itemRecepcion) {
              let data = itemRecepcion.data.data;
              let url: any = data.nwiApi.url
              this.cargarRecepcion(url);
            }

            let itemCertificacion = this.itemsFabricacion.find(obj => obj.data.data.tag == "certificacion");
            if (itemCertificacion) {
              let data = itemCertificacion.data.data;
              let url: any = data.nwiApi.url
              this.cargarCertificacion(url);
            }

            this.cargarCajonesHarina()
          }

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
    }
  }

  ////////////////////////////////

  cargarTipoProteina(url: string) {
    this._http.get(url).subscribe((data: DataList[]) => {
      this.listaElementlistboxf = data
      try {
        if (this.listboxa.respuestaHijo["tipo_harina"]) {
          let tapTH = "tipo_harina"
          let itemTH = this.listaElementlistboxf.find(dataR => dataR.id == this.listboxa.respuestaHijo[tapTH]);
          if (itemTH) {
            //console.log("itemV ", itemH)
            this.listboxf = itemTH
            this.onSelect(tapTH)
          }

        }
      } catch (error) {
      }
      try {
        this.textg = this.listboxf.respuestaHijo["tipo_aceite"]
      } catch (error) {
      }
    },
      error => {
        this.listaElementlistboxf = []
      })
  }

  cargarRecepcion(url: string) {
    this._http.get(url).subscribe((data: DataList[]) => {
      this.listaElementlistboxb = data
    },
      error => {
        this.listaElementlistboxb = []
      })
  }

  cargarCertificacion(url: string) {
    this._http.get(url).subscribe((data: DataList[]) => {
      this.listaElementlistboxe = data
    },
      error => {
        this.listaElementlistboxe = []
      })
  }

  cargarHorarios(url: string) {
    if (this.itemsFabricacion.length == 0) {
      return
    }
    if (!this.fecha) {
      return
    }
    let tag = "fecha"
    let jsonEnvio = new Object()
    jsonEnvio[tag] = this.fecha;
    this._http.post(url, jsonEnvio).subscribe((data: DataList[]) => {
      this.listaElementlistboxc = data
    },
      error => {
        this.listaElementlistboxc = []
      })
  }

  cagarVersionPoza(url: string, horario: any) {
    if (this.itemsFabricacion.length == 0) {
      return
    }
    if (!this.listboxc) {
      return
    }
    let tag = "horario"
    let jsonEnvio = new Object()
    jsonEnvio[tag] = horario;
    this._http.post(url, jsonEnvio).subscribe((data: DataList[]) => {
      this.listaElementlistboxd = data
      try {
        if (this.listboxa.respuestaHijo["version"]) {
          let tapV = "version"
          let itemV = this.listaElementlistboxd.find(dataR => dataR.id == this.listboxa.respuestaHijo[tapV]);
          if (itemV) {
            //console.log("itemV ", itemH)
            this.listboxd = itemV
            this.onSelect(tapV)
          }
        }
      } catch (error) {

      }
    },
      error => {
        this.listaElementlistboxd = []
      })
  }

  cagarVersionSub(url: string, producto: any) {
    if (this.itemsFabricacion.length == 0) {
      return
    }
    if (!this.listboxf) {
      return
    }
    let tag = "tipo_harina"
    let jsonEnvio = new Object()
    jsonEnvio[tag] = producto;
    console.log("el id precargado ", jsonEnvio)
    this._http.post(url, jsonEnvio).subscribe((data: DataList[]) => {
      this.listaElementlistboxg = data
      try {
        if (this.listboxa.respuestaHijo["version"]) {
          let tapV = "version"
          let itemV = this.listaElementlistboxg.find(dataR => dataR.id == this.listboxa.respuestaHijo[tapV]);
          if (itemV) {
            //console.log("itemV ", itemH)
            this.listboxg = itemV
            this.onSelect(tapV)
          }
        }
      } catch (error) {
      }
    },
      error => {
        this.listaElementlistboxg = []
      })
  }

  limpiarComponente() {

    this.descripcionModal = ""

    this.listboxa = null
    this.listboxb = null
    this.listboxc = null
    this.listboxd = null
    this.listboxe = null
    this.listboxf = null
    this.listboxg = null
    this.listaElementlistboxa = []
    this.listaElementlistboxc = []
    this.listaElementlistboxd = []
    this.listaElementlistboxf = []
    this.listaElementlistboxg = []
    this.texta = null
    this.textb = null
    this.textc = 0
    this.textd = null
    this.texte = 0
    this.textf = 0
    this.textg = null
    this.texth = 0
    this.visibleP = false
    this.visibleS = false
    this.cajonesEnviarArray = []
  }

  capturarDate(idc: any, e: any) {
    this.limpiarComponente()
    let captura = null;
    if (e.target.value) {
      captura = e.target.value
      //item = itemsFabricacion[0].data.data.clases
      let item = this.itemsFabricacion.find(obj => obj.data.data.idnwicomponente == idc);
      let data: any
      if (item) {
        data = item.data.data
      }
      let url: any = data.nwiApi.url
      let tag = data.tag
      let jsonEnvio = new Object()
      jsonEnvio[tag] = captura;
      this._http.post(url, jsonEnvio).subscribe((dataR: DataList[]) => {
        if (dataR["status"] == "error") {
          this.listaElementlistboxa = []
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: dataR["mensaje"]
          })
        } else {
          this.listaElementlistboxa = dataR
        }
      }, error => {
        this.listaElementlistboxa = []
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Consulte con sistema"
        })
        return
      })

      try {
        let itemHorario = this.itemsFabricacion.find(obj => obj.data.data.tag == "horario");
        if (itemHorario) {
          let data = itemHorario.data.data;
          let url: any = data.nwiApi.url
          this.cargarHorarios(url);
        }
      } catch (error) {

      }

    } else {
      this.listboxa = null
      this.listboxc = null
      this.listaElementlistboxa = []
      this.listaElementlistboxc = []
    }
  }

  onSelect(idc: any) {
    console.log("idc listbox ", idc)
    switch (idc) {
      case "numero_orden_harina":
        //console.log("data of ", this.listboxa)
        if (this.listboxa) {
          try {
            this.texta = this.listboxa.respuestaHijo["numero_orden_aceite"]
          } catch (error) {
          }
          try {
            this.textb = this.listboxa.respuestaHijo["tipo_harina"]
          } catch (error) {
          }
          try {
            this.textd = this.listboxa.respuestaHijo["tipo_aceite"]
          } catch (error) {
          }
          try {
            this.textg = this.listboxa.respuestaHijo["tipo_aceite"]
          } catch (error) {
          }
          try {
            let tapR = "recepcion"
            let itemR = this.listaElementlistboxb.find(dataR => dataR.id == this.listboxa.respuestaHijo[tapR]);
            if (itemR) {
              console.log("itemR ", itemR)
              this.listboxb = itemR
              this.onSelect(tapR)
            }
          } catch (error) {
          }
          try {
            let tapH = "horario"
            let itemH = this.listaElementlistboxc.find(dataR => dataR.id == this.listboxa.respuestaHijo[tapH]);
            if (itemH) {
              console.log("itemR ", itemH)
              this.listboxc = itemH
              this.onSelect(tapH)
            }
          } catch (error) {
          }
          try {
            let tapC = "certificacion"
            let itemC = this.listaElementlistboxe.find(dataR => dataR.id == this.listboxa.respuestaHijo[tapC]);
            if (itemC) {
              console.log("itemR ", itemC)
              this.listboxe = itemC
              this.onSelect(tapC)
            }
          } catch (error) {
          }
          console.log("estos son los cajones a", this.listboxa)
          console.log("estos son los cajones ", this.listboxa.respuestaHijo["cajones"])
          this.cajonesSeleccionados = []
          try {
            let temp = this.listboxa.respuestaHijo["cajones"]
            temp.forEach((cajonElement: any) => {
              cajonElement.sel = false;
            });
            this.cajonesEnviarArray = temp
          } catch (error) {
            this.cajonesEnviarArray = []
          }
          console.log("estos son los cajones b", this.cajonesEnviarArray)
          try {
            this.textc = this.listboxa.respuestaHijo["cantidad_harina"]
          } catch (error) {
          }
          try {
            this.texte = this.listboxa.respuestaHijo["cantidad_aceite"]
          } catch (error) {
          }
          try {
            this.textf = this.listboxa.respuestaHijo["cantidad_harina"]
          } catch (error) {
          }
          try {
            this.texth = this.listboxa.respuestaHijo["cantidad_aceite"]
          } catch (error) {
          }
        } else {
          this.texta = null
          this.textb = null
          this.textc = null
          this.textd = null
          this.texte = null
          this.textf = null
          this.textg = null
          this.texth = null
        }
        break;
      case "recepcion":
        console.log("select recepcion ", this.listboxb)
        if (this.listaElementlistboxb.length > 0) {
          switch (this.listboxb.respuestaHijo.campo) {
            case "P":
              this.visibleP = true
              this.visibleS = false
              //this.listboxf = null
              //this.listaElementlistboxf = []
              this.descripcionModal = "poza"
              break;
            case "S":
              this.visibleP = false
              this.visibleS = true
              this.descripcionModal = "sub"
              let itemTipoProteina = this.itemsFabricacion.find(obj => obj.data.data.tag == "tipo_harina" && obj.data.data.tipodato == "object");
              if (itemTipoProteina) {
                let data = itemTipoProteina.data.data;
                let url: any = data.nwiApi.url
                this.cargarTipoProteina(url);
              }
              break;
            default:
              break;
          }
        }
        break
      case "horario":
        console.log("ingreso al select horario")
        if (this.listboxc) {
          console.log("ingreso al select horario b ", this.listboxc)
          let itemVersion = this.itemsFabricacion.find(obj => obj.data.data.tag == "version" && obj.data.data.accion == "poza");
          if (itemVersion) {
            let data = itemVersion.data.data;
            let url: any = data.nwiApi.url
            this.cagarVersionPoza(url, this.listboxc.respuestaHijo["horario"]);
          }

          this.textb = this.listboxc.respuestaHijo["tipo_harina"]
          this.textc = this.listboxc.respuestaHijo["cantidad_harina"]
          this.textd = this.listboxc.respuestaHijo["tipo_aceite"]
          this.texte = this.listboxc.respuestaHijo["cantidad_aceite"]

        } else {
          this.listboxd = null
          this.listaElementlistboxd = []
        }
        break;
      case "tipo_harina":
        console.log("evision ", this.listboxf)
        if (this.listboxf) {
          let itemVersion = this.itemsFabricacion.find(obj => obj.data.data.tag == "version" && obj.data.data.accion == "sub");
          if (itemVersion) {
            let data = itemVersion.data.data;
            let url: any = data.nwiApi.url
            this.cagarVersionSub(url, this.listboxf.respuestaHijo["tipo_harina"]);
          }
        }


        break
      default:
        break;
    }
  }

  cerrarModalCajon() {
    //let idtemporal = this.idCompCajon
    let arrayTemportal = this.cajonesEnviarArray
    let tempFiltros = this._filtrosService.filtrosValue;

    this.modalService.dismissAll("ok")
  }

  cargarCajonesHarina() {
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
  }

  capturarDateInicio(e: any) {
    this.capturainicio = e.target.value;
  }

  capturarDateFin(e: any) {
    this.capturafin = e.target.value;
  }

  buscarCajon() {
    this.loading = true
    this.cajonesArray = []
    this.cajonesSeleccionados = []
    let info = {
      "fechainicio": this.capturainicio,
      "fechafin": this.capturafin,
      "area": this.areaSelectedOption,
      "id_tipo_proteina": this.idtipoproteina
    }
    this._http.post(this.apiCajonesHarina, info).subscribe((data: any[]) => {
      if (data["status"] === "error") {
        this.loading = false
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
        this.loading = false
      } catch (error) {
        this.cajonesArray = []
        this.loading = false
      }
    },
      error => {
        this.loading = false
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un problema con el servidor consulte a sistemas'
        })
      })
  }

  onDeleteCajon(row: any) {
    switch (this.descripcionModal) {
      case "poza":
        let sumaHarina = Number(this.textc) - Number(row.cantidad_harina)
        let decimalesH = Math.round(sumaHarina * 100) / 100;
        this.textc = decimalesH;

        let sumaAceite = Number(this.texte) - Number(row.cantidad_aceite)
        let decimalesA = Math.round(sumaAceite * 100) / 100;
        this.texte = decimalesA;
        break;
      case "sub":
        let sumaHarinab = Number(this.textf) - Number(row.cantidad_harina)
        let decimalesHb = Math.round(sumaHarinab * 100) / 100;
        this.textf = decimalesHb;

        let sumaAceiteb = Number(this.texth) - Number(row.cantidad_aceite)
        let decimalesAb = Math.round(sumaAceiteb * 100) / 100;
        this.texth = decimalesAb;
        break;
      default:
        break;
    }

    const resultado = this.cajonesEnviarArray.filter(cajon => cajon.id !== row.id);
    this.cajonesEnviarArray = resultado
  }

  checkedCajonRow(row: any) {
    if (row.sel) {
      return true
    }
    return false;
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

  aggCajon() {
    //let idtemporal = this.idCompCajon;
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

    console.log("cajones seleccionado ", this.cajonesSeleccionados)

    if (this.cajonesEnviarArray.length > 0) {
      this.cajonesEnviarArray = this.cajonesEnviarArray.concat(this.cajonesSeleccionados);
    } else {
      this.cajonesEnviarArray = JSON.parse(JSON.stringify(this.cajonesSeleccionados))
    }
    console.log("harina", this.textc)
    console.log("aceite", this.texte)
    switch (this.descripcionModal) {
      case "poza":
        this.cajonesSeleccionados.forEach((element: any) => {

          let sumaHarina = Number(this.textc) + Number(element.cantidad_harina)
          let decimalesH = Math.round(sumaHarina * 100) / 100;
          this.textc = decimalesH;

          let sumaAceite = Number(this.texte) + Number(element.cantidad_aceite)
          let decimalesA = Math.round(sumaAceite * 100) / 100;
          this.texte = decimalesA;

        });
        break;
      case "sub":
        this.cajonesSeleccionados.forEach((element: any) => {

          let sumaHarina = Number(this.textf) + Number(element.cantidad_harina)
          let decimalesH = Math.round(sumaHarina * 100) / 100;
          this.textf = decimalesH;

          let sumaAceite = Number(this.texth) + Number(element.cantidad_aceite)
          let decimalesA = Math.round(sumaAceite * 100) / 100;
          this.texth = decimalesA;

        });
        break;
      default:
        break;
    }

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

    console.log("cajones ", this.cajonesEnviarArray)
  }

  enviar(tipo: string, tag: string) {
    if (!this.listboxa) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Debe seleccionar una orden"
      })
      return;
    }
    switch (tipo) {
      case "poza":
        this.enviarPoza(tipo, tag)
        break;
      case "sub":
        this.enviarSub(tipo, tag)
        break;
      default:
        break;
    }
  }

  enviarPoza(tipo: string, tag: string) {
    if (!this.listboxc) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Debe seleccionar un horario"
      })
    }
    if (!this.textc) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Debe ingresar una cantidad de harina"
      })
    }
    if (!this.texte) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Debe ingresar una cantidad de aceite"
      })
    }
    let jsonEnvio = {
      "numero_orden_harina": this.listboxa,
      "horario": this.listboxc,
      "cantidad_harina": Number(this.textc),
      "cantidad_aceite": Number(this.texte),
      "cajones": this.cajonesEnviarArray
    }

    let item = this.itemsFabricacion.find(obj => obj.data.data.tag == tag && obj.data.data.accion == tipo);
    if (item) {
      let data = item.data.data;
      let url: any = data.nwiApi.url
      console.log("url", url)
      console.log("jsonEnvio", jsonEnvio)
      this.loading = true;
      this._http.post(url, jsonEnvio).subscribe((dataRes: any) => {
        console.log("respuesta ", dataRes.data.estado)
        if (dataRes.data.estado == "error") {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: dataRes.data.mensaje
          })
        } else {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Enviado',
            text: dataRes.data.mensaje
          })
          this.fecha = null
          this.limpiarComponente()
        }
      },
        error => {
          this.loading = false;
          console.log("respuesta error ", error)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Ocurrio un problem,consulte con sistema"
          })
          this.fecha = null
          this.limpiarComponente()
        })
    }

  }

  enviarSub(tipo: string, tag: string) {
    if (!this.listboxf) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Debe seleccionar un tipo de proteina"
      })
    }
    if (!this.textf) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Debe ingresar una cantidad de harina"
      })
    }
    if (!this.texth) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Debe ingresar una cantidad de aceite"
      })
    }
    let jsonEnvio = {
      "numero_orden_harina": this.listboxa,
      "tipo_harina": this.listboxf,
      "cantidad_harina": Number(this.textf),
      "cantidad_aceite": Number(this.texth),
      "cajones": this.cajonesEnviarArray
    }

    let item = this.itemsFabricacion.find(obj => obj.data.data.tag == tag && obj.data.data.accion == tipo);
    if (item) {
      let data = item.data.data;
      let url: any = data.nwiApi.url
      console.log("url", url)
      console.log("jsonEnvio", jsonEnvio)
      this.loading = true;
      this._http.post(url, jsonEnvio).subscribe((dataRes: any) => {
        console.log("respuesta ", dataRes.data.estado)
        if (dataRes.data.estado == "error") {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: dataRes.data.mensaje
          })
        } else {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Enviado',
            text: dataRes.data.mensaje
          })
          this.fecha = null
          this.limpiarComponente()
        }
      },
        error => {
          this.loading = false;
          console.log("respuesta error ", error)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Ocurrio un problem,consulte con sistema"
          })
          this.fecha = null
          this.limpiarComponente()
        })
    }

  }

}