import { AdItem } from '../../ad-item';
import { AdComponent } from '../../ad.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActualizarDirective } from './actualizar.directive';

@Component({
  selector: 'app-orden-compra-actualizar-directiva',
  templateUrl: './orden-compra-actualizar-directiva.component.html',
  styleUrls: ['./orden-compra-actualizar-directiva.component.scss']
})

export class OrdenCompraActualizarDirectivaComponent implements OnInit {

  @Input() itemsActualizar: AdItem[] = [];
  
  @ViewChild(ActualizarDirective, {static: true}) appActualizar!: ActualizarDirective;
  
  constructor() { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.appActualizar.viewContainerRef;
    viewContainerRef.clear();
    for (let index = 0; index < this.itemsActualizar.length; index++) {
      const adItem = this.itemsActualizar[index];
      const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component);
      componentRef.instance.data = adItem.data;
    }
  }
}