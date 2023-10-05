import { NgModule } from '@angular/core';

import { MonitorModule } from './monitor/monitor.module';
import { OrdenCompraModule } from './ordencompra/ordencompra.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { EntradaMercanciaModule } from './entradamercancia/entradamercancia.module';
import { OrdenCompraActualizarModule } from './ordenfabricacion/ordenfabricacion.module';
import { OrdenFabricacionModule } from './ordencompraactualizar/ordencompraactualizar.module';
import { OrdenFabricacionActualizarModule } from './ordenfabricacionactualizar/ordenfabricacionactualizar.module';
import { MantenimientoModule } from './mantenimientonotificaciones/mantenimiento.module';
import { MonitorresumenModule } from './monitorresumen/monitorresumen.module';

@NgModule({
  declarations: [
  ],
  imports: [
    MonitorModule,
    OrdenCompraModule,
    NotificacionModule,
    MantenimientoModule,
    MonitorresumenModule,
    EntradaMercanciaModule,
    OrdenFabricacionModule,
    OrdenCompraActualizarModule,
    OrdenFabricacionActualizarModule
  ]
})
export class ProcesoModule {}