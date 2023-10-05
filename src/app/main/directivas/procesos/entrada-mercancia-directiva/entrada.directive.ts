import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appEntrada]'
})
export class EntradaDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}