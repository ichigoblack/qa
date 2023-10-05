
import { HttpHeaders } from '@angular/common/http';

let userTemp = sessionStorage.getItem("currentUser")
let token = JSON.parse(userTemp)
export const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token.token}`);