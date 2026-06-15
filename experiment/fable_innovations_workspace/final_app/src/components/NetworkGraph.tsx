import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  value: number;
}

export const NetworkGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    // Clear previous if any
    d3.select(svgRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const nodes: Node[] = Array.from({ length: 40 }, (_, i) => ({
      id: `node-${i}`,
      group: Math.floor(Math.random() * 3),
    }));

    const links: Link[] = Array.from({ length: 60 }, () => ({
      source: `node-${Math.floor(Math.random() * 40)}`,
      target: `node-${Math.floor(Math.random() * 40)}`,
      value: Math.random(),
    }));

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const colors = ['#a855f7', '#3b82f6', '#14b8a6'];

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(10));

    const link = svg.append('g')
      .attr('stroke-opacity', 0.4)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', (d) => Math.sqrt(d.value) * 2);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 6)
      .attr('fill', (d) => colors[d.group])
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5);

    // Add pulse animation
    node.append('animate')
      .attr('attributeName', 'r')
      .attr('values', '6;8;6')
      .attr('dur', (_, i) => `${2 + (i % 3)}s`)
      .attr('repeatCount', 'indefinite');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });

    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        svg.attr('width', newWidth).attr('height', newHeight);
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
        simulation.alpha(0.3).restart();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <svg ref={svgRef} className="w-full h-full overflow-visible" />
    </div>
  );
};
