import { Component, OnInit } from '@angular/core';

let columnList = ["article", "property", "value"] // Dummy data [ This data comes from "head":{"vars": ____} of the http response
// THe below data comes from "results":{"bindings":[ _______]} part of the http response
const ELEMENT_DATA = [{ "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "138", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article7" }, "property": { "type": "uri", "value": "http:\/\/xmlns.com\/foaf\/0.1\/homepage" }, "value": { "type": "literal", "value": "http:\/\/www.mongoloids.tld\/raunchiness\/perspicuously.html" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article2" }, "property": { "type": "uri", "value": "http:\/\/purl.org\/dc\/elements\/1.1\/creator" }, "value": { "type": "uri", "value": "http:\/\/localhost\/persons\/Paul_Erdoes" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1941\/Article17" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article9" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "80", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article18" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }];

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})

export class ViewerComponent implements OnInit {
  displayedColumns: string[] = columnList;
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}