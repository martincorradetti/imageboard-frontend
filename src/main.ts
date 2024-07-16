import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent,
  {
    providers: [
      importProvidersFrom(BrowserAnimationsModule, RouterModule.forRoot(routes)),
      provideHttpClient()
    ]
  }
)
  .catch(err => console.error(err));
