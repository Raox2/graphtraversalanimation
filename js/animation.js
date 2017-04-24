function Node(x, y, label) {
	this.x = x;
	this.y = y;
	this.label = label;
	this.inspected = false;
	this.highlight = false;
	this.nearest = false;
}

Node.prototype = {
	constructor: Node()
}

function Edge(node1, node2, weight) {
	this.node1 = node1;
	this.node2 = node2;
	this.weight = weight;
	this.inspected = false;
	this.rejected = false;
	this.highlighted = false;
	this.crossed = false;
}

Edge.prototype = {
	constructor: Edge()
}

var size = 36;

var myNode = new Node(50, 50, "A");
var myNode2 = new Node(375, 425, "B");
var myNode3 = new Node(25, 375, "C");
var myNode4 = new Node(425, 50, "D");
var nodes = [myNode, myNode2, myNode3, myNode4];

var myEdge = new Edge("A", "B", 12);
var myEdge2 = new Edge("B", "C", 5);
var myEdge3 = new Edge("B", "D", 7);
var myEdge4 = new Edge("A", "C", 6);
var edges = [myEdge, myEdge2, myEdge3, myEdge4];

var animationStates = [];
var currentAnimState = 0;
var ignorenearest = false;

var dijkstrapseudocode = "";
var kruskalspseudocode = "";
var pseudocodeAnimState = 0;
var selectedAlgorithm = 0;

function findNode(label) {
	for (node in nodes) {
		if (nodes[node].label == label) {
			return nodes[node];
		}
	}
}

function resetAnimationStates() {
	currentAnimState = 0;
	pseudocodeAnimState = 0;
	animationStates = []; //Clear all animation states, aka, run a new algorithm.
	animationStates[0] = {}; //We start at no edges, and no nodes being highlighted.

	var animnodes = [];
	var animnearest = [];
	for (node in nodes) {
		animnodes[node] = false;
		animnearest[node] = 9999999;
	}
	animationStates[0].snodes = animnodes;
	animationStates[0].snodenearest = animnearest;

	var animedges = [];
	var animedgesreject = [];
	for (edge in edges) {
		animedges[edge] = false;
		animedgesreject[edge] = false;
	}
	animationStates[0].sedges = animedges;
	animationStates[0].sedgerejects = animedgesreject;
	animationStates[0].pscode = 0;
}

function addNewAnimationState() {
	var animlen = animationStates.length
	animationStates[animlen] = {};

	var animnodes = [];
	var animnearest = [];
	for (node in nodes) {
		animnodes[node] = nodes[node].inspected;
		animnearest[node] = nodes[node].nearest;
	}
	animationStates[animlen].snodes = animnodes;
	animationStates[animlen].snodenearest = animnearest;

	var animedges = [];
	var animedgesreject = [];
	for (edge in edges) {
		animedges[edge] = edges[edge].inspected;
		animedgesreject[edge] = edges[edge].rejected;
	}
	animationStates[animlen].sedges = animedges;
	animationStates[animlen].sedgerejects = animedgesreject;
	animationStates[animlen].pscode = pseudocodeAnimState;
}

function kruskals() {
	resetAnimationStates();

	ignorenearest = true;
	selectedAlgorithm = 2;

	var connectedNodes = new Set();
	var minimumSpanningTreeEdges = [];
	var visitedEdges = []; // Needed
	var nodeSets = [];

	for (node in nodes) {
		nodeSets[nodes[node].label] = node;
		nodes[node].nearest = false;
	}

	while (visitedEdges.length != edges.length) {
		var minweight = 9999999;
		var inspectedEdge;
		for (edge in edges) {
			var edgedata = edges[edge];
			var visited = false;

			for (visitEdge in visitedEdges) {
				if (visitedEdges[visitEdge] == edge) {
					visited = true;
				}
			}

			if (!visited && edgedata.weight < minweight) {
				minweight = edgedata.weight;
				inspectedEdge = edge;
			}
		}

		visitedEdges.push(inspectedEdge);

		var prevsize = connectedNodes.size;
		var edgedata = edges[inspectedEdge];
		connectedNodes.add(edgedata.node1);
		connectedNodes.add(edgedata.node2);

		var insnodedata1 = findNode(edgedata.node1)
		insnodedata1.inspected = true;
		var insnodedata2 = findNode(edgedata.node2)
		insnodedata2.inspected = true;

		if (nodeSets[edgedata.node1] != nodeSets[edgedata.node2]) {
			minimumSpanningTreeEdges.push(inspectedEdge);
			edgedata.inspected = true;
			pseudocodeAnimState = 1;
			addNewAnimationState();

			if (connectedNodes.size != prevsize + 2) {
				var valcount1 = 0;
				var valcount2 = 0;

				for (nodeSet in nodeSets) {
					if (nodeSets[nodeSet] == nodeSets[edgedata.node1]) {
						valcount1++;
					} else if (nodeSets[nodeSet] == nodeSets[edgedata.node2]) {
						valcount2++;
					}
				}

				var mergeset = 0;
				var targetset = 0;
				if (valcount1 => valcount2) {
					mergeset = nodeSets[edgedata.node2];
					targetset = nodeSets[edgedata.node1];
				} else {
					mergeset = nodeSets[edgedata.node1];
					targetset = nodeSets[edgedata.node2];
				}

				for (nodeSet in nodeSets) {
					if (nodeSets[nodeSet] == mergeset) {
						nodeSets[nodeSet] = targetset;
					}
				}
			} else {
				nodeSets[edgedata.node2] = nodeSets[edgedata.node1];
			}
		} else {
			edgedata.rejected = true;
			pseudocodeAnimState = 2;
			addNewAnimationState();
		}
	}

	for (node in nodes) {
		nodes[node].inspected = false;
	}

	for (edge in edges) {
		edges[edge].inspected = false;
		edges[edge].rejected = false;
	}

	updateAnimState();
}

function dijkstra() {
	resetAnimationStates();

	ignorenearest = false;
	selectedAlgorithm = 1;

	var startingNode = document.getElementById("startingnode").value;
	var visitedNodes = [];
	var visitCount = 0;
	var nearestKnownDistance = [];

	for (node in nodes) {
		var nodelabel = nodes[node].label;
		nearestKnownDistance[nodelabel] = 9999999;

		if (nodelabel == startingNode) {
			nearestKnownDistance[nodelabel] = 0;
		}

		nodes[node].nearest = nearestKnownDistance[nodelabel];
	}

	while (visitCount != nodes.length) {
		var mindist = 9999999;
		var inspectedNode;
		for (node in nodes) {
			var nodelabel = nodes[node].label;

			if (nearestKnownDistance[nodelabel] < mindist && !visitedNodes[nodelabel]) {
				mindist = nearestKnownDistance[nodelabel];
				inspectedNode = nodelabel;
			}
		}

		var insnodedata = findNode(inspectedNode)
		insnodedata.inspected = true;
		pseudocodeAnimState = 1;
		addNewAnimationState();

		for (edge in edges) {
			var edgedata = edges[edge];
			var dist = nearestKnownDistance[inspectedNode] + edgedata.weight;

			if (edgedata.node1 == inspectedNode && !visitedNodes[edgedata.node1]) {
				edgedata.inspected = true;
				pseudocodeAnimState = 2;
				addNewAnimationState();

				if (dist < nearestKnownDistance[edgedata.node2]) {
					nearestKnownDistance[edgedata.node2] = dist;

					node2data = findNode(edgedata.node2)
					node2data.nearest = nearestKnownDistance[edgedata.node2];
				}
			} else if (edgedata.node2 == inspectedNode && !visitedNodes[edgedata.node2]) {
				edgedata.inspected = true;
				pseudocodeAnimState = 3;
				addNewAnimationState();

				if (dist < nearestKnownDistance[edgedata.node1]) {
					nearestKnownDistance[edgedata.node1] = dist;

					node1data = findNode(edgedata.node1)
					node1data.nearest = nearestKnownDistance[edgedata.node1];
				}
			}

			edgedata.inspected = false;
		}

		insnodedata.inspected = false;

		visitedNodes[inspectedNode] = true;
		visitCount++;
	}

	for (node in nodes) {
		nodes[node].nearest = false;
	}

	updateAnimState();
}

function drawEdge(context, edgedata) {
	var nodedata1 = findNode(edgedata.node1)
	var nodedata2 = findNode(edgedata.node2)

	if (edgedata.highlighted) {
		context.strokeStyle="#c72";
	} else {
		context.strokeStyle="#222";
	}

	context.beginPath();
	context.moveTo(size/2 + nodedata1.x, size/2 + nodedata1.y);
	context.lineTo(size/2 + nodedata2.x, size/2 + nodedata2.y);
	context.stroke();

	context.fillStyle="#555";
	context.fillText(edgedata.weight, size/2 + (nodedata1.x + nodedata2.x)/2 + 14, size/2 + (nodedata1.y + nodedata2.y)/2 - 14);

	if (edgedata.crossed) {
		context.strokeStyle="#d33";

		context.beginPath();
		context.moveTo(size/2 + (nodedata1.x + nodedata2.x)/2 - 12, size/2 + (nodedata1.y + nodedata2.y)/2 - 12);
		context.lineTo(size/2 + (nodedata1.x + nodedata2.x)/2 + 12, size/2 + (nodedata1.y + nodedata2.y)/2 + 12);
		context.stroke();

		context.beginPath();
		context.moveTo(size/2 + (nodedata1.x + nodedata2.x)/2 + 12, size/2 + (nodedata1.y + nodedata2.y)/2 - 12);
		context.lineTo(size/2 + (nodedata1.x + nodedata2.x)/2 - 12, size/2 + (nodedata1.y + nodedata2.y)/2 + 12);
		context.stroke();
	}
}

function drawNode(context, nodedata) {
	var isStart = document.getElementById("startingnode").value == nodedata.label;

	if (nodedata.highlighted && isStart) {
		context.fillStyle="#7b2";
	} else if (nodedata.highlighted) {
		context.fillStyle="#d83";
	} else if (isStart) {
		context.fillStyle="#4a3";
	} else {
		context.fillStyle="#444";
	}
	context.fillRect(nodedata.x, nodedata.y, size, size);

	context.fillStyle="#ccc";
	context.font = "20px Arial";
	context.fillText(nodedata.label, size/2 + nodedata.x, size/2 + nodedata.y);

	if (!ignorenearest && nodedata.nearest) {
		context.fillStyle="#5a2";
		context.font = "bold 16px Arial";
		context.fillText(nodedata.nearest == 9999999 ? "?" : nodedata.nearest, size + nodedata.x + 12, nodedata.y - 12);
	}
}

function drawAnimationCanvas() {
	var canvas = document.getElementById("animcanvas");
	var context = canvas.getContext("2d");

	context.clearRect(0, 0, 500, 500) // Clear.

	context.font = "bold 13px Arial";
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.lineWidth = 3;

	for (edge in edges) {
		drawEdge(context, edges[edge]);
	}

	context.font = "20px Arial";
	for (node in nodes) {
		drawNode(context, nodes[node]);
	}
}

function deleteNode(node) {
	var nodelabel = nodes[node].label; // Needed for later
	nodes.splice(node, 1); // Splice shuffles up the rest of the array elems

	for (var i = edges.length-1; i >= 0; i--) { // Reverse order, to ensure no elements are skipped
	    if (edges[i].node1 == nodelabel || edges[i].node2 == nodelabel) {
	        edges.splice(i, 1); // Remove the edge. One of the nodes does not exist anymore.
	    }
	}

	drawAnimationCanvas();
	updateChoices();
}

function createNode(clickX, clickY) {
	var nlen = nodes.length;
	var char = String.fromCharCode(65 + nlen);

	nodes[nlen] = new Node(clickX - size/2, clickY - size/2, char);

	drawAnimationCanvas();
	updateChoices();
}

function addEdge() {
	var addenode1 = document.getElementById("addenode1").value;
	var addenode2 = document.getElementById("addenode2").value;
	var addeweight = parseInt(document.getElementById("addeweight").value);

	if (isNaN(addeweight) || addeweight == "") {
		alert("Invalid weight entered.");
		return;
	}

	if (addenode1 == addenode2) {
		alert("Self returning edges don't exist in the context of computer networks.");
		return;
	}

	for (edge in edges) {
		var edgedata = edges[edge];

		if ((edgedata.node1 == addenode1 && edgedata.node2 == addenode2) ||
			(edgedata.node2 == addenode1 && edgedata.node1 == addenode2)) {
				edgedata.weight = addeweight;
				addeweight = "";

				drawAnimationCanvas();
				return;	// Updated instead.
		}
	}

	edges[edges.length] = new Edge(addenode1, addenode2, addeweight);
	addeweight = "";

	drawAnimationCanvas();
}

function removeEdge() {
	var addenode1 = document.getElementById("addenode1").value;
	var addenode2 = document.getElementById("addenode2").value;

	for (edge in edges) {
		var edgedata = edges[edge];

		if (edgedata.node1 == addenode1 && edgedata.node2 == addenode2) {
			edges.splice(edge, 1);

			drawAnimationCanvas();
			return;
		}
	}

	alert("No edge found for deletion.")
}

function mouseClick(event) {
	var canvas = document.getElementById("animcanvas");
	var context = canvas.getContext("2d");
	var rect = canvas.getBoundingClientRect();

	var clickX = event.clientX - rect.left;
	var clickY = event.clientY - rect.top;

	var deleteNodeID = false;

	for (node in nodes) {
		var nodedata = nodes[node];
		if (clickX > nodedata.x && clickX < nodedata.x + size &&
			clickY > nodedata.y && clickY < nodedata.y + size) {
			deleteNodeID = node;
			break;
		}
	}

	if (deleteNodeID) {
		deleteNode(node);
	} else {
		createNode(clickX, clickY);
	}
}

function updateChoices() {
	var startingNode = document.getElementById("startingnode");
	var addenode1 = document.getElementById("addenode1");
	var addenode2 = document.getElementById("addenode2");

	startingNode.options.length = 0;
	addenode1.options.length = 0;
	addenode2.options.length = 0;

	for (node in nodes) {
		var option = document.createElement("option");
		var optione1 = document.createElement("option");
		var optione2 = document.createElement("option");
		option.value = nodes[node].label;
		option.text = nodes[node].label;
		optione1.value = nodes[node].label;
		optione1.text = nodes[node].label;
		optione2.value = nodes[node].label;
		optione2.text = nodes[node].label;

		startingNode.add(option);
		addenode1.add(optione1);
		addenode2.add(optione2);
	}
}

function updateAnimState() {
	for (node in nodes) {
		nodes[node].highlighted = animationStates[currentAnimState].snodes[node];
		nodes[node].nearest = animationStates[currentAnimState].snodenearest[node];
	}

	for (edge in edges) {
		edges[edge].highlighted = animationStates[currentAnimState].sedges[edge];
		edges[edge].crossed = animationStates[currentAnimState].sedgerejects[edge];
	}

	pseudocodeStrings();

 	if (selectedAlgorithm == 1) {
		document.getElementById("psuedocode").innerHTML = dijkstrapseudocode;
	} else if (selectedAlgorithm == 2) {
		document.getElementById("psuedocode").innerHTML = kruskalspseudocode;
	} else {
		document.getElementById("psuedocode").innerHTML = "";
	}

	var htmlString = "Step " + currentAnimState + "/" + (animationStates.length-1);
	document.getElementById("timestep").innerHTML = htmlString;
	drawAnimationCanvas();
}

function nextStep() {
	if (currentAnimState < (animationStates.length-1)) {
		currentAnimState++;
	}

	updateAnimState();
}

function prevStep() {
	if (currentAnimState > 0) {
		currentAnimState--;
	}

	updateAnimState();
}

function resizeNodes() {
	var sizeValue = document.getElementById("nodesize").value;

	switch (sizeValue) {
		case "small":
			size = 24;
			break;
		case "medium":
			size = 36;
			break;
		case "large":
			size = 48;
			break;
		default:
			size = 36;
	}

	drawAnimationCanvas()
}

function pseudocodeStrings() {
	dijkstrapseudocode = "for each node in nodes do<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;if node == startingnode then<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nearestdistance = 0<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;else<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nearestdistance = infinity<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;endif<br />" +
	"endfor<br /><br />" +

	"while visitednodecount != node count do<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;//Find the node to inspect.<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;let mindist = infinity<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;let inspectednode = ?<br /><br />";

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 1) {
		dijkstrapseudocode = dijkstrapseudocode + "<span class='pschighlight'>";
	}

	dijkstrapseudocode = dijkstrapseudocode + "&nbsp;&nbsp;&nbsp;&nbsp;for each node in nodes do<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if node != visited and nodedistance < mindist then<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mindist = nodedistance<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inspectednode = node<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endif<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;endfor<br /><br />";

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 1) {
		dijkstrapseudocode = dijkstrapseudocode + "</span>";
	}

	dijkstrapseudocode = dijkstrapseudocode + "&nbsp;&nbsp;&nbsp;&nbsp;for each edge in edges do<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let dist = nearestdistance + edgeweight<br /><br />";

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 2) {
		dijkstrapseudocode = dijkstrapseudocode + "<span class='pschighlight'>";
	}

	dijkstrapseudocode = dijkstrapseudocode + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if edgenode1 == inspectedNode and edgenode1 != visited then<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if dist < nearestdistancenode2 then<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nearestdistancenode2 = dist<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endif<br />";

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 2) {
		dijkstrapseudocode = dijkstrapseudocode + "</span>";
	}

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 3) {
		dijkstrapseudocode = dijkstrapseudocode + "<span class='pschighlight'>";
	}

	dijkstrapseudocode = dijkstrapseudocode + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;elseif edgenode2 == inspectedNode and edgenode2 != visited then<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if dist < nearestdistancenode1 then<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nearestdistancenode1 = dist<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endif<br />";

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 3) {
		dijkstrapseudocode = dijkstrapseudocode + "</span>";
	}

	dijkstrapseudocode = dijkstrapseudocode + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endif<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;endfor<br /><br />" +

	"&nbsp;&nbsp;&nbsp;&nbsp;visitednodecount = visitednodecount + 1<br />" +
	"endwhile";

	kruskalspseudocode = "let connectednodes = {} // Empty set.<br />" +
	"let minimumspanningtree = [];<br /><br />" +

	"while visitededgecount != edgecount do<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;let mindist = infinity<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;let inspectededge = ?<br /><br />" +

	"&nbsp;&nbsp;&nbsp;&nbsp;for each edge in edges do<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if edge != visited and edgedist < mindist then<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mindist = edgedistance<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inspectededge = edge<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endif<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;endfor<br /><br />" +

	"&nbsp;&nbsp;&nbsp;&nbsp;connectednodes.addnewnode(node1)<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;connectednodes.addnewnode(node2)<br /><br />";

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 1) {
		kruskalspseudocode = kruskalspseudocode + "<span class='pschighlight'>";
	}

	kruskalspseudocode = kruskalspseudocode + "&nbsp;&nbsp;&nbsp;&nbsp;if cycle not formed by edge then<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;minimumspanningtree.add(edge)<br />";

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 1) {
		kruskalspseudocode = kruskalspseudocode + "</span>";
	}

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 2) {
		kruskalspseudocode = kruskalspseudocode + "<span class='pschighlight'>";
	}

	kruskalspseudocode = kruskalspseudocode + "&nbsp;&nbsp;&nbsp;&nbsp;else<br />" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rejectedge(edge)<br />";

	if (animationStates.length > 0 && animationStates[currentAnimState].pscode == 2) {
		kruskalspseudocode = kruskalspseudocode + "</span>";
	}

	kruskalspseudocode = kruskalspseudocode + "&nbsp;&nbsp;&nbsp;&nbsp;end<br />" +
	"endwhile";
}

document.addEventListener("DOMContentLoaded", function() {
	var canvas = document.getElementById("animcanvas");
	canvas.addEventListener("mousedown", mouseClick);

	updateChoices();
	drawAnimationCanvas();
	pseudocodeStrings();
});
