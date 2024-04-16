import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { retry } from 'rxjs';

@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

  // Cargar la imagen que tiene, si no, cargar la de por defecto
  transform(hero: Hero): string {

    if ( !hero.id && !hero.alt_img) {
      return 'assets/no-image.png'
    }

    if ( hero.alt_img) return hero.alt_img; // https:///google.com/flash.png

    return `assets/heroes/${ hero.id}.jpg`;
  }

}
