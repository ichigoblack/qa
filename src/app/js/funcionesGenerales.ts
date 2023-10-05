function validadeCedula(cedula:string){
    let validador:boolean = false;
    if(cedula.length == 10){
        //Obtenemos el digito de la region que sonlos dos primeros digitos
        var digito_region = cedula.substring(0,2);
        //Pregunto si la region existe ecuador se divide en 24 regiones
        if( Number.parseInt(digito_region) >= 1 && Number.parseInt(digito_region) <=24 ){
            // Extraigo el ultimo digito
            var ultimo_digito = cedula.substring(9,10);
            //Agrupo todos los pares y los sumo
            var pares = parseInt(cedula.substring(1,2)) + parseInt(cedula.substring(3,4)) + parseInt(cedula.substring(5,6)) + parseInt(cedula.substring(7,8));
            //Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
            var numero1 = cedula.substring(0,1);
            var posicion1 = (parseInt(numero1) * 2);
            if( posicion1 > 9 ){ var posicion1 = (posicion1 - 9); }
            var numero3 = cedula.substring(2,3);
            var posicion3 = (parseInt(numero3) * 2);
            if( posicion3 > 9 ){ var posicion3 = (posicion3 - 9); }
            var numero5 = cedula.substring(4,5);
            var posicion5 = (parseInt(numero5) * 2);
            if( posicion5 > 9 ){ var posicion5 = (posicion5 - 9); }
            var numero7 = cedula.substring(6,7);
            var posicion7 = (parseInt(numero7) * 2);
            if( posicion7 > 9 ){ var posicion7 = (posicion7 - 9); }
            var numero9 = cedula.substring(8,9);
            var posicion9 = (parseInt(numero9) * 2);
            if( posicion9 > 9 ){ var posicion9 = (posicion9 - 9); }
            var impares = posicion1 + posicion3 + posicion5 + posicion7 + posicion9;
            //Suma total
            var suma_total = (pares + impares);
            //extraemos el primero digito
            var primer_digito_suma = String(suma_total).substring(0,1);
            //Obtenemos la decena inmediata
            var decena = (parseInt(primer_digito_suma) + 1)  * 10;
            //Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
            var digito_validador = decena - suma_total;
            //Si el digito validador es = a 10 toma el valor de 0
            if(digito_validador == 10)
                var digito_validador = 0;
            //Validamos que el digito validador sea igual al de la cedula
            if(digito_validador == parseInt(ultimo_digito)){
                console.log('la cedula:' + cedula + ' es correcta');
                validador = true;
            }else{
                console.log('la cedula:' + cedula + ' es incorrecta');
            }
        }else{
            // imprimimos en consola si la region no pertenece
            console.log('Esta cedula no pertenece a ninguna region');
        }
    }else{
        //imprimimos en consola si la cedula tiene mas o menos de 10 digitos
        console.log('Esta cedula tiene menos de 10 Digitos');
    }   
    return validador; 
}

function obtenerFechaActual() {
    let inputDate = new Date();
    let date, month, year;
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
    date = date.toString().padStart(2, '0');
    month = month .toString() .padStart(2, '0');
    return `${date}/${month}/${year}`;
}

function convertirFecha(fecha:any) {
    let inputDate = new Date(fecha);
    let date, month, year;
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
    date = date.toString().padStart(2, '0');
    month = month .toString() .padStart(2, '0');
    return `${year}-${month}-${date}`;
}
export { validadeCedula, obtenerFechaActual , convertirFecha }