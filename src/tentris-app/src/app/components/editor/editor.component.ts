import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ace from 'ace-builds';
import {EditorService} from '../../editor.service';

// language package, choose your own
// import 'ace-builds/src-noconflict/mode-sparql';
// ui-theme package
import 'src/assets/mode_custom_sparql';

import 'ace-builds/src-noconflict/theme-textmate';

// import 'ace-builds/src-noconflict/ext-language_tools';

import 'src/assets/custom_ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

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


    function beautifyHotkey(editor) {
      // console.log('in beutify shortcut');
      let code = editor.getValue();
      code = code.replace(/(?:\r\n|\r|\n)/g, ' <br> ');
      code = code.replace(/{/g, ' { ');
      code = code.replace(/}/g, ' } ');
      const keywords = ['base', 'prefix', 'select', 'distinct', 'reduced', 'construct', 'describe', 'ask',
        'from', 'named', 'where', 'order', 'limit', 'offset', 'filter', 'optional', 'graph', 'asc',
        'desc', 'having', 'undef', 'values', 'group', 'minus', 'in', 'not', 'service', 'silent',
        'using', 'insert', 'delete', 'union', 'true', 'false', 'with', 'data', 'copy', 'to', 'move', 'add',
        'create', 'drop', 'clear', 'load'];
      const tokens = code.split(/\s+/);
      // console.log(tokens);
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
        // console.log('starts with new line');
      }
      editor.setValue(beautifiedCode);
    }

    // add command to lazy-load keybinding_menu extension
    this.codeEditor.commands.addCommand({
      name: 'beautycommand',
      bindKey: {win: 'Ctrl-B', mac: 'Command-B'},
      exec(editor) {
        beautifyHotkey(editor);
      }
    });

    this.codeEditor.commands.addCommand({
      name: 'clearcommand',
      bindKey: {win: 'Ctrl-Delete', mac: 'Ctrl-C'},
      exec(editor) {
        console.log('In Delete!')
        editor.setValue('');
      }
    });
    // this.codeEditor.execCommand('testcommand', []);
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
    // console.log('in beautify');
    let code = this.codeEditor.getValue();
    code = code.replace(/(?:\r\n|\r|\n)/g, ' <br> ');
    code = code.replace(/{/g, ' { ');
    code = code.replace(/}/g, ' } ');
    // console.log(code);
    const keywords = ['base', 'prefix', 'select', 'distinct', 'reduced', 'construct', 'describe', 'ask',
      'from', 'named', 'where', 'order', 'limit', 'offset', 'filter', 'optional', 'graph', 'asc',
      'desc', 'having', 'undef', 'values', 'group', 'minus', 'in', 'not', 'service', 'silent',
      'using', 'insert', 'delete', 'union', 'true', 'false', 'with', 'data', 'copy', 'to', 'move', 'add',
      'create', 'drop', 'clear', 'load'];
    const tokens = code.split(/\s+/);
    // console.log(tokens);
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
      // console.log('starts with new line');
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

    if (code.includes('owl:') && !code.includes('PREFIX owl: <http://www.w3.org/2002/07/owl#>')) {
      code = 'PREFIX owl: <http://www.w3.org/2002/07/owl#>\n' + code;
    }
    if (code.includes('skos:') && !code.includes('PREFIX skos: <http://www.w3.org/2004/02/skos/core#>')) {
      code = 'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n' + code;
    }
    if (code.includes('prov:') && !code.includes('PREFIX prov: <http://www.w3.org/ns/prov#>')) {
      code = 'PREFIX prov: <http://www.w3.org/ns/prov#>\n' + code;
    }
    if (code.includes('bds:') && !code.includes('PREFIX bds: <http://www.bigdata.com/rdf/search#>')) {
      code = 'PREFIX bds: <http://www.bigdata.com/rdf/search#>\n' + code;
    }
    if (code.includes('gas:') && !code.includes('PREFIX gas: <http://www.bigdata.com/rdf/gas#>')) {
      code = 'PREFIX gas: <http://www.bigdata.com/rdf/gas#>\n' + code;
    }

    if (code.includes('wdref:') && !code.includes('PREFIX wdref: <http://www.wikidata.org/reference/>')) {
      code = 'PREFIX wdref: <http://www.wikidata.org/reference/>\n' + code;
    }
    if (code.includes('psv:') && !code.includes('PREFIX psv: <http://www.wikidata.org/prop/statement/value/>')) {
      code = 'PREFIX psv: <http://www.wikidata.org/prop/statement/value/>\n' + code;
    }
    if (code.includes('psn:') && !code.includes('PREFIX psn: <http://www.wikidata.org/prop/statement/value-normalized/>')) {
      code = 'PREFIX psn: <http://www.wikidata.org/prop/statement/value-normalized/>\n' + code;
    }
    if (code.includes('pqv:') && !code.includes('PREFIX pqv: <http://www.wikidata.org/prop/qualifier/value/>')) {
      code = 'PREFIX pqv: <http://www.wikidata.org/prop/qualifier/value/>\n' + code;
    }
    if (code.includes('pqn:') && !code.includes('PREFIX pqn: <http://www.wikidata.org/prop/qualifier/value-normalized/>')) {
      code = 'PREFIX pqn: <http://www.wikidata.org/prop/qualifier/value-normalized/>\n' + code;
    }
    if (code.includes('pr:') && !code.includes('PREFIX pr: <http://www.wikidata.org/prop/reference/>')) {
      code = 'PREFIX pr: <http://www.wikidata.org/prop/reference/>\n' + code;
    }
    if (code.includes('prv:') && !code.includes('PREFIX prv: <http://www.wikidata.org/prop/reference/value/>')) {
      code = 'PREFIX prv: <http://www.wikidata.org/prop/reference/value/>\n' + code;
    }
    if (code.includes('prn:') && !code.includes('PREFIX prn: <http://www.wikidata.org/prop/reference/value-normalized/>')) {
      code = 'PREFIX prn: <http://www.wikidata.org/prop/reference/value-normalized/>\n' + code;
    }
    if (code.includes('wdno:') && !code.includes('PREFIX wdno: <http://www.wikidata.org/prop/novalue/>')) {
      code = 'PREFIX wdno: <http://www.wikidata.org/prop/novalue/>\n' + code;
    }
    if (code.includes('wdata:') && !code.includes('PREFIX wdata: <http://www.wikidata.org/wiki/Special:EntityData/>')) {
      code = 'PREFIX wdata: <http://www.wikidata.org/wiki/Special:EntityData/>\n' + code;
    }

    this.codeEditor.setValue(code);
  }

}
