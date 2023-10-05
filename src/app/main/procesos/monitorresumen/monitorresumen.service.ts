import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import axios from "axios";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MonitorresumenService {

  public baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) {}

  generarProcesosMonitorResumen(json){
    return this.http.post(this.baseUrl+"/nw-administrativo/monitorresumen/generarProcesosParaMonitor", json);
  }

}
