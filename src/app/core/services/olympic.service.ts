import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, finalize, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {

  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  private _loading = new BehaviorSubject<Boolean>(false);
  isLoading$ = this._loading.asObservable();

  constructor(private http: HttpClient) {}

  loadInitialData() {
    //this._loading.next(true);
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      }),
      //finalize(() => this._loading.next(false))
    );
  }

  getOlympics(): Observable<Olympic[]> {
    //this._loading.next(true);
    return this.olympics$.asObservable().pipe(
      filter(value => typeof value != 'undefined' && value.length > 0),
      //finalize(() => this._loading.next(false))
    );
  }

  getOlympic(id: number): Observable<Olympic> {
    //this._loading.next(true);
    return this.olympics$.asObservable().pipe(
      filter(value => typeof value != 'undefined' && value.length > 0),
      map( olympics => {
        let filtered = olympics.filter( olympic => olympic.id == id );
        if (filtered.length != 1) {
          throw new Error('Country not found')
        }
        return filtered[0];
      }),
      //finalize(() => this._loading.next(false))
    );
  }
}
