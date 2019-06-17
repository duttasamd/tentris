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
      this.editorService.subsVar = this.editorService.invokeEditorBeautify.subscribe(() => {
        this.beautifySparql();
      });
      this.editorService.subsVar = this.editorService.invokeClearCode.subscribe(() => {
        this.clearCode();
      });
      this.editorService.subsVar = this.editorService.invokeRunQuery.subscribe(() => {
        this.runQuery();
      });
      this.editorService.subsVar = this.editorService.invokeHistory.subscribe(() => {
        this.historyClick();
      });
      this.editorService.subsVar = this.editorService.invokeHistoryPick.subscribe(() => {
        this.historyPick();
      });
    }
  }

  private historyClick() {
    console.log('in history');
    const history = this.editorService.getData('history');

    if (history !== undefined && history.length > 0) {
      console.log(history.length);
      this.codeEditor.setValue(history[history.length - 1]);
      history.splice(-1, 1);
    } else if (history.length === 0) {
      this.codeEditor.setValue('');
    }
  }

  private runQuery() {
    console.log('in run query');

    this.replacePrefix();

    const code = this.codeEditor.getValue();
    const history = this.editorService.getData('history');
    console.log(history);
    if (history === undefined) {
      this.editorService.setData('history', [code]);
    } else {
      console.log('push');
      history.push(code);
      // this.editorService.setData('history', history);
    }
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

  public historyPick() {
    const index = this.editorService.getData('selectedindex');
    const history = this.editorService.getData('history');
    console.log('Picked index : ' + index);

    if (history !== undefined && history.length > 0) {
      this.codeEditor.setValue(history[index]);
    } else if (history.length === 0) {
      this.codeEditor.setValue('');
    }
  }

  public replacePrefix() {
    let code = this.codeEditor.getValue();

    if (code.includes('wd:') && !code.includes('PREFIX wd: <http://www.wikidata.org/entity/>')) {
      code = 'PREFIX wd: <http://www.wikidata.org/entity/>\n' + code;
    }

    if (code.includes('wds:') && !code.includes('PREFIX wds: <http://www.wikidata.org/entity/statement/>')) {
      code = 'PREFIX wds: <http://www.wikidata.org/entity/statement/>\n' + code;
    }

    if (code.includes('wdv:') && !code.includes('PREFIX wdv: <http://www.wikidata.org/value/>')) {
      code = 'PREFIX wdv: <http://www.wikidata.org/value/>\n' + code;
    }

    if (code.includes('wdt:') && !code.includes('PREFIX wdt: <http://www.wikidata.org/prop/direct/>')) {
      code = 'PREFIX wdt: <http://www.wikidata.org/prop/direct/>\n' + code;
    }

    if (code.includes('wikibase:') && !code.includes('PREFIX wikibase: <http://wikiba.se/ontology#>')) {
      code = 'PREFIX wikibase: <http://wikiba.se/ontology#>\n' + code;
    }

    if (code.includes('p:') && !code.includes('PREFIX p: <http://www.wikidata.org/prop/>')) {
      code = 'PREFIX p: <http://www.wikidata.org/prop/>\n' + code;
    }

    if (code.includes('ps:') && !code.includes('PREFIX ps: <http://www.wikidata.org/prop/statement/>')) {
      code = 'PREFIX ps: <http://www.wikidata.org/prop/statement/>\n' + code;
    }

    if (code.includes('pq:') && !code.includes('PREFIX pq: <http://www.wikidata.org/prop/qualifier/>')) {
      code = 'PREFIX pq: <http://www.wikidata.org/prop/qualifier/>\n' + code;
    }

    if (code.includes('rdfs:') && !code.includes('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>')) {
      code = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n' + code;
    }

    if (code.includes('bd:') && !code.includes('PREFIX bd: <http://www.bigdata.com/rdf#>')) {
      code = 'PREFIX bd: <http://www.bigdata.com/rdf#>\n' + code;
    }

    if (code.includes('schema:') && !code.includes('PREFIX schema: <http://schema.org/>')) {
      code = 'PREFIX schema: <http://schema.org/>\n' + code;
    }

    if (code.includes('rdf:') && !code.includes('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>')) {
      code = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' + code;
    }

    if (code.includes('xsd:') && !code.includes('PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>')) {
      code = 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n' + code;
    }

    this.codeEditor.setValue(code);
  }

}
