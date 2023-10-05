import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appFabricacion]'
})
export class FabricacionDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
