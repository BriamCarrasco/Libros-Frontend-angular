import { Component, signal, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnDestroy {
  fechaHora = signal('');
  private readonly intervaloId: any;

  constructor() {
    this.updateDateTime();
    this.intervaloId = setInterval(() => this.updateDateTime(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervaloId);
  }

  updateDateTime() {
    const now = new Date();
    const diaSemana = now.toLocaleDateString('es-CL', { weekday: 'long' }).replace(/^./, c => c.toUpperCase());
    const dia = now.getDate();
    const mes = now.toLocaleDateString('es-CL', { month: 'long' }).replace(/^./, c => c.toUpperCase());
    const año = now.getFullYear();
    const fecha = `${diaSemana}, ${dia} de ${mes} de ${año}`;
    const hora = now.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    this.fechaHora.set(`${fecha} - ${hora}`);
  }
}