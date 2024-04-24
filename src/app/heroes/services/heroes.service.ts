import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl: string = environments.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtengo todos los héroes a través de la consulta de la api
  getHeroes():Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  // Obtengo el hero a través de la id en la api
  getHeroById( id: string): Observable<Hero|undefined> {
      return this.http.get<Hero>(`${this.baseUrl}/heroes/${ id }`)
        .pipe(
          catchError( error => of(undefined) )
        );
  }

  // Obtengo los heroes que hacen match en la api
  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
        .pipe(
            map(heroes => heroes.filter(hero => hero.superhero.toLowerCase().includes(query.toLowerCase())))
        );
  }

  // CRUD

  addHero( hero: Hero ): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`,hero);
  }

  updateHero( hero: Hero ): Observable<Hero> {
    if ( !hero._id ) throw Error('Hero is required');

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${ hero._id }`,hero);
  }

  deleteHeroById( id: string ): Observable<boolean> {

    return this.http.delete(`${this.baseUrl}/heroes/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }

}
