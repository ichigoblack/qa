import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';


import { AuthGuard } from 'app/auth/helpers';
import { OrdenfabricacionactualizarComponent } from './ordenfabricacionactualizar.component';
import { OrdenFabricacionActualizarDirective } from 'app/main/directivas/procesos/orden-fabricacion-actualizar-directiva/fabricacion-actualizar.directive';
import { OrdenFabricacionActualizarDirectivaComponent } from 'app/main/directivas/procesos/orden-fabricacion-actualizar-directiva/orden-fabricacion-actualizar-directiva.component';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [
  {
    path: 'ordenfabricacionactualizar',
    component: OrdenfabricacionactualizarComponent,
    data: {
      proceso : "aof"
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    OrdenFabricacionActualizarDirective,
    OrdenfabricacionactualizarComponent,
    OrdenFabricacionActualizarDirectivaComponent
],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    NgSelectModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule
  ],
  providers: []
})
export class OrdenFabricacionActualizarModule {} 