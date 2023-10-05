import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appFabricacionActualizar]'
})
export class OrdenFabricacionActualizarDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
