import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appConsumo]'
})
export class ConsumoDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
