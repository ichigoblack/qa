import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MonitorresumenComponent} from './monitorresumen.component';
import { AuthGuard } from 'app/auth/helpers';

const routes: Routes = [
  {
    path: 'monitor_resumen',
    component: MonitorresumenComponent,
    data: {
      proceso : "mdr"
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [MonitorresumenComponent],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule
  ]
})
export class MonitorresumenModule { }
