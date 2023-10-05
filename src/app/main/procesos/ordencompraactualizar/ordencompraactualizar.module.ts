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
import { OrdencompraactualizarComponent } from './ordencompraactualizar.component';
import { ActualizarDirective } from 'app/main/directivas/procesos/orden-compra-actualizar-directiva/actualizar.directive';
import { OrdenCompraActualizarDirectivaComponent } from 'app/main/directivas/procesos/orden-compra-actualizar-directiva/orden-compra-actualizar-directiva.component';


const routes: Routes = [
  {
    path: 'ordencompraactulizar',
    component: OrdencompraactualizarComponent,
    data: {
      proceso : "aoc"
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    ActualizarDirective,
    OrdencompraactualizarComponent,
    OrdenCompraActualizarDirectivaComponent
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
export class OrdenFabricacionModule {}