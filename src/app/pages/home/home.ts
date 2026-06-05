import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',

  standalone: true,

  imports: [RouterModule, MatButtonModule, MatIconModule, Footer],

  templateUrl: './home.html',

  styleUrl: './home.css',
})
export class Home {}
