import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ace from 'ace-builds';

// language package, choose your own
import 'ace-builds/src-noconflict/mode-sparql';
// ui-theme package
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
      minLines: 14,
      maxLines: 22,
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

  constructor() { }

  ngOnInit() {
    ace.require('ace/ext/language_tools');

    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = this.getEditorOptions();

    // this.editorBeautify = ace.require('ace/ext/beautify');
    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setBehavioursEnabled(true);
    this.codeEditor.setWrapBehavioursEnabled(true);
    this.codeEditor.setShowFoldWidgets(true);
  }

  private getCode() {
    const code = this.codeEditor.getValue();
    console.log(code);
  }

  private beautifySparql() {
    const code = this.codeEditor.getValue();
    const keywords = ['base', 'prefix', 'select', 'distinct', 'reduced', 'construct', 'describe', 'ask',
      'from', 'named', 'where', 'order', 'limit', 'offset', 'filter', 'optional', 'graph', 'asc',
      'desc', 'having', 'undef', 'values', 'group', 'minus', 'in', 'not', 'service', 'silent',
      'using', 'insert', 'delete', 'union', 'true', 'false', 'with', 'data', 'copy', 'to', 'move', 'add',
      'create', 'drop', 'clear', 'load'];
    const tokens = code.split(/\s+/);
    console.log(tokens);
    let level = 0;
    let tabneeded = false;

    let beautifiedCode = '';
    for (const token of tokens) {
      // console.log(level)
      if (token.startsWith('#')) {
        // console.log(token + 'starts with : ', token)
        beautifiedCode += '\n' + this.addtabs(level, token);
      } else if (token === '{') {
        beautifiedCode += '\n' + this.addtabs(level, token) + '\n';
        tabneeded = true;
        level += 1;
      } else if (token === '}') {
        tabneeded = true;
        level -= 1;
        beautifiedCode += '\n' + this.addtabs(level, token);
      } else if (keywords.indexOf(token.toLowerCase()) >= 0) {
        console.log(token);
        beautifiedCode += '\n' + this.addtabs(level, token);
        tabneeded = false;
      } else {
        if (tabneeded) {
          beautifiedCode += this.addtabs(level, token);
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

}
