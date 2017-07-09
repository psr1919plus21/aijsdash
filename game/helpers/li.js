let source;
let target;
let field = '';
let map = [
  [{val: '[s]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[t]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}]
]

map.forEach((row, index) => {
  row.forEach((cell, i) => {
    cell.x = index;
    cell.y = i;
    field += cell.val;
    if (cell.val === '[t]') target = {x: cell.x, y: cell.y};
    if (cell.val === '[s]') source = {x: cell.x, y: cell.y};
  });
  field += '\n';
});


let targetAcheeved = false;
let moores = [];
let mooreStack = [];

function mooreWave(_source, _target, level = 0) {
  if (targetAcheeved || !_target) return moores;
  let moore = getMoore(_source, _target, level);
  let {cells} = moore;

  if (cells.length) {
    cells.forEach((cell) => mooreStack.push(cell));
  }

  if (moore.hasTarget) {
    targetAcheeved = moore.hasTarget;
    console.log('Target acheeved');
    moores.targetAcheeved = true;
    if (moore.cells.length) {
      moores.push(moore);
    }
    return moores;
  }

  if (mooreStack.length) {
    let nextCell = mooreStack.shift();
    mooreWave(nextCell, _target, nextCell.steps);
  }

  if (moore.cells.length) {
    moores.push(moore);
  }
  return moores;

}

function getMoore(cell, _target, level = 0) {
  let moore = {
    cells: [],
    level: level,
    hasTarget: false
  };

  if (!cell) {
    return moore;
  }

  let {x, y} = cell;

  if (!level && !('steps' in cell)) {
    let cell = map[x][y];
    cell.steps = 0;
    moore.cells.push(cell);
    return moore;
  }

  let CELLS = {
    N: map[x] ? map[x][y-1] : null,
    // NE: map[x+1] ? map[x+1][y-1] : null, -- Moore
    E: map[x+1] ? map[x+1][y] : null,
    // SE: map[x+1] ? map[x+1][y+1] : null,  -- Moore
    S: map[x] ? map[x][y+1] : null,
    // SW: map[x-1] ? map[x-1][y+1] : null,  -- Moore
    W: map[x-1] ? map[x-1][y] : null
    // NW: map[x-1] ? map[x-1][y-1] : null, -- Moore
  }

  for (item in CELLS) {
    let cell = CELLS[item];
    if (cell && !('steps' in cell) ) {
      if (cell.x === _target.x && cell.y === _target.y) {
        moore.hasTarget = true;
        cell.isTarget = true;
      }
      cell.steps = moore.level + 1;
      moore.cells.push(cell);
    }
  };

  moore.level++;
  return moore;
}

let _way = [];

function buildWay(wayMap, target) {
  if (wayMap.length) {
    let currentLevel = wayMap.shift();
    if (currentLevel.hasTarget) {
      let targetCell = currentLevel.cells.filter((cell) => {return cell.isTarget})[0];
      _way.push(targetCell);
      buildWay(wayMap, targetCell);
    } else {
      let CELLS = [];
      let {x, y} = target;
      let {cells} = currentLevel;
      let nextCell;

      cells.forEach((cell) => {
        if (cell.x === x && cell.y === (y - 1)) CELLS.push(cell);
        if (cell.x === x && cell.y === (y + 1)) CELLS.push(cell);
        if (cell.x === (x - 1) && cell.y === y) CELLS.push(cell);
        if (cell.x === (x + 1) && cell.y === y) CELLS.push(cell);
      });

      let minLevel = currentLevel.level;
      CELLS.forEach((cell) => {
        Math.min(minLevel, cell.steps);
      });

      nextCell = CELLS.filter((cell) => {
        return cell.steps === minLevel;
      })[0];

      nextCell = nextCell || target;

      _way.push(nextCell);
      buildWay(wayMap, nextCell);
    }
  }
}


console.log(field);
let moore = mooreWave(source, target);
let _moore = [].concat(moore);

let way = buildWay(_moore);

moore.forEach((row, index) => {
  row.cells.forEach((cell, i) => {
    if (cell.x === source.x && cell.y === source.y) {
      map[cell.x][cell.y].val = '[s]';
    } else {
      map[cell.x][cell.y].val = cell.isTarget ? `[t]` : `[${cell.steps}]`;
    }
  });
});

field = '';
map.forEach((row, index) => {
  row.forEach((cell, i) => {
    cell.x = index;
    cell.y = i;
    field += cell.val;
  });
  field += '\n';
});

console.log(field);


// WAY
_way.forEach((cell) => {
    let content = map[cell.x][cell.y].val;
    if (content !== '[s]' && content !== '[t]') {
      map[cell.x][cell.y].val = '[x]';
    }
});

field = '';
map.forEach((row, index) => {
  row.forEach((cell, i) => {
    cell.x = index;
    cell.y = i;
    field += cell.val;
  });
  field += '\n';
});

console.log(field);
