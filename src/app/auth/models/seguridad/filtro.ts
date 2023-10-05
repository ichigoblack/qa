import { Componente } from "./componente"

export class Flitro {
    estado?:boolean
    fin?:boolean
    hijos?:number[]
    limpieza?:number[]
    orden?:number[]
    control?:number
    componentes?:Componente[]
    load?:boolean
    limpiarNotificacion?:boolean
}