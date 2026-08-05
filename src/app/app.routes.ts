import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Routes } from '@angular/router';
import { Mascotas } from './pages/mascotas/mascotas';
import { Historial } from './pages/historial/historial';
import { Turnos } from './pages/turnos/turnos';
import { DetalleMascota } from './pages/detalle-mascota/detalle-mascota';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './core/auth/guards/auth.guard';
import { Perfil } from './pages/perfil/perfil';
import { Home } from './pages/home/home';
import { Consultas } from './pages/consultas/consultas';
import { Vacunas } from './pages/vacunas/vacunas';
import { Demo } from './demo/demo';
import { HistorialClinicoComponent } from './pages/historial-clinico/historial-clinico';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'perfil',
    component: Perfil,
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },

  {
    path: 'mascotas',
    component: Mascotas,
    canActivate: [authGuard],
  },

  {
    path: 'mascotas/:id',
    component: DetalleMascota,
    canActivate: [authGuard],
  },

  {
    path: 'historial-clinico',
    component: HistorialClinicoComponent,
  },

  {
    path: 'turnos',
    component: Turnos,
  },

  {
    path: 'consultas',
    component: Consultas,
    canActivate: [authGuard],
  },

  {
    path: 'vacunas',
    component: Vacunas,
    // canActivate: [authGuard],
  },

  {
    path: 'demo',
    component: Demo,
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
