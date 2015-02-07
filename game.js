(function() {
    var CELL_SIZE = 10;
    var MAX_X = Math.floor(window.innerWidth / CELL_SIZE);
    var MAX_Y = Math.floor(window.innerHeight / CELL_SIZE);
    var WIDTH = CELL_SIZE * MAX_X;
    var HEIGHT = CELL_SIZE * MAX_Y;
    var LIVE_COLOR = randomColor();
    var DEAD_COLOR = randomColor();
    
    function randomColor() {
        var rgbs = [];
        
        for (var i = 0; i < 3; i++) {
            rgbs.push(Math.floor(Math.random() * 255));
        }
        
        return 'rgb(' + rgbs.join(',') + ')';
    }
    
    function memoizeGrid(grid) {
        var cache = {};
        
        return function(x, y) {
            var key = x + ' ' + y;
            
            if (key in cache) {
                return cache[key];
            } else {
                return (cache[key] = grid(x, y));
            }
        };
    }
    
    function evolveGrid(grid) {
        return memoizeGrid(function(x, y) {
            var alive = grid(x, y);
            var live_neighbors = 0;
            
            outer:
            for (var i = x - 1; i <= x + 1; i++) {
                for (var j = y - 1; j <= y + 1; j++) {
                    // Skip ourselves and dead neighbors.
                    if ((i == x && j == y) || !grid(i, j)) {
                        continue;
                    }
                    
                    live_neighbors++;
                    
                    // Optimization: there's no need to count past three.
                    if (live_neighbors > 3)
                        break outer;
                }
            }
            
            if (alive) {
                return live_neighbors == 2 || live_neighbors == 3;
            } else {
                return live_neighbors == 3;
            }
        });
    };
    
    function drawGrid(grid, context) {
        context.clearRect(0, 0, WIDTH, HEIGHT);
        
        for (var x = 0; x < MAX_X; x++) {
            for (var y = 0; y < MAX_Y; y++) {
                var alive = grid(x, y);
                
                context.fillStyle = alive ? LIVE_COLOR : DEAD_COLOR;
                context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
        
        grid = evolveGrid(grid);
        
        setTimeout(drawGrid.bind(null, grid, context), 1000);
    }
    
    var randomGrid = memoizeGrid(function(x, y) {
        return Math.random() < 0.5;
    });
    
    var canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    document.body.appendChild(canvas);
    
    drawGrid(randomGrid, canvas.getContext('2d'));
})();
