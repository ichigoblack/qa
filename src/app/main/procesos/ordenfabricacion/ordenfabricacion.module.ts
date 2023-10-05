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
import { OrdenfabricacionComponent } from './ordenfabricacion.component';
import { FabricacionDirective } from 'app/main/directivas/procesos/orden-fabricacion-directiva/fabricacion.directive';
import { OrdenFabricacionDirectivaComponent } from 'app/main/directivas/procesos/orden-fabricacion-directiva/orden-fabricacion-directiva.component';


const routes: Routes = [
  {
    path: 'ordenfabricacion',
    component: OrdenfabricacionComponent,
    data: {
      proceso : "ofb"
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    FabricacionDirective,
    OrdenfabricacionComponent,
    OrdenFabricacionDirectivaComponent
],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule
  ],
  providers: []
})
export class OrdenCompraActualizarModule {} 