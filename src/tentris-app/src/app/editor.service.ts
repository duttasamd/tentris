import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  invokeEditorBeautify = new EventEmitter();
  invokeClearCode = new EventEmitter();
  subsVar: Subscription;

  constructor() {
  }

  onBeautifyClick() {
    this.invokeEditorBeautify.emit();
  }

  onClearCode() {
    this.invokeClearCode.emit();
  }
}
