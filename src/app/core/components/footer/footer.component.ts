import { Component } from '@angular/core';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

/**
 * Footer component.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  copyright = faCopyright;
}
