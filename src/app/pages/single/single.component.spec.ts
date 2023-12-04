import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleComponent } from './single.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { AppModule } from 'src/app/app.module';

describe('SingleComponent', () => {
  let component: SingleComponent;
  let fixture: ComponentFixture<SingleComponent>;
  let service: OlympicService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AppModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OlympicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
