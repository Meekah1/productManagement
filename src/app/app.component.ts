// import { Component } from '@angular/core';
// // import { RouterOutlet } from '@angular/router';
// import { ProductFormComponent } from './components/product-form/product-form.component';

// @Component({
//   selector: 'app-product-form',
//   standalone: true,
//   imports: [ProductFormComponent],
//   templateUrl: '././components/product-form/product-form.component.html',
//   styleUrl: '././components/product-form/product-form.component.css',
// })
// export class AppComponent {
//   title = 'productManagement';
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Product Management';
}
