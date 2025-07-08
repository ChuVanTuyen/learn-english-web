import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export const HTTP_OPTION = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

export const BASE_URL = environment.URL + 'api/';
export const BASE_URL_PUBLIC = environment.URL + 'api/';
