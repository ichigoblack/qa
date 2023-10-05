import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appNotificacion]'
})
export class NotificacionDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
