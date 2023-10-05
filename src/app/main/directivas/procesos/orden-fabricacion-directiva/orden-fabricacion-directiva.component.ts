import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdItem } from '../../ad-item';
import { AdComponent } from '../../ad.component';
import { FabricacionDirective } from './fabricacion.directive';

@Component({
  selector: 'app-orden-fabricacion-directiva',
  templateUrl: './orden-fabricacion-directiva.component.html',
  styleUrls: ['./orden-fabricacion-directiva.component.scss']
})
export class OrdenFabricacionDirectivaComponent implements OnInit {

  @Input() ads: AdItem[] = [];

  @ViewChild(FabricacionDirective, {static: true}) appFabricacion!: FabricacionDirective;

  constructor() { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.appFabricacion.viewContainerRef;
    viewContainerRef.clear();
    for (let index = 0; index < this.ads.length; index++) {
      const adItem = this.ads[index];
      const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component);
      componentRef.instance.data = adItem.data;
    }
  }
}
