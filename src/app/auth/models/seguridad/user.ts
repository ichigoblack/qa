import { Planta } from './planta'
import { Proceso } from './../proceso'

export class User {
    idvalidacionusuario: number=0;
    idusuario: string = "";
    token: string = "";
    fechaRegistro: string = "";
    planta: Planta = null;
    estado: string = "";
    procesos :Proceso[]=[];
}