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


  constructor(private http: HttpClient) { }
  onrunclickevent()
  {
    console.log('onclick');
    this.invokeresult.emit();
  }

  getJSON(){
    console.log('ongetjson');
    return this.http.get('https://api.myjson.com/bins/7eoxf'); 
    
  }//temporary json placeholder
    
}
