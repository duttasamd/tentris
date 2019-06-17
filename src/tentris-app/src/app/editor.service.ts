import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  invokeEditorBeautify = new EventEmitter();
  invokeClearCode = new EventEmitter();
  invokeRunQuery = new EventEmitter();
  invokeHistory = new EventEmitter();
  invokeHistoryPick = new EventEmitter();

  subsVar: Subscription;

  data: any = {};

  setData(key, value) {
    this.data[key] = value;
  }

  getData(key) {
    return this.data[key];
  }

  constructor() {
  }

  onBeautifyClick() {
    this.invokeEditorBeautify.emit();
  }

  onClearCode() {
    this.invokeClearCode.emit();
  }

  onRunQuery() {
    this.invokeRunQuery.emit();
  }

  onHistoryClick() {
    this.invokeHistory.emit();
  }

  onHistoryPick() {
    this.invokeHistoryPick.emit();
  }
}
