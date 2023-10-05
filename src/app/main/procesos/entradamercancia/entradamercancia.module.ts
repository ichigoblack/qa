import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
//import { DatatablesComponent } from './datatables.component';

import { EntradamercanciaComponent } from './entradamercancia.component';
import { EntradaDirective } from 'app/main/directivas/procesos/entrada-mercancia-directiva/entrada.directive';
import { EntradaMercanciaDirectivaComponent } from 'app/main/directivas/procesos/entrada-mercancia-directiva/entrada-mercancia-directiva.component';
import { AuthGuard } from 'app/auth/helpers';
//import { DatatablesService } from './datatables.service';

const routes: Routes = [
  {
    path: 'entradamercaderia',
    component: EntradamercanciaComponent,
    data: {
      proceso : "etm"
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    EntradaDirective,
    EntradamercanciaComponent,
    EntradaMercanciaDirectivaComponent
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
export class EntradaMercanciaModule {}