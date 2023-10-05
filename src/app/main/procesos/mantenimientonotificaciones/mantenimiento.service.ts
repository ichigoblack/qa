import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VerificacionService } from "app/auth/service/verificacion.service";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable()

export class MantenimientoService{

    public baseUrl = environment.apiUrlComponentes;

    constructor(
        private http:HttpClient,
        private verificacion:VerificacionService
    ){

    }

    listarTipoIntegraciones(){
        return this.http.get(this.baseUrl+"/listarTipoIntegraciones");
    }

    listarIntegraciones(fecha:any,tipoIntegracion:any){
        let valorUser = this.verificacion.userValue;
        let planta = valorUser.planta.codplanta;

        if(planta.toString().startsWith("PE")){
            planta = "PE";
        }

        let request = {
            fecha,
            codPlanta:planta,
            tipoIntegracion
        }
        console.log("request ",request)
        return this.http.post(this.baseUrl+"/sap/listarIntegracionesPlantaFecha",request);
    }

    anularIntegracion(id:any){
        let valorUser = this.verificacion.userValue;
        let planta = valorUser.planta.codplanta;
        if(planta.toString().startsWith("PE")){
            planta = "PE";
        }
        return this.http.get(`${this.baseUrl}/sap/anularIntegracion/${id}/${planta}`);
    }

    reversarAnulacion(id:any){
        let valorUser = this.verificacion.userValue;
        let planta = valorUser.planta.codplanta;
        if(planta.toString().startsWith("PE")){
            planta = "PE";
        }
        return this.http.get(`${this.baseUrl}/sap/reversarAnulacion/${id}/${planta}`);

    }


}