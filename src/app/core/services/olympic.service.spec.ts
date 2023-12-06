import { TestBed } from '@angular/core/testing';

import { OlympicService } from './olympic.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';
import { filter, of, skip } from 'rxjs';

const OLYMPIC_URL = 'assets/mock/olympic.json';

describe('OlympicService', () => {
  let service: OlympicService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        OlympicService
      ]
    });

    service = TestBed.inject(OlympicService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#loadInitialData() should load data when OK', () => {
    let expectedOlympic: Olympic = {
      "id": 1,
      "country": "Italy",
      "participations": []
    };
    let expectedOlympics = [expectedOlympic];
    let actualOlympics: Olympic[] = [];

    let loadData$ = service.loadInitialData().subscribe( (olympics: Olympic[]) => actualOlympics = olympics );

    const request = controller.expectOne('./assets/mock/olympic.json');
    request.flush(expectedOlympics);
    controller.verify();

    loadData$.unsubscribe();

    expect(actualOlympics.length).toBe(expectedOlympics.length);
    expect(actualOlympics[0].id).toEqual(expectedOlympics[0].id);
  });

  it('#loadInitialData() should display an error message when no data found', () => {
    let olympics: Olympic[] = [];
    let expectedError = 'No data found';
    let actualError: string | undefined;

    let loadData$ = service.loadInitialData().subscribe();
    let error$ = service.error$.subscribe( value => actualError = value.toString() );

    const request = controller.expectOne('./assets/mock/olympic.json');
    request.flush(olympics);
    controller.verify();

    loadData$.unsubscribe();
    error$.unsubscribe();

    expect(actualError).toEqual(expectedError);
  });

  it('#getOlympics() should return an Olympic array when OK', () => {
    let expectedOlympic: Olympic = {
      "id": 1,
      "country": "Italy",
      "participations": []
    };
    let expectedOlympics = [expectedOlympic];
    let actualOlympics: Olympic[] = [];

    let loadData$ = service.loadInitialData().subscribe();
    let getOlympics$ = service.getOlympics().subscribe( (olympics:Olympic[]) => actualOlympics = olympics );

    const request = controller.expectOne('./assets/mock/olympic.json');
    request.flush(expectedOlympics);
    controller.verify();

    loadData$.unsubscribe();
    getOlympics$.unsubscribe();

    expect(actualOlympics.length).toEqual(expectedOlympics.length);
    expect(actualOlympics[0].country).toEqual(expectedOlympics[0].country);
  });

  it('#getOlympics() should return an error message when data json is empty', () => {
    let olympics: Olympic[] = [];
    let expectedError = 'No data found';
    let actualError: string | undefined;

    let loadData$ = service.loadInitialData().subscribe();
    let getOlympics$ = service.getOlympics().subscribe();
    let error$ = service.error$.subscribe( value => actualError = value.toString() );

    const request = controller.expectOne('./assets/mock/olympic.json');
    request.flush(olympics);
    controller.verify();

    loadData$.unsubscribe();
    getOlympics$.unsubscribe();
    error$.unsubscribe();

    expect(actualError).toEqual(expectedError);
  });

  it('#getOlympicById(id) should return an Olympic item when OK', () => {
    let expectedOlympic: Olympic = {
      "id": 1,
      "country": "Italy",
      "participations": []
    };
    let expectedOlympics = [expectedOlympic];
    let actualOlympic: Olympic | undefined;

    let loadData$ = service.loadInitialData().subscribe();
    let getOlympicById$ = service.getOlympicById(1).subscribe( (olympic: Olympic) => actualOlympic = olympic );

    const request = controller.expectOne('./assets/mock/olympic.json');
    request.flush(expectedOlympics);
    controller.verify();

    loadData$.unsubscribe();
    getOlympicById$.unsubscribe();

    expect(actualOlympic?.country).toEqual(expectedOlympic.country);
  });

  it('#getOlympicById(id) should throw an error when id is not found', () => {
    let olympic: Olympic = {
      "id": 1,
      "country": "Italy",
      "participations": []
    };
    let olympics = [olympic];
    let expectedError = 'Country not found';

    let loadData$ = service.loadInitialData().subscribe();

    const request = controller.expectOne('./assets/mock/olympic.json');
    request.flush(olympics);
    controller.verify();

    loadData$.unsubscribe();


    let getOlympicById$ = service.getOlympicById(2).subscribe({
      next: () => {},
      error: (error: Error) => expect(error.message).toEqual(expectedError)
    });
    getOlympicById$.unsubscribe();
  });
});
