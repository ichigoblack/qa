import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdItem } from '../../ad-item';
import { AdComponent } from '../../ad.component';
import { OrdenFabricacionActualizarDirective } from './fabricacion-actualizar.directive';

@Component({
  selector: 'app-orden-fabricacion-actualizar-directiva',
  templateUrl: './orden-fabricacion-actualizar-directiva.component.html',
  styleUrls: ['./orden-fabricacion-actualizar-directiva.component.scss']
})
export class OrdenFabricacionActualizarDirectivaComponent implements OnInit {

  @Input() ads: AdItem[] = [];
  @ViewChild(OrdenFabricacionActualizarDirective, {static: true}) appFabricacionActualizar!: OrdenFabricacionActualizarDirective;

  constructor() { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.appFabricacionActualizar.viewContainerRef;
    viewContainerRef.clear();
    for (let index = 0; index < this.ads.length; index++) {
      const adItem = this.ads[index];
      const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component);
      componentRef.instance.data = adItem.data;
    }
  }

}