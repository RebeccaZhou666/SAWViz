let n;
let m;
let squareW = 40;
let path_size;
let start;
let trial = 0;

let graph = []; // graph of matrix;
let visited = []; //all false for start.
let path = [];
let isSuccess = false;

// draw saw path
let currentTime;
let startTime;
let interval = 400;
let colorA;
let colorB;
let pPath = 0;
let rectWidth;
let rectHeight;



function setup() {
    //reset all necessary paras
    createCanvas(window.innerWidth, window.innerHeight);
    m = Math.floor(window.innerWidth / squareW);
    n = Math.floor(window.innerHeight / squareW);
    path_size = m * n;

    resetGraph(m, n);
    resetPath();

    //init path, begin with a random point
    start = Math.floor(Math.random() * n * m);
    print(start);
    path.push(start);
    visited[start] = true;
    trial++;

    //recurring calculation of saw paths
    while (!generateSAW(start) && trial < m * n) {
        print("Fail, another try");
        var newStart = start + 1;
        newStart = newStart % (m * n);
        start = newStart;
        resetPath();
        print(start);
        trial++;
    }

    if (trial >= m * n) {
        //fail to find;
        print("Total Failure");
        noLoop();
    } else {
        //success
        print(path);
        print("success");

        // draw path
        isSuccess = true;

        background(255);
        colorA = color('#ff414d');
        colorB = color('#1aa6b7');

        startTime = millis();
        // noLoop();
    }

}

function draw() {
    if (isSuccess) {
        // draw path
        currentTime = millis();
        if (currentTime - startTime >= interval && pPath < path.length) {
            var xoffset = Math.floor(path[pPath] / n);
            var yoffset = path[pPath] - (xoffset) * n;
            print(xoffset, yoffset);

            var interColor = lerpColor(colorA, colorB, 1 / path.length * (pPath + 1));
            var antiColor = lerpColor(colorB, colorA, 1 / path.length * (pPath + 1));
            stroke(antiColor);
            fill(interColor);
            rect((xoffset) * squareW, (yoffset) * squareW, squareW, squareW);
            pPath++;

            noStroke();
            fill('rgba(255,255,255,0.01)');
            rect(0, 0, window.innerWidth, window.innerHeight);
        }
    }


}


function generateSAW(start) {
    return saw(graph, visited, path, start);
}

function resetGraph(m, n) { // lattice consider as a special graph
    graph = [];

    // a 5*5 matrix is represented as a 25*25 graph
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            graph[i * n + j] = [];
            for (let k = 0; k < m * n; k++) {
                graph[i * n + j][k] = false;
            }
        }
    }

    // create graph for matrix: 
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            var offset = i * n + j;
            if (j - 1 >= 0) {
                graph[offset][offset - 1] = true;
            }
            if (j + 1 < n) {
                graph[offset][offset + 1] = true;
            }
            if (i - 1 >= 0) {
                graph[offset][offset - n] = true;
            }
            if (i + 1 < m) {
                graph[offset][offset + n] = true;
            }
        }
    }
}

function resetPath() {
    path = [];
    visited = [];
    for (let i = 0; i < path_size; i++) {
        visited[i] = false;
    }
}

function saw(graph, visited, path, pivot) {
    if (path.length == path_size) {
        return true;
    }

    // look for next move from pivot
    for (let i = 0; i < m * n; i++) {
        if (graph[pivot][i]) {
            if (visited[i] == false) {
                visited[i] = true;
                path.push(i);

                if (saw(graph, visited, path, i)) return true;
                visited[i] = false;
                path.pop();
            }
        }
    }
    return false;
}
