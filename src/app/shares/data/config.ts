import { HttpHeaders } from "@angular/common/http";

export const HTTP_OPTION = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

export const BASE_URL = 'http://localhost:3000/api/';
export const BASE_URL_PUBLIC = 'http://localhost:3000/';
