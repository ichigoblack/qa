import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdItem } from '../../ad-item';
import { AdComponent } from '../../ad.component';
import { EntradaDirective } from './entrada.directive';

@Component({
  selector: 'app-entrada-mercancia-directiva',
  templateUrl: './entrada-mercancia-directiva.component.html',
  styleUrls: ['./entrada-mercancia-directiva.component.scss']
})
export class EntradaMercanciaDirectivaComponent implements OnInit {
  
  @Input() ads: AdItem[] = [];

  @ViewChild(EntradaDirective, {static: true}) appEntrada!: EntradaDirective;
  
  constructor() { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.appEntrada.viewContainerRef;
    viewContainerRef.clear();
    for (let index = 0; index < this.ads.length; index++) {
      const adItem = this.ads[index];
      const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component);
      componentRef.instance.data = adItem.data;
    }
  }

}
