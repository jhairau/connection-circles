// Import stylesheets
import "./style.css";
import G6 from "@antv/g6";

const data = {
  nodes: [
    {
      id: "unhappy_customers",
      name: "Unhappy Customers"
    },
    {
      id: "response_time",
      name: "Response Time"
    },
    {
      id: "bugs_in_product",
      name: "Bugs in product"
    },
    {
      id: "new_features",
      name: "New Features"
    },
    {
      id: "support",
      name: "Support Tickets"
    }
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
    }
  ]
};

const width = document.getElementById("container").scrollWidth;
const height = document.getElementById("container").scrollHeight || 500;
const graph = new G6.Graph({
  container: "container",
  width,
  height,
  animate: true,
  linkCenter: true,
  modes: {
    default: [
      {
        type: "edge-tooltip",
        formatText: function formatText(model) {
          const text =
            "source: " + model.sourceName + "<br/> target: " + model.targetName;
          return text;
        }
      }
    ]
  },
  defaultNode: {
    style: {
      opacity: 0.8,
      lineWidth: 1,
      stroke: "#999"
    }
  },
  defaultEdge: {
    size: 1,
    color: "#e2e2e2",
    type: "arc",
    curveOffset: 1,
    style: {
      opacity: 0.6,
      lineAppendWidth: 3
    }
  }
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

  Object.assign(node, {
    x: radius * Math.cos(angle) + origin[0],
    y: radius * Math.sin(angle) + origin[1],
    angle,
    size: 40,
    style: {
      opacity: 0,
      fill: "colors[id % colors.length]",
    },
    label: node.name,
    labelCfg: {
      position: "right",
      style: {
        // rotate: angle,
        rotateCenter: "lefttop",
        textAlign: "start"
      }
    }
  });

  nodeMap.set(node.id, node);
});

edges.forEach(edge => {
  edge.type = "quadratic";
  const source = nodeMap.get(edge.source);
  const target = nodeMap.get(edge.target);
  
  edge.controlPoints = [
    {
      x: origin[0],
      y: origin[1]
    }
  ];
  edge.style = {
    stroke: "#000000",
    lineWidth: 2,
    endArrow: true
  };

  edge.sourceName = source.name;
  edge.targetName = target.name;

});

graph.data(data);
graph.render();

// Add Circle
graph.addItem("node", {
  type: "circle",
  x: origin[0],
  y: origin[1],
  size: radius * 2 + 10,
  style: {
    stroke: '#ababab',
    lineWidth: 3,
    fillOpacity: 0
  }
});