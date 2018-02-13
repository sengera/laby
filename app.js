var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs'),
    map = readmap(fs.readFileSync("./assets/map.txt",'utf8'));
    var laby = require('./laby.js');
    var pos = laby.locate_pos(map);
// Chargement de la page index.html
app.get('/laby', function (req, res) {
  res.sendfile(__dirname + '/laby.html');
  io.emit('message',{map : map, msg:"Welcome"});
});

io.on('connection', function (socket) {
    socket.emit('message',{map : map, msg:"Welcome"});
});

app.get('/laby/move/:mvt', function (req, res) {
    var pos = laby.locate_pos(map);
    // on passe à 0 la case de la position
    map[pos.x][pos.y] = laby.CODE_PATH;
    var move = req.params.mvt;
    var act = {x:0,y:0};
    switch (move) {
        case "haut":
            act.x = -1;
            break;
        case "bas":
            act.x = 1;
            break;
        case "gauche":
            act.y = -1;
            break;
        case "droite":
            act.y = 1;
            break;
        default:
            res.writeHead(404);
            res.end('move_not_foud');
            return;
            break;
    }
    if(!laby.is_valid_move(map,pos,act)){
        res.writeHead(200);
        res.end('wall');
        return;
    }
    pos=laby.do_move(map,pos,act);
    map[pos.x][pos.y] = laby.CODE_POS;
    var out_msg = move+"\n";
    if(is_sortie(map,pos)){
        out_msg += "GG WP";
    }
    io.emit('message',{map : map, msg:out_msg});
    res.writeHead(200);
    if(is_sortie(map,pos)){
        map = readmap(fs.readFileSync("./assets/map.txt",'utf8'));
        pos = laby.locate_pos(map);
        res.end('win');
    }else {
        res.end('ok');
    }
});


server.listen(8080);

function readmap(map_str) {
    //le slice permet de supprimer la ligne vide a la fin due au retour a la ligne de fin de fichier
    retrun = map_str.split('\r\n').slice(0,-1);
    for (var i = 0; i < retrun.length; i++) {
        retrun[i] = retrun[i].split(' ');
    }
    return retrun;
}
