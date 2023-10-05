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
import { NotificacionComponent } from './notificacion.component';
import { NotificacionDirectivaComponent } from 'app/main/directivas/procesos/notificacion-directiva/notificacion-directiva.component';
import { NotificacionDirective } from 'app/main/directivas/procesos/notificacion-directiva/notificacion.directive';
import { AuthGuard } from 'app/auth/helpers';
import { NotificacionService } from './notificacion.service';

const routes: Routes = [
  {
    path: 'notificacion',
    component: NotificacionComponent,
    data: {
      proceso : "ntf",
    },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  declarations: [
    NotificacionComponent,
    NotificacionDirective,
    NotificacionDirectivaComponent
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
  providers: [NotificacionService]
})
export class NotificacionModule {}