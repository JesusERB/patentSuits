import { Component, OnInit } from '@angular/core';
import {
  select,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  scaleOrdinal,
  schemeCategory10,
  drag,
  SimulationNodeDatum,
} from 'd3';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {

  private nodes = [
    { index: 0, id: 1, name: "Modulo 1" },
    { index: 1, id: 2, name: "Modulo 2" },
    { index: 2, id: 3, name: "Modulo 3" },
    { index: 3, id: 4, name: "Modulo 4" },
  ];
  private links = [
    { source: 1, target: 4 },
    { source: 2, target: 4 },
    { source: 3, target: 2 },


  ];

  /* private nodes = [
    { index: 0, name: '', group: 0},
    { index: 1, name: 'Fruit', group: 1 },
    { index: 2, name: 'Vegetable', group: 2  },
    { index: 3, name: 'Orange', group: 1 },
    { index: 4, name: 'Apple', group: 1 },
    { index: 5, name: 'Banana', group: 1 },
    { index: 6, name: 'Peach', group: 1},
    { index: 7, name: 'Bean', group: 2},
    { index: 8, name: 'Pea', group: 2 },
    { index: 9, name: 'Carrot', group: 2 },
  ];
  private links = [
    { source: this.nodes[0], target: this.nodes[1] },
    { source: this.nodes[0], target: this.nodes[2] },
    { source: this.nodes[1], target: this.nodes[3] },
    { source: this.nodes[1], target: this.nodes[4] },
    { source: this.nodes[1], target: this.nodes[5] },
    { source: this.nodes[1], target: this.nodes[6] },
    { source: this.nodes[2], target: this.nodes[7] },
    { source: this.nodes[2], target: this.nodes[8] },
    { source: this.nodes[2], target: this.nodes[9] },
    { source: this.nodes[1], target: this.nodes[2] },
  ]; */
  private color = scaleOrdinal(schemeCategory10);


  constructor() { }

  ngOnInit(): void {
    console.log(this.links);


  }

  createNodes() {
    const div: HTMLDivElement = document.querySelector('div')!;
    const svg = select('div').append('svg').attr('viewBox', '0 0 500 500');
    console.log(div.clientWidth);

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(this.links)
      .join('line');

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.nodes)
      .enter()
      .append('g');

    const circles = node
      .append('circle')
      .attr('r', 10)
      .style('fill', (n: any) => this.color(n.name))
      .style('cursor', 'pointer')
      .on('dblclick', (e) => alert(e.srcElement.__data__.name)).call;

    node.append('title').text((n) => n.name);

    const labels = node
      .append('text')
      .text((n) => n.name)
      .attr('x', 12)
      .attr('y', 3)
      .style('font-size', '12px')
      .style('color', (n) => this.color('' + n.name));

    node.append('title').text((n) => n.name);

    const simulation = forceSimulation(this.nodes)
      .force(
        'link',
        forceLink(this.links).id((d: any) => d.id)
          .distance(50)
      )
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(div.clientWidth / 2, 200))
      .tick()
      .on('tick', () => {
        node.attr('transform', (n: any) => 'translate(' + n.x + ',' + n.y + ')');
        link
          .attr('x1', (l: any) => l.source.x)
          .attr('y1', (l: any) => l.source.y)
          .attr('x2', (l: any) => l.target.x)
          .attr('y2', (l: any) => l.target.y);
      });

    const dragstarted = (e: any, d: SimulationNodeDatum) => {
      if (!e.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (e: any, d: SimulationNodeDatum) => {
      d.fx = e.x;
      d.fy = e.y;
    };

    const dragended = (e: any, d: SimulationNodeDatum) => {
      if (!e.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };
  }

  addModule() {
    //
    this.links = [];
    this.links.push({ source: 2, target: 1 });
    this.createNodes();
    console.log(this.links);
  }






}
