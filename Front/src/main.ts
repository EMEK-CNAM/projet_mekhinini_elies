import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; // import App instead of AppComponent

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
