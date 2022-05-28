import { Component } from '@angular/core';
import { format } from 'graphql-formatter';
import { debounceTime, map, Observable, Subject } from 'rxjs';
const DEFAULT_REQUEST = `{"variables":{"input":{"firstName":"John Doe"}},"query":"mutation ($input: UpdateUser!) {\\n  updateUserProfile(id: 12, input: $input) {\\n    user {\\n        id\\n        firstName\\n        lastName\\n        username\\n        __typename\\n          }\\n status\\n    error\\n    __typename\\n \\n}\\n \\n}\\n"}`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'json-to-graphql-decipher';
  request = DEFAULT_REQUEST;
  inputVariables = '';
  query = '';
  subject = new Subject();
  constructor() {
    this.update();
  }
  ngOnInit() {
    this.subject
      .pipe(
        debounceTime(1000),
        map(() => {
          this.update();
        })
      )
      .subscribe((e) => {});
  }
  ngOnDestroy() {
    this.subject.unsubscribe();
  }
  requestOnFocus() {
    if (this.request === DEFAULT_REQUEST) {
      this.request = '';
      this.query = '';
      this.inputVariables = '';
    }
  }
  update() {
    console.log('update');
    try {
      const json = JSON.parse(this.request);
      let inputVariables = JSON.stringify(json.variables, null, 2);
      // inputVariables = inputVariables.replace(/\n/g, '<br>');
      // inputVariables = inputVariables.replace(/\s/g, '&nbsp;');
      this.inputVariables = inputVariables;
      let query = json.query;
      // remove __typename
      query = query.replace(/__typename/g, '');
      query = format(query);
      query = query.replace(/\t/g, '  ');
      this.query = query;
    } catch (e) {
      console.log(e);
      this.query = '// invalid request payload';
      this.inputVariables = '// invalid request payload';

    }
  }
  textChanged(e: any) {
    console.log('textChanged');
    this.subject.next(e);
  }
}
