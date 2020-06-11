// Import stylesheets
import './style.css';
import G6 from '@antv/g6';

const data = {
  nodes:  [
  {
    id: "unhappy_customers",
    name: 'Unhappy Customers'
  },
  {
    id: "response_time",
    name: 'Response Time'
  },
  {
    id: "bugs_in_product",
    name: 'Bugs in product'
  },
  {
    id: "new_features",
    name: 'New Features'
  },
    {
    id: "support",
    name: 'Support Tickets'
  },
],
  edges: [
  {
    source: "support",
    target: "response_time"
  },
  {
    source: "response_time",
    target: "unhappy_customers"
  },
  {
    source: "unhappy_customers",
    target: "support"
  },
  {
    source: "bugs_in_product",
    target: "unhappy_customers"
  },
  {
    source: "new_features",
    target: "unhappy_customers"
  },
  {
    source: "new_features",
    target: "bugs_in_product"
  },
]
}


const width = document.getElementById('container').scrollWidth;
const height = document.getElementById('container').scrollHeight || 500;
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  linkCenter: true,
  modes: {
    default: [
      {
        type: 'edge-tooltip',
        formatText: function formatText(model) {
          const text = 'source: ' + model.sourceName + '<br/> target: ' + model.targetName;
          return text;
        },
      },
    ],
  },
  defaultNode: {
    style: {
      opacity: 0.8,
      lineWidth: 1,
      stroke: '#999',
    },
  },
  defaultEdge: {
    size: 1,
    color: '#e2e2e2',
    type: 'arc',
    curveOffset: 1,
    style: {
      opacity: 0.6,
      lineAppendWidth: 3,
    },
  },
});
graph.on('edge:mouseenter', function(e) {
  const edge = e.item;
  graph.setItemState(edge, 'hover', true);
});
graph.on('edge:mouseleave', function(e) {
  const edge = e.item;
  graph.setItemState(edge, 'hover', false);
});


    const origin = [width / 2, height / 2];
    const radius = width < height ? width / 3 : height / 3;
    const edges = data.edges;
    const nodes = data.nodes;
    const nodeMap = new Map();
    const clusterMap = new Map();
    let clusterId = 0;
    const n = nodes.length;
    const angleSep = (Math.PI * 2) / n;
  
    nodes.forEach(function(node, i) {
     
      const angle = i * angleSep;
      node.x = radius * Math.cos(angle) + origin[0];
      node.y = radius * Math.sin(angle) + origin[1];
      node.angle = angle;
      nodeMap.set(node.id, node);
      // cluster
      if (node.cluster && clusterMap.get(node.cluster) === undefined) {
        clusterMap.set(node.cluster, clusterId);
        clusterId++;
      }
      const id = clusterMap.get(node.cluster);
      if (node.style) {
        node.style.fill = colors[id % colors.length];
      } else {
        node.style = {
          opacity: 0,
          fill: 'colors[id % colors.length]',
        };
      }
      // label
      node.label = node.name;
      node.labelCfg = {
        position: 'right',
        style: {
          // rotate: angle,
          rotateCenter: 'lefttop',
          textAlign: 'start',
        },
      };
    });

    edges.forEach(edge => {
      edge.type = 'quadratic';
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      edge.controlPoints = [
        {
          x: origin[0],
          y: origin[1],
        },
      ];
      edge.style = {
        stroke: '#ababab',
        lineWidth:2,
        endArrow: true,
      }

      edge.sourceName = source.name;
      edge.targetName = target.name;
    });

    // map the value to node size
    let maxValue = -9999,
      minValue = 9999;
    nodes.forEach(function(n) {
      if (maxValue < n.value) maxValue = n.value;
      if (minValue > n.value) minValue = n.value;
    });
    const sizeRange = [3, 30];
    const sizeDataRange = [minValue, maxValue];
    scaleNodeProp(nodes, 'size', 'value', sizeDataRange, sizeRange);

    graph.data(data);
    graph.render();

function scaleNodeProp(nodes, propName, refPropName, dataRange, outRange) {
  const outLength = outRange[1] - outRange[0];
  const dataLength = dataRange[1] - dataRange[0];
  nodes.forEach(function(n) {
    n[propName] = ((n[refPropName] - dataRange[0]) * outLength) / dataLength + outRange[0];
  });
}

graph.addItem('node', {
  type: 'circle',
  x: origin[0],
  y: origin[1],
  size: radius * 2 + 10,
  style: {
    lineWidth: 3,
    fillOpacity: 0
  }
})