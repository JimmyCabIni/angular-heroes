import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

  // Formulario Reactivo
  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>(Publisher.DCComics || Publisher.MarvelComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  get currentHero():Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  // Obtener los valores originales si quiero editar
  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroById( id )),
      ).subscribe( hero => {

        if ( !hero ) return this.router.navigateByUrl('/');

        // Establezo los valores antiguos
        this.heroForm.reset( hero );
        return;
      })

  }

  // Realizo la función dependiendo del botón seleccionado
  onSubmit():void {

    if( this.heroForm.invalid ) return;

    // Voy a editar
    if ( this.currentHero.id ) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe( hero => {
          // Muestro el mensaje de actualizado
          this.showSnackbar(`${ hero.superhero } updated!`);
        });

        return;
    }

    // Voy a crear
    this.heroesService.addHero(this.currentHero)
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        // Muestro el mensaje de creado
        this.showSnackbar(`${ hero.superhero } created!`);

      })

  }

  // Recibo la función de eliminar
  onDeleteHero() {
    if ( !this.currentHero.id ) throw Error('Hero id is required')

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value,
      });

      // Obtengo el resultado del dialog
      dialogRef.afterClosed()
        .pipe(
          // Compruebo que ha devuelto true el botón
          filter( (result:boolean) => result ),
          switchMap( () =>  this.heroesService.deleteHeroById( this.currentHero.id )),
          // Compruebo que ha podido eliminar el heroe
          filter( (wasDeleted: boolean)=> wasDeleted),
        )
        .subscribe(() => {
          this.router.navigate(['/heroes']);
      })


      // dialogRef.afterClosed().subscribe(result => {
      //   if ( !result ) return;
      //   console.log('deleted')

      //   this.heroesService.deleteHeroById( this.currentHero.id )
      //     .subscribe( wasDeleted => {
      //       if ( wasDeleted )
      //         this.router.navigate(['/heroes']);
      //     });

      // });
  }

  // Mensaje que sale cuando guardas
  showSnackbar( message: string):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }


}
