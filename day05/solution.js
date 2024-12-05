const fs = require('fs').promises;
const path = require('path');
const { Graph, topologicalSort } = require('graph-data-structure');

let graph;

const initRuleGraph = rules => {
  const graph = new Graph();
  for (let rule of rules) {
    let [x, y] = rule.split('|').map(Number);
    graph.addEdge(x, y);
  }
  return graph;
};

const checkUpdate = update => {
  const n = update.length;

  for (let i = 0; i < n; i++) {
    let firstPage = update[i];

    for (let j = i + 1; j < n; j++) {
      let secondPage = update[j];

      if (
        graph.hasEdge(secondPage, firstPage) ||
        !graph.hasEdge(firstPage, secondPage)
      ) {
        return false;
      }
    }
  }

  return true;
};

const printQueue = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = data
    .trim()
    .split('\n')
    .map(line => line.trim());

  const emptyIndex = lines.indexOf('');
  const rules = lines.slice(0, emptyIndex);
  const updates = lines
    .slice(emptyIndex + 1)
    .map(update => update.split(',').map(Number));

  graph = initRuleGraph(rules);

  let orderedSum = 0;
  let unorderedSum = 0;
  for (let update of updates) {
    let middleIndex = Math.floor(update.length / 2);

    if (checkUpdate(update)) {
      orderedSum += update[middleIndex];
    } else {
      let auxGraph = initRuleGraph(rules);
      let graphNodes = auxGraph.nodes;
      let updateNodes = new Set(update);

      for (let node of graphNodes) {
        if (!updateNodes.has(node)) auxGraph.removeNode(node);
      }

      let sortedUpdate = topologicalSort(auxGraph);
      unorderedSum += sortedUpdate[middleIndex];
    }
  }

  return [orderedSum, unorderedSum];
};

printQueue().then(res => {
  console.log('Sum of middle page number (ordered):', res[0]);
  console.log('Sum of middle page number (unordered):', res[1]);
});
