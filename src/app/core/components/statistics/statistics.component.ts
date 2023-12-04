import { Component, Input } from '@angular/core';
import { Statistic } from '../../models/Statisitic';

/**
 * Statistics component to display informations.
 */
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {

  @Input() statistics!: Statistic[];
}
