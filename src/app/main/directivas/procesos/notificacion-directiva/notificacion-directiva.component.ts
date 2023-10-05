import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdItem } from '../../ad-item';
import { AdComponent } from '../../ad.component';
import { NotificacionDirective } from './notificacion.directive';

@Component({
  selector: 'app-notificacion-directiva',
  templateUrl: './notificacion-directiva.component.html',
  styleUrls: ['./notificacion-directiva.component.scss']
})
export class NotificacionDirectivaComponent implements OnInit {

  @Input() ads: AdItem[] = [];

  @ViewChild(NotificacionDirective, {static: true}) appNotificacion!: NotificacionDirective;

  constructor() { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.appNotificacion.viewContainerRef;
    viewContainerRef.clear();
    for (let index = 0; index < this.ads.length; index++) {
      const adItem = this.ads[index];
      const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component);
      componentRef.instance.data = adItem.data;
    }
  }

}