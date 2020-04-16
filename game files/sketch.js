let width, height, nodes, child_per_node, depth, diameter, node_length, infected_text, healthy_text;
let healthy_count, infected_count;
function setup() {
    width = innerWidth;
    height = innerHeight - 4;
    createCanvas(width, height);
    nodes = [];
    child_per_node = 3;
    diameter = 20;
    depth = 4;
    createNodes();
    healthy_count = calculateChildren(0);
    infected_count = 0;
    infected_text = new Text(20, 50, `Infected: ${infected_count}`, [255, 0, 0]);
    healthy_text = new Text(20, 100, `Healthy: ${healthy_count}`, [0, 255, 0]);
}

function draw() {
    background(0);
    drawLines();
    showNodes();
    infected_text.show();
    healthy_text.show();
    updateCounts();
}

function updateCounts() {
    let ill = 0;
    let healthy = 0;
    for(let i = 0; i < node_length; i++) {
        if(nodes[i].infected) { ill++; }
        else { healthy++; }
    }
    infected_text.setString(`Infected: ${ill}`);
    healthy_text.setString(`Healthy: ${healthy}`)
}

function showNodes() {
    for(let i = 0; i < node_length; i++) {
        nodes[i].show();
    }
} 
function drawLines() {
    for(let ctr = 1; ctr < node_length; ctr++) {
        let parentPos = findParentPos(nodes[ctr].pid);
        stroke(255);
        line(nodes[ctr].x, nodes[ctr].y, nodes[parentPos].x, nodes[parentPos].y);
    }
}

function findParentPos(pid) {
    for(let i = 0; i < node_length; i++) {
        if(nodes[i].id == pid) { return i; }
    }
}

function createNodes() {
    let ctr = 0;
    let startWidth = 20;
    let newStartWidth = startWidth;
    for(let i = 0; i < depth; i++) {
        let heightAvailable = height / (Math.pow(child_per_node, i) + 1);
        let startHeight = heightAvailable;
        let newStartHeight = startHeight;

        for(let j = 0; j < Math.pow(child_per_node, i); j++) {
            let id = `${i}${j}`;
            let pid;
            if (i != 0) {
                pid = `${i - 1}${Math.floor(j / child_per_node)}`;
            } else {
                pid = `00`;
            }
            let y = newStartHeight;
            nodes[ctr++] = new Node(newStartWidth, y, diameter, id, pid, false);
            newStartHeight += startHeight;
        }
        newStartWidth += 200;
    }
    node_length = ctr;
}

function mousePressed() {
    for(let i = 0; i < node_length; i++) {
        if(((mouseX > nodes[i].x - diameter / 2) && (mouseX < nodes[i].x + diameter / 2) && (mouseY > nodes[i].y - diameter / 2) && (mouseY < nodes[i].y + diameter / 2)) && i == 0) {
            nodes[i].infected = !nodes[i].infected;
            reverseAll();
        } else if((mouseX > nodes[i].x - diameter / 2) && (mouseX < nodes[i].x + diameter / 2) && (mouseY > nodes[i].y - diameter / 2) && (mouseY < nodes[i].y + diameter / 2)) {
            nodes[i].infected = !nodes[i].infected;
            reverseCondition(i);
        } else {
            continue;
        }
    }
}

function reverseAll() {
    condition = nodes[0].infected;
    for(let i = 0; i < node_length; i++) {
        nodes[i].infected = condition;
    }
}

function reverseCondition(index) {
    for(let i = 0; i < node_length; i++) {
        if(nodes[i].pid == nodes[index].id) {
            nodes[i].infected = nodes[index].infected;
            reverseCondition(i);
        }
    }
}

function calculateChildren(level) {
    let saved = 0;
    for(let i = 0; i < (depth - level); i++) {
        saved += Math.pow(child_per_node, i);
    }
    return saved;
}

class Node {
    constructor(x, y, r, id, pid, infected) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.id = id;
        this.pid = pid;
        this.infected = infected;
    }

    show() {
        ellipseMode(CENTER);
        if(this.infected) {
            fill(255, 0, 0);
        } else {
            fill(0, 255, 0);
        }

        ellipse(this.x, this.y, this.r, this.r);
    }
}

class Text {
    constructor(x1, y1, string, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.string = string;
        this.color = color;
    }

    setString(newstring) {
        this.string = newstring;
    }

    show() {
        stroke(this.color[0], this.color[1], this.color[2]);
        fill(this.color[0], this.color[1], this.color[2]);
        textSize(24);
        text(this.string, this.x1, this.y1);
    }
}