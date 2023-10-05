import { Component, Inject, OnDestroy, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as Waves from 'node-waves';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { CoreTranslationService } from '@core/services/translation.service';

//import { menu } from 'app/menu/menu';
import { locale as menuEnglish } from 'app/menu/i18n/en';
import { locale as menuFrench } from 'app/menu/i18n/fr';
import { locale as menuGerman } from 'app/menu/i18n/de';
import { locale as menuPortuguese } from 'app/menu/i18n/pt';

import { ActivatedRoute } from '@angular/router';
import { User } from './auth/models/seguridad/user';
import {VerificacionService} from './../app/auth/service/verificacion.service'
import { Planta } from './auth/models/seguridad/planta';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { Proceso } from './auth/models/proceso';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  coreConfig: any;
  menu: any;
  defaultLanguage: 'es'; // This language will be used as a fallback when a translation isn't found in the current language
  appLanguage: 'es'; // Set application default language i.e fr
  urlValidacion = environment.apiValidacion;
  //urlValidacion = environment.apiAuth;
  urlAuth = environment.apiAuth;
  // Private
  private _unsubscribeAll: Subject<any>;
  usuario: any;

  /**
   * Constructor
   *
   * @param {DOCUMENT} document
   * @param {Title} _title
   * @param {Renderer2} _renderer
   * @param {ElementRef} _elementRef
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CoreLoadingScreenService} _coreLoadingScreenService
   * @param {CoreMenuService} _coreMenuService
   * @param {CoreTranslationService} _coreTranslationService
   * @param {TranslateService} _translateService
   */
  constructor(
    private _verificacion:VerificacionService,
    private route: ActivatedRoute,
    private _router: Router,
    private _http: HttpClient,
    @Inject(DOCUMENT) private document: any,
    private _title: Title,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    public _coreConfigService: CoreConfigService,
    private _coreSidebarService: CoreSidebarService,
    private _coreLoadingScreenService: CoreLoadingScreenService,
    private _coreMenuService: CoreMenuService,
    private _coreTranslationService: CoreTranslationService,
    private _translateService: TranslateService
  ) {
    // Get the application main menu
    
    //this.menu = menu;

    // Register the menu to the menu service
    this._coreMenuService.register('main', this.menu);

    // Set the main menu as our current menu
    this._coreMenuService.setCurrentMenu('main');

    // Add languages to the translation service
    this._translateService.addLangs(['en', 'fr', 'de', 'pt']);

    // This language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang('en');

    // Set the translations for the menu
    this._coreTranslationService.translate(menuEnglish, menuFrench, menuGerman, menuPortuguese);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Init wave effect (Ripple effect)
    //elimina el local storege
    
    Waves.init();

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;

      // Set application default language.

      // Change application language? Read the ngxTranslate Fix

      // ? Use app-config.ts file to set default language
      const appLanguage = this.coreConfig.app.appLanguage || 'en';
      this._translateService.use(appLanguage);

      // ? OR
      // ? User the current browser lang if available, if undefined use 'en'
      // const browserLang = this._translateService.getBrowserLang();
      // this._translateService.use(browserLang.match(/en|fr|de|pt/) ? browserLang : 'en');

      /**
       * ! Fix : ngxTranslate
       * ----------------------------------------------------------------------------------------------------
       */

      /**
       *
       * Using different language than the default ('en') one i.e French?
       * In this case, you may find the issue where application is not properly translated when your app is initialized.
       *
       * It's due to ngxTranslate module and below is a fix for that.
       * Eventually we will move to the multi language implementation over to the Angular's core language service.
       *
       **/

      // Set the default language to 'en' and then back to 'fr'.

      setTimeout(() => {
        this._translateService.setDefaultLang('en');
        this._translateService.setDefaultLang(appLanguage);
      });

      /**
       * !Fix: ngxTranslate
       * ----------------------------------------------------------------------------------------------------
       */

      // Layout
      //--------

      // Remove default classes first
      this._elementRef.nativeElement.classList.remove(
        'vertical-layout',
        'vertical-menu-modern',
        'horizontal-layout',
        'horizontal-menu'
      );
      // Add class based on config options
      if (this.coreConfig.layout.type === 'vertical') {
        this._elementRef.nativeElement.classList.add('vertical-layout', 'vertical-menu-modern');
      } else if (this.coreConfig.layout.type === 'horizontal') {
        this._elementRef.nativeElement.classList.add('horizontal-layout', 'horizontal-menu');
      }

      // Navbar
      //--------

      // Remove default classes first
      this._elementRef.nativeElement.classList.remove(
        'navbar-floating',
        'navbar-static',
        'navbar-sticky',
        'navbar-hidden'
      );

      // Add class based on config options
      if (this.coreConfig.layout.navbar.type === 'navbar-static-top') {
        this._elementRef.nativeElement.classList.add('navbar-static');
      } else if (this.coreConfig.layout.navbar.type === 'fixed-top') {
        this._elementRef.nativeElement.classList.add('navbar-sticky');
      } else if (this.coreConfig.layout.navbar.type === 'floating-nav') {
        this._elementRef.nativeElement.classList.add('navbar-floating');
      } else {
        this._elementRef.nativeElement.classList.add('navbar-hidden');
      }
      
      // Remove default classes first
      this._elementRef.nativeElement.classList.remove('footer-fixed', 'footer-static', 'footer-hidden');

      // Add class based on config options
      if (this.coreConfig.layout.footer.type === 'footer-sticky') {
        this._elementRef.nativeElement.classList.add('footer-fixed');
      } else if (this.coreConfig.layout.footer.type === 'footer-static') {
        this._elementRef.nativeElement.classList.add('footer-static');
      } else {
        this._elementRef.nativeElement.classList.add('footer-hidden');
      }

      // Blank layout
      if (
        this.coreConfig.layout.menu.hidden &&
        this.coreConfig.layout.footer.hidden
      ) {
        this._elementRef.nativeElement.classList.add('blank-page');
        // ! Fix: Transition issue while coming from blank page
        this._renderer.setAttribute(
          this._elementRef.nativeElement.getElementsByClassName('app-content')[0],
          'style',
          'transition:none'
        );
      } else {
        this._elementRef.nativeElement.classList.remove('blank-page');
        // ! Fix: Transition issue while coming from blank page
        setTimeout(() => {
          this._renderer.setAttribute(
            this._elementRef.nativeElement.getElementsByClassName('app-content')[0],
            'style',
            'transition:300ms ease all'
          );
        }, 0);
        // Menu (Vertical menu hidden)
        if (this.coreConfig.layout.menu.hidden) {
          this._renderer.setAttribute(this._elementRef.nativeElement, 'data-col', '1-column');
        } else {
          this._renderer.removeAttribute(this._elementRef.nativeElement, 'data-col');
        }
        // Footer
        if (this.coreConfig.layout.footer.hidden) {
          this._elementRef.nativeElement.classList.add('footer-hidden');
        }
      }

      // Skin Class (Adding to body as it requires highest priority)
      if (this.coreConfig.layout.skin !== '' && this.coreConfig.layout.skin !== undefined) {
        this.document.body.classList.remove('default-layout', 'bordered-layout', 'dark-layout', 'semi-dark-layout');
        this.document.body.classList.add(this.coreConfig.layout.skin + '-layout');
      }
    });

    // Set the application page title
    this._title.setTitle(this.coreConfig.app.appTitle);
    /*
    let usertemporal = {
      "idvalidacionusuario": 102,
      "idusuario": "deflor",
      "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pZWwiLCJpYXQiOjE2NjE4Mjg4MTUsImV4cCI6MTY2MTkxNTIxNX0.qYR5sw9G__flmWvd9DereGSKzY06ieH_ysYwMK0Wz0iPPgMuS-SNxuAQAN_7Y448Hu0i5uIEku4chYOnwnaV5A",
      "fechaRegistro": "2022-08-30T00:00:00.000+00:00",
      "planta": {
        "idnwiplanta": 3,
        "codplanta": "PH",
        "descripcion": "PLANTA HARINA"
      },
      "estado": "A",
      "procesos": [
        {
          "idopcion": "1",
          "opcion": "Crear Orden Compra",
          "vista": "proceso/ordencompra",
          "codigo": "coc",
          "titulo": "Orden Compra Harina"
        },
        {
          "idopcion": "2",
          "opcion": "Actualizar Orden Compra",
          "vista": "proceso/ordencompraactulizar",
          "codigo": "aoc",
          "titulo": "Actualizar Compra Harina"
        },
        {
          "idopcion": "3",
          "opcion": "Entrada de mercaderia",
          "vista": "proceso/entradamercaderia",
          "codigo": "etm",
          "titulo": "Entrada de mercaderia Harina"
        },
        {
          "usuario": "1234",
          "idopcion": "4",
          "opcion": "Orden de fabricacion",
          "vista": "proceso/ordenfabricacion",
          "codigo": "ofb",
          "titulo": "Orden de Fabricacion Harina"
        },
        {
          "idopcion": "5",
          "opcion": "Notificacion",
          "vista": "proceso/notificacion",
          "codigo": "ntf",
          "titulo": "Notificacion Harina"
        }
      ]
    }*/
    
    const user = this._verificacion.userValue;
    
    console.log("temporal 2 ",user)

    if(user){
      this._router.navigate(['/dashboard/ecommerce']);
      return;
    }

    /*this._verificacion.asignacion(usertemporal)
    
    let temp = this._verificacion.userValue;
    
    if(temp){
      this._router.navigate(['/dashboard/ecommerce']);
      return;
    }*/
    
    this.route.queryParams
    .subscribe(params => {
      
      let usuTemp = params["usuario"];
      let plaTemp = params["planta"];
      if(usuTemp&&plaTemp){
        let url = this.urlValidacion+"/auth/verificartoken/"+usuTemp+"/"+plaTemp;
        this._http.get(url).subscribe(data => {
          if(data["estado"]==="ok"){
            let tempUser:User = data["data"];
            this._http.get(this.urlAuth+'/auth/listarPermisos/'+usuTemp+'/'+plaTemp).subscribe(
            dataP => {
              console.log("permisos ",dataP)
              let procesosTemp:Proceso[] = []
              if(dataP["estado"] == "ok"){
                procesosTemp = dataP["data"];
              }
              tempUser.procesos = procesosTemp;
              this._verificacion.asignacion(tempUser);

              sessionStorage.setItem('usuarioIntegrador', JSON.stringify(tempUser));
              
              this._router.navigate(['/dashboard/ecommerce']);
              
              location.reload()
              //window.location.reload();
            },
            error =>{
              tempUser.procesos = [];
              this._verificacion.asignacion(tempUser);
              sessionStorage.setItem('usuarioIntegrador', JSON.stringify(tempUser));
              this._router.navigate(['/dashboard/ecommerce']);
              location.reload()
            })
          }
        },
        error => {
          this._router.navigate(['/pages/miscellaneous/not-authorized']);
        });
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebar(key): void {
    this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }
}