let map = [
  [{val: '[_]'}, {val: '[_]'}, {val: '[t]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[s]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}]
]

let source ;
let target;

let field = '';
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
  // console.log('cells', cells);

  if (cells.length) {
    cells.forEach((cell) => mooreStack.push(cell));
  }

  if (moore.hasTarget) {
    targetAcheeved = moore.hasTarget;
    console.log('Target acheeved');
    moores.targetAcheeved = true;
    moores.push(moore);
    return moores;
  }

  if (mooreStack.length) {
    // console.log('run recurcieve');
    let nextCell = mooreStack.shift();
    mooreWave(nextCell, _target, nextCell.steps);
  }

  moores.push(moore);
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

  if (!level && !cell.steps) {
    let cell = map[x][y];
    cell.steps = 0;
    moore.cells.push(cell);
  }

  let CELLS = {
    N: map[x] ? map[x][y-1] : null,
    // NE: map[x+1] ? map[x+1][y-1] : null,
    E: map[x+1] ? map[x+1][y] : null,
    // SE: map[x+1] ? map[x+1][y+1] : null,
    S: map[x] ? map[x][y+1] : null,
    // SW: map[x-1] ? map[x-1][y+1] : null,
    W: map[x-1] ? map[x-1][y] : null
    // NW: map[x-1] ? map[x-1][y-1] : null,
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
  // console.log(moore);

  moore.level++;
  return moore;
}


console.log(field);
let moore = mooreWave(source, target);
// console.log(moore);

moore.forEach((row, index) => {
  row.cells.forEach((cell, i) => {
    map[cell.x][cell.y].val = cell.isTarget ? `[t]` : `[${cell.steps}]`;
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
console.log(mooreStack);
