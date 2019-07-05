import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subscription} from 'rxjs/internal/Subscription';
import {EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {
  invokeresult= new EventEmitter();
  subsVar: Subscription;
  link:any;
  constructor(private http: HttpClient) { }
  onrunclickevent(code:any)
  {
    this.link=code;
    this.invokeresult.emit(code);
  }

  getJSON(){
    var uri = 'http://127.0.0.1:3030/sparql?query=' + encodeURIComponent(this.link);
    console.log(uri);
    return this.http.get(uri); 
  }//temporary json placeholder
    
}
