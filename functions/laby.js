    const CODE_POS = '2';
    const CODE_PATH = '0';
    const CODE_WALL = '1';

    is_valid_move = function(map,pos,act) {
        var new_pos = {x:pos.x+act.x,y:pos.y+act.y};
        var retrun = new_pos.x < map.length && new_pos.y < map[0].length;
        retrun = retrun && map[new_pos.x][new_pos.y] == 0;
        return retrun;
    }

    do_move = function(map,pos,act) {
        if (is_valid_move(map,pos,act)) {
            return {x:pos.x+act.x,y:pos.y+act.y}
        }else{
            return pos;
        }
    }

    is_sortie = function(map,pos) {
        return pos.x == 0 ||pos.x>=map.length-1 || pos.y == 0 ||pos.y>=map[0].length-1;
    }

    locate_pos = function(map) {
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
                if(map[i][j] == CODE_POS)
                return {x:i,y:j};
            }
        }
    }

    module.exports = {
        CODE_POS: CODE_POS,
        CODE_PATH: CODE_PATH,
        CODE_WALL: CODE_WALL,
        is_valid_move: is_valid_move,

        do_move: do_move,

        is_sortie: is_sortie,
        locate_pos: locate_pos,
    };
