import { Directive, ElementRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDirectiva]'
})
export class DirectivaDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { 
  }

}
