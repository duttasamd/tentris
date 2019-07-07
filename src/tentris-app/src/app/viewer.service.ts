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
  /* This meathod is triggerd from the editor component on click of Run button
      The data in code editor is sent here as an argument each time the Run button is clicked. */
  onrunclickevent(code:any)
  {
    this.link=code;
    this.invokeresult.emit(code);
  }

  /*This meathod converts the query to a URL
    then a fixed URL header is appended in front of the query URL
    this meathod returns the value from requested and return the JSON result*/

  getJSON(){
    var uri = 'http://127.0.0.1:3030/sparql?query=' + encodeURIComponent(this.link);
    return this.http.get(uri); 
  }//temporary json placeholder
    
}
