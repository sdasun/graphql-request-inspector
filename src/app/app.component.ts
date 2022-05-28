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
  request = `{"variables":{},"query":"{\\n  authorizationForLoggedInUser {\\n    user {\\n      id\\n      username\\n      firstName\\n      lastName\\n      email\\n      twoFactorRequired\\n      twoFactorActivated\\n      organisations {\\n        id\\n        name\\n        twoFactorRequired\\n        wizardCompleted\\n        startDate\\n        endDate\\n        roles {\\n          id\\n          name\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
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
