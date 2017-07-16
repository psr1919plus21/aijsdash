'use strict'; /*jslint node:true*/

function find_player(screen){
    for (let y = 0; y<screen.length; y++)
    {
        let row = screen[y];
        for (let x = 0; x<row.length; x++)
        {
            if (row[x]=='A')
                return {x, y};
        }
    }
}

function create_entity_map(screen, entity) {
  let entities = [];
  for (let y = 0; y<screen.length; y++)
  {
      let row = screen[y];
      for (let x = 0; x<row.length; x++)
      {
          if (row[x]==entity)
              entities.push({x, y});
      }
  }
  return entities;
}

function find_closest_entity(entities_map, player) {
  if (!entities_map.length) {
    return;
  }

  let minX = entities_map[0].x;
  let minY = entities_map[0].y;
  let delta = minX + minY;
  let closestEntityIndex = 0;
  entities_map.forEach((entity, index) => {
    let deltaX = Math.abs(player.x - entity.x);
    let deltaY = Math.abs(player.y - entity.y);

    minX = Math.min(minX, deltaX);
    minY = Math.min(minY, deltaY);
    let _delta = minX + minY;

    if (_delta < delta) {
      delta = _delta;
      closestEntityIndex = index;
    }
  });
  return entities_map[closestEntityIndex];
}

function is_clear_right(screen, player) {
  let {x, y} = player;
  return ' :*'.includes(screen[y][x+1])
      || screen[y][x+1]=='O' && screen[y][x+2]==' '
}

function is_clear_left(screen, player) {
  let {x, y} = player;
  return ' :*'.includes(screen[y][x-1])
      || screen[y][x-1]=='O' && screen[y][x-2]==' '
}

function is_clear_up(screen, player) {
  let {x, y} = player;
  return ' :*'.includes(screen[y-1][x])
}

function is_clear_down(screen, player) {
  let {x, y} = player;
  return ' :*'.includes(screen[y+1][x])
}

function make_map_array(_map) {
  let mapArray = [];
  _map.forEach((row, x_index) => {
    let rowArray = Array.from(row).map((cell, y_index) => {return {val: cell, x: y_index, y: x_index}});
    mapArray.push(rowArray);
  });
  return mapArray;
}

let _way = [];
let moore;
function liSearch(_source, _target, map, screen) {
  let targetAcheeved = false;
  let moores = [];
  let mooreStack = [];

  function mooreWave(_source, _target, level = 0) {
    if (targetAcheeved || !_target) return moores;
    let moore = getMoore(_source, _target, level);
    let {cells} = moore;
    // console.log('cells ', cells);


    if (cells.length) {
      cells.forEach((cell) => mooreStack.push(cell));
    }

    if (moore.hasTarget) {
      targetAcheeved = moore.hasTarget;
      // console.log('Target acheeved');
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
    let t = x;
    x = y;
    y = t;

    if (!level && !('steps' in cell)) {
      // console.log('\ncell');
      // console.log(`x: ${x} y: ${y}`);
      // console.log(map[x][y]);
      let cell = map[x][y];
      cell.steps = 0;
      moore.cells.push(cell);
      return moore;
    }

    // console.log('cell', cell);
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

    for (let item in CELLS) {
      let cell = CELLS[item];
      if (cell && !('steps' in cell) && cell.val !== '+') {
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


  function buildWay(wayMap, target) {
    if (wayMap.length) {
      // console.log(wayMap);
      let currentLevel = wayMap.shift();
      if (currentLevel.hasTarget) {
        let targetCell = currentLevel.cells.filter((cell) => {return cell.isTarget})[0];
        _way.push(targetCell);
        buildWay(wayMap, targetCell);
      } else {
        let CELLS = [];
        // console.log(target);
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

  moore = mooreWave(_source, _target);
  // console.log('moore');
  // console.log(moore);
  let _moore = [].concat(moore);
  let way = buildWay(_moore);
  return _way;
}


function create_closest_way(screen, player, target) {
    if (global.target && target.x !== global.target.x && target.y !== global.target.y) {
      global.way = false;
      global.target = false;
    }

    if (!global.way) {
      let mapArray = make_map_array(screen);
      let way = liSearch(player, target, mapArray, screen);
      global.way = global.way || way;
      global.target = global.target || target;
    }
    return global.way;
}

exports.play = function*(screen){
    while (true){
        let player = find_player(screen);
        let diamonts = create_entity_map(screen, '*');
        let closest_diamant = find_closest_entity(diamonts, player);
        if (!closest_diamant) {
          yield 'q';
        }

        let closest_way = create_closest_way(screen, player, closest_diamant);
        let {x, y} = closest_way.pop();

        if (x > player.x) {
          yield 'r';
        }

        if (x < player.x) {
          console.log('\n', x);
          yield 'l';
        }

        if (y < player.y) {
          yield 'u';
        }

        if (y > player.y) {
          yield 'd';
        }

    }
};
