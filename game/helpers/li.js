let map = [
  [{val: '[s]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[t]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}],
  [{val: '[_]'}, {val: '[_]'}, {val: '[_]'}]
]

let source = { x: 0, y: 0};
let target;

let field = '';
map.forEach((row, index) => {
  row.forEach((cell, i) => {
    cell.x = index;
    cell.y = i;
    field += cell.val;
    if (cell.val === '[t]') target = {x: cell.x, y: cell.y};
  });
  field += '\n';
});

let targetAcheeved = false;
let targetOut = false;
let moores = [];
function checkMoore(_source, _target, level = 0) {
  if (targetAcheeved || targetOut || !_target) return moores;

  let moore = getMoore(_source, _target, level);

  if (moore.hasTarget) {
    targetAcheeved = moore.hasTarget;
    console.log('Target acheeved');
    moores.targetAcheeved = true;
    moores.push(moore);
    return moores;
  }


  moore.cells.forEach((cell) => {
    return checkMoore(cell, _target, moore.level);
  });
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
  let CELLS = {
    N: map[x] ? map[x][y-1] : null,
    NE: map[x+1] ? map[x+1][y-1] : null,
    E: map[x+1] ? map[x+1][y] : null,
    SE: map[x+1] ? map[x+1][y+1] : null,
    S: map[x] ? map[x][y+1] : null,
    SW: map[x-1] ? map[x-1][y+1] : null,
    W: map[x-1] ? map[x-1][y] : null,
    NW: map[x-1] ? map[x-1][y-1] : null,
  }

  for (item in CELLS) {
    let cell = CELLS[item];
    if (cell && !cell.steps) {
      if (cell.x === _target.x && cell.y === _target.y) moore.hasTarget = true;
      cell.steps = moore.level + 1;
      moore.cells.push(cell);
    }
  };
  // console.log(moore);

  moore.level++;
  return moore;
}


console.log(field);
let moore = checkMoore(source, target);
// console.log(moore);
console.log(moore.targetAcheeved);

moore.forEach((row, index) => {
  row.cells.forEach((cell, i) => {
    map[cell.x][cell.y].val = '[x]';
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
