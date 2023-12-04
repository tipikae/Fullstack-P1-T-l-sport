import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AppRoutingModule
    
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    StatisticsComponent
  ]
})
export class CoreModule { }
