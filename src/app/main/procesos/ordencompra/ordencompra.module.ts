import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { OrdencompraComponent } from './ordencompra.component';
import { OrdenCompraDirectivaComponent } from 'app/main/directivas/procesos/orden-compra-directiva/orden-compra-directiva.component';
import { DirectivaDirective } from 'app/main/directivas/procesos/orden-compra-directiva/directiva.directive';
import { AuthGuard } from 'app/auth/helpers';


const routes: Routes = [
  {
    path: 'ordencompra',
    component: OrdencompraComponent,
    data: {
      proceso : "coc"
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    DirectivaDirective,
    OrdencompraComponent,
    OrdenCompraDirectivaComponent
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
export class OrdenCompraModule {}