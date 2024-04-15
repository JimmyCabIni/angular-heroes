import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  // Obtengo todos los héroes a través de la consulta de la api
  getHeroes():Observable<Hero[]> {

    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);

  }

}
