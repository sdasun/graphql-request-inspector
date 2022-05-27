import { Component } from '@angular/core';
import { format } from 'graphql-formatter';
import { debounceTime, map, Observable, Subject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'json-to-graphql-decipher';
  name = `$ ng build --prod`;
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
  update() {
    console.log('update');
    try {
      const json = JSON.parse(this.name);
      let inputVariables = JSON.stringify(json.variables, null, 4);
      // inputVariables = inputVariables.replace(/\n/g, '<br>');
      // inputVariables = inputVariables.replace(/\s/g, '&nbsp;');
      this.inputVariables = inputVariables;
      let query = json.query;
      // remove __typename
      query = query.replace(/__typename/g, '');
      query = format(query);
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
