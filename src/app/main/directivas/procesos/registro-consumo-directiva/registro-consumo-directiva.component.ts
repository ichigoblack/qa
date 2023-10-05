import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdItem } from '../../ad-item';
import { AdComponent } from '../../ad.component';
import { ConsumoDirective } from './consumo.directive';

@Component({
  selector: 'app-registro-consumo-directiva',
  templateUrl: './registro-consumo-directiva.component.html',
  styleUrls: ['./registro-consumo-directiva.component.scss']
})
export class RegistroConsumoDirectivaComponent implements OnInit {

  @Input() ads: AdItem[] = [];

  @ViewChild(ConsumoDirective, {static: true}) appConsumo!: ConsumoDirective;

  constructor() { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.appConsumo.viewContainerRef;
    viewContainerRef.clear();
    for (let index = 0; index < this.ads.length; index++) {
      const adItem = this.ads[index];
      const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component);
      componentRef.instance.data = adItem.data;
    }
  }

}