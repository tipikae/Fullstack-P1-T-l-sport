import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Statistic } from 'src/app/core/models/Statisitic';

/**
 * Home page component.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  statistics: Statistic[] = [];
  numberOfJOsTitle: string = 'Number of JOs';
  numberOfCountriesTitle = 'Number of countries';

  pieChartData!: ChartData<'pie', number[], string | string[]>;
  pieChartOptions!: ChartConfiguration['options'];
  pieChartType!: ChartType;
  pieChartPlugins = [DatalabelsPlugin];
  
  isLoading$!: Observable<Boolean>;
  error$!: Observable<String>;

  constructor(private olympicService: OlympicService,
              private router: Router) {}

  ngOnInit(): void {
    this.isLoading$ = this.olympicService.isLoading$;
    this.error$ = this.olympicService.error$
    this.setChartConfig();
    this.olympicService.getOlympics().subscribe(
      (data: Olympic[]) => {
        this.setStatistics(data);
        this.setChart(data);
      }
    );
  }

  /**
   * Set statistics component to display number of JOs and number of countries informations.
   * @param {Olympic[]} olympics The Olympics data.
   */
  private setStatistics(olympics: Olympic[]) {
    this.setNumberOfJOs(olympics);
    this.setNumberOfCountries(olympics);
  }

  /**
   * Set number of JOs information.
   * @param {Olympic[]} olympics The Olympics data.
   */
  private setNumberOfJOs(olympics: Olympic[]): void {
    let title = this.numberOfJOsTitle;
    let value = 0;
    olympics.forEach(country => {
      let participations: Participation[] = country.participations;
      value < participations.length ? value = participations.length : null;
    });
    this.statistics.push({title, value});
  }

  /**
   * Set number of countries information.
   * @param {Olympic[]} olympics The Olympics data.
   */
  private setNumberOfCountries(olympics: Olympic[]): void {
    let title = this.numberOfCountriesTitle;
    let value = olympics.length;
    this.statistics.push({title, value});
  }

  /**
   * Set the pie chart data.
   * @param {Olympic[]} olympics The Olympics data.
   */
  private setChart(olympics: Olympic[]): void {
    let labels: string[] = [];
    let data: number[] = [];

    olympics.forEach(country => {
      let participations: Participation[] = country.participations;
      let medals = 0;
      participations.forEach(participation => medals += participation.medalsCount);
      data.push(medals);
      labels.push(country.country);
    });

    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
        },
      ],
    };
  }

  /**
   * Set the chart options and type.
   */
  private setChartConfig(): void {
    this.setChartOptions();
    this.setChartType();
  }

  /**
   * Set the chart configuration.
   */
  private setChartOptions(): void {
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          formatter: (value: any, ctx: any) => {
            if (ctx.chart.data.labels) {
              return ctx.chart.data.labels[ctx.dataIndex];
            }
          },
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: this.externalTooltipHandler
        }
      },
      onClick: (event, elements, chart) => {
        let index = elements[0].index;
        this.router.navigateByUrl('country/' + (index + 1));
      }
    };
  }

  /**
   * Set the chart type.
   */
  private setChartType(): void {
    this.pieChartType = 'pie';
  }

  /**
   * Callback to customize tooltip of the chart in order to insert icon.
   * @param {any} context The context of the chart.
   */
  private externalTooltipHandler(context: any) {
    // Tooltip Element
    let {chart, tooltip} = context;
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
  
      let table = document.createElement('table');
      table.style.margin = '0px';
  
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
    if (tooltip.body) {
      let titleLines = tooltip.title || [];
      let bodyLines = tooltip.body.map((b: any) => b.lines);
  
      let tableHead = document.createElement('thead');
  
      titleLines.forEach((title: any) => {
        let tr = document.createElement('tr');
        tr.style.borderWidth = '0';
  
        let th = document.createElement('th');
        th.style.borderWidth = '0';
        let text = document.createTextNode(title);
  
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
  
      let tableBody = document.createElement('tbody');
      bodyLines.forEach((body: any, i: any) => {
        let colors = tooltip.labelColors[i];
  
        let img = document.createElement('img');
        img.setAttribute('src', 'assets/img/medal.png');
        img.style.width = '20px';
        img.style.height = '20px';
  
        let tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = '0';
  
        let td = document.createElement('td');
        td.style.borderWidth = '0';
  
        let text = document.createTextNode(body);
  
        td.appendChild(img);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
  
      let tableRoot = tooltipEl.querySelector('table');
  
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
  
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
  
    let {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  }
}