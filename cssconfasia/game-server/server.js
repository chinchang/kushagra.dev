var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    http = require('http').Server(app),
    io = require('socket.io').listen(http),
    fs = require('fs');

http.listen(process.env.PORT || 8000);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  return next();
});

var players = [],
    correctStats = {},
    commands = {
        READY: 'ready'
    },
    levels = {
        0: ['color', 'red'],
        1: ['display', 'block'],
        2: ['white-space', 'nowrap'],
        3: ['border-collapse', 'collapse'],
        9: ['w', 'e']
    }
    level = 1;

function testSubmission(code) {
    // Empty String
    if (!code) return false;

    // Trim ending semicolon
    code = code.trim().replace(/;$/, '');

    var split = code.split(':').map(function (s) {
        return s.toLowerCase().trim();
    });

    // Not current syntax
    if (split.length < 2) return false;
    console.log('Check ', split, levels[level])

    // Match prop with prop and value with value.
    return split[0] === levels[level][0] && split[1] === levels[level][1]
};

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// Required for parsing POST request data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


function resetCorrectStats() {
    correctStats = {count: 0};
}

var broadcastStats = function() {};
var broadcastSubmission = function() {};

resetCorrectStats();

/////////////////
// POST endpoints
// //////////////
app.post('/code', function (req, res) {
    var code = req.body.code;
    console.log(players.length, 'Code from', req.ip, ' ', code);


    // res.send({success: 0, data: 'Syntax error in your code'});

    var passed = true;

    // Test submitted code.
    if (!testSubmission(code)) {
        passed = false;
        res.send({success: 0, data: 'Wrong Answer. Try again.'});
    }

    broadcastSubmission(code);

    if (passed) {
        var obj = {success: 1, data: correctStats[req.ip] ? 'You already passed this level. Relax.' : ''};

        res.send(obj);

        // CHeck is this IP has not already passed the current test.
        if (!correctStats[req.ip]) {
            correctStats.count++;
            correctStats[req.ip] = 1;
            broadcastStats();
        }
    }
});


///////////////////
// SOCKET listeners
///////////////////

io.sockets.on('connection', function (socket) {
    socket.emit('welcome', {msg: 'Hi, there! Welcome.', id: socket.id});

    var ip = socket.handshake.address,
        cookie = socket.handshake.headers.cookie;

    // If this is a connection from an admini
    if (cookie && cookie.indexOf(process.env.GAME_ADMIN_COOKIE || 'admin') !== -1) {
        console.log('Admin joined.')

        broadcastStats = function () {
            socket.emit('update-stats', {total: players.length - 1, correct: correctStats.count});
        }

        broadcastSubmission = function (code) {
            // console.log('Broadcasted submission to ',socket.id, ' ',  code)
            socket.emit('submission', code);
        }

        socket.on('set-level', function (l) {
            console.log('Reset level: ', l)
            level = parseInt(l, 10);
            resetCorrectStats();
            broadcastStats();
        });
    }

    socket.on('disconnect', function () {
        for (var i = players.length; i--;) {
            if (players[i] === socket) {
                console.log('player disconnect: ', ip)
                players.splice(i, 1);
                break;
            }
        }

        if (correctStats[ip]) {
            correctStats.count--;
            delete correctStats[ip];
        }

        if (socket.data) {
            broadcastStats();
        }
    });

    socket.on('msg', function (msg) {
        if (commands[msg ? msg.toUpperCase() : '']) {
            // we got a predefined command
            return;
        }

        socket.broadcast.emit('msg', '<b>' + socket.data.name + '</b>: ' + msg);
    });

    socket.on('set-data', function (data) {
        data.score = 0;
        socket.data =  data;
        socket.ip = ip;

        // save player in list
        players.push(socket);
        console.log('player joined: ', data && data.name);

        broadcastStats();
    });

    socket.on('update-data', function (data) {
        if (!socket.data) return;
        delete data.id;
        _.extend(socket.data, data);
    });
});


_ = {};
_.extend = function (obj) {
    [].slice.call(arguments, 1).forEach (function (source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};
