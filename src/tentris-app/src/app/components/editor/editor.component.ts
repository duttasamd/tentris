import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ace from 'ace-builds';
import {EditorService} from '../../editor.service';

// language package, choose your own
// import 'ace-builds/src-noconflict/mode-sparql';
// ui-theme package
import 'src/assets/mode_custom_sparql';

import 'ace-builds/src-noconflict/theme-textmate';

import 'ace-builds/src-noconflict/ext-language_tools';

// import 'ace-builds/src-noconflict/ext-beautify';

const THEME = 'ace/theme/textmate';
const LANG = 'ace/mode/sparql';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('codeEditor') codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;

  static getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      autoScrollEditorIntoView: true
    };

    const extraEditorOptions = {
      enableBasicAutocompletion: true
    };


    return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  static addtabs(level, str) {
    let tabbedstr = '';
    for (let i = 0; i < level; i++) {
      tabbedstr += '\t';
    }
    return tabbedstr + str;
  }

  constructor(private editorService: EditorService) {
  }


  ngOnInit() {
    ace.require('ace/ext/language_tools');

    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = EditorComponent.getEditorOptions();

    // this.editorBeautify = ace.require('ace/ext/beautify');
    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setBehavioursEnabled(true);
    this.codeEditor.setWrapBehavioursEnabled(true);
    this.codeEditor.setShowFoldWidgets(true);

    if (this.editorService.subsVar === undefined) {
      this.editorService.subsVar = this.editorService.invokeEditorBeautify.subscribe((name: string) => {
        this.beautifySparql();
      });
      this.editorService.subsVar = this.editorService.invokeClearCode.subscribe((name: string) => {
        this.clearCode();
      });
    }
  }

  // firstComponentFunction(){
  //   this.eventEmitterService.onFirstComponentButtonClick();
  // }

  private getCode(code) {
    // const code = this.codeEditor.getValue();
    console.log(code);
  }

  public beautifySparql() {
    console.log('in beutify');
    let code = this.codeEditor.getValue();
    code = code.replace(/(?:\r\n|\r|\n)/g, ' <br> ');
    code = code.replace(/{/g, ' { ');
    code = code.replace(/}/g, ' } ');
    console.log(code);
    const keywords = ['base', 'prefix', 'select', 'distinct', 'reduced', 'construct', 'describe', 'ask',
      'from', 'named', 'where', 'order', 'limit', 'offset', 'filter', 'optional', 'graph', 'asc',
      'desc', 'having', 'undef', 'values', 'group', 'minus', 'in', 'not', 'service', 'silent',
      'using', 'insert', 'delete', 'union', 'true', 'false', 'with', 'data', 'copy', 'to', 'move', 'add',
      'create', 'drop', 'clear', 'load'];
    const tokens = code.split(/\s+/);
    console.log(tokens);
    let level = 0;
    let tabneeded = false;
    let ignorebr = true;
    let beautifiedCode = '';
    for (const token of tokens) {

      if (!ignorebr) {
        if (token === '<br>') {
          ignorebr = true;
          continue;
        } else {
          beautifiedCode += ' ' + token;
          continue;
        }
      } else {
        if (token === '<br>') {
          continue;
        }
      }

      if (token.startsWith('#')) {
        ignorebr = false;
        beautifiedCode += '\n' + EditorComponent.addtabs(level, token);
      } else if (token === '{') {
        beautifiedCode += '\n' + EditorComponent.addtabs(level, token);
        tabneeded = true;
        level += 1;
      } else if (token === '}') {
        tabneeded = true;
        level -= 1;
        beautifiedCode += '\n' + EditorComponent.addtabs(level, token);
      } else if (keywords.indexOf(token.toLowerCase()) >= 0) {
        console.log(token);
        beautifiedCode += '\n' + EditorComponent.addtabs(level, token);
        tabneeded = false;
      } else {
        if (tabneeded) {
          beautifiedCode += '\n' + EditorComponent.addtabs(level, token);
          tabneeded = false;
        } else {
          beautifiedCode += ' ' + token;
        }
      }
    }
    if (beautifiedCode.startsWith('\n')) {
      beautifiedCode = beautifiedCode.replace('\n', '');
      console.log('starts with new line');
    }
    this.codeEditor.setValue(beautifiedCode);
  }

  private clearCode() {
    this.codeEditor.setValue('');
  }

}
