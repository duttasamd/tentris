import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {

  constructor(private http: HttpClient) { }

  getJSON(){
    return this.http.get('https://api.myjson.com/bins/7eoxf'); //temporary json placeholder
  }
}
