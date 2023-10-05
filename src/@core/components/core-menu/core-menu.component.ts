import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreMenu } from '@core/types';
import { VerificacionService } from 'app/auth/service';
import { User } from 'app/auth/models/seguridad/user';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: CoreMenu[] = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _coreMenuService: CoreMenuService,
    private _userService: VerificacionService
  ) {
    this._userService.user.subscribe(x => {
      if (x) {
        this.currentUser = x;
        let menuDinamico: CoreMenu[];
        let childrenTemp = [];
        let control = {
          "id": "control",
          "title": "Monitor Transaccional",
          "type": "item",
          "icon": "circle",
          "url": "proceso/monitor"
        }
        childrenTemp.push(control);
        if(x.procesos.length>0){
          x.procesos.forEach((element:any) => {
            let temp = {
              "id": element["idopcion"],
              "title": element["opcion"],
              "type": "item",
              "icon": "circle",
              "url": element["vista"]
            }
            childrenTemp.push(temp);
          });
        }
        menuDinamico = [
          {
            "id": "1",
            "title": "Procesos",
            "type": "collapsible",
            "icon": "file-text",
            "children": childrenTemp,
            "classes": "align-items-center"
          }
        ];
        this.menu = menuDinamico;
      }else{
        console.log("algo pasa aqui")
      }
    })
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  }

  /*cargarMenu(user: User): CoreMenu[] {
    //let user = JSON.parse(localStorage.getItem('usuarioIntegrador'));
    let menuDinamicoPadre = [];
    let menuDinamico: CoreMenu[];
    let bandera = false;
    menuDinamico = [
      {
        "id": "62c31b3158710000750020c2",
        "title": "Procesos",
        "type": "collapsible",
        "icon": "file-text",
        "children": [
          {
            "id": "62c31b6e58710000750020c3",
            "title": "Orden Compra",
            "type": "item",
            "icon": "circle",
            "url": "harina/orden-produccion/realizar-orden"
          },
          {
            "id": "62cecf4f543b00001e003346",
            "title": "Notificacion",
            "type": "item",
            "icon": "circle",
            "url": "harina/orden-produccion/seleccionar-orden"
          }
        ],
        "classes": "align-items-center"
      }
    ];
    var mnu: CoreMenu[] = menuDinamico;
    return mnu;
  };*/
}
