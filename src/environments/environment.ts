// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  apiUrl: 'http://localhost:9091',

  apiUrlHarina:  'http://172.17.17.13:6003',
  apiUrlSockect: 'http://172.17.17.13:8082',
  apiValidacion: 'http://172.17.17.13:9004',
  apiAuth: 'http://172.17.17.14:4041',
  apiNotificacion: 'http://172.17.17.13:9002',
  apiUrlComponentes: 'http://172.17.17.13:9002',
  apiUrlServicioAdministrativo: 'http://172.17.17.13:6002',
  apiUrlGateway: 'http://172.17.17.13:9091',

  //pertenece al gateway de NW
  
  /*
  apiUrlGateway: 'http://ms-gateway-prd.nirsa.com',
  apiUrlSockect: 'http://ms-monitor-integraciones-prd.nirsa.com:8080',
  apiUrlHarina:  'http://ms-harina-prd.nirsa.com',
  apiValidacion: 'http://ms-auth-integraciones-prd.nirsa.com',
  apiAuth: 'http://ms-auth-prd.nirsa.com',
  apiNotificacion: 'http://ms-integraciones-prd.nirsa.com',
  apiUrlComponentes: 'http://ms-integraciones-prd.nirsa.com',
  apiUrlServicioAdministrativo: 'http://ms-administrativo-prd.nirsa.com',
  */
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
