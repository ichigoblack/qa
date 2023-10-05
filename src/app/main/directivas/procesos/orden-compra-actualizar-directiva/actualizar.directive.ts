import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appActualizar]'
})
export class ActualizarDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
