import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: './list'},
    { label: 'Añadir', icon: 'add', url: './new-hero'},
    { label: 'Buscar', icon: 'search', url: './search'},
  ]

  get user():User | undefined {
    return this.authService.currentUser;
  }

  constructor(
    private authService: AuthService,
    private rooter: Router
  ){}

  onLogout() {
    this.authService.logout();
    this.rooter.navigate(['/auth/login'])
  }

}
