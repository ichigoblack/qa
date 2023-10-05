export function buscarTagEnJSON(json:any, tag:string) {
    if (typeof json !== 'object' || json === null) {
      return; // Si no es un JSON, salir de la función
    }
  
    if (json.hasOwnProperty(tag)) {
      console.log('Tag encontrado:', json[tag]);
      return json[tag];
    }
  /*
    for (var key in json) {
      if (json.hasOwnProperty(key)) {
        if (typeof json[key] === 'object' && json[key] !== null) {
          buscarTagEnJSON(json[key], tag);
        }
      }
    }*/
    for (var key in json) {
      if (typeof json[key] === 'object') {
        var resultado = buscarTagEnJSON(json[key], tag);
        if (resultado !== undefined) {
          return resultado;
        }
      } else if (key === tag) {
        return json[key];
      }
    }
  }