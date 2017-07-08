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

function create_closest_way(screen, player, target) {
  let closest_way = [];

  // TODO построить массив ячек кратчайшего пути.
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
        console.log('closest_way', closest_way);

        if (closest_diamant.x > player.x && is_clear_right(screen, player)) {
          yield 'r';
        }

        if (closest_diamant.x < player.x && is_clear_left(screen, player)) {
          yield 'l';
        }

        if (closest_diamant.y < player.y && is_clear_up(screen, player)) {
          yield 'u';
        }

        if (closest_diamant.y > player.y && is_clear_down(screen, player)) {
          yield 'd';
        }
    }
};
