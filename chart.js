import Raphael from 'raphael'
import { v4 as uuidv4 } from 'uuid';

Raphael.fn.connection = function (obj1, obj2, line, bg) {

    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }

    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};

class EventModelElement {
   constructor(options = {}){
      Object.assign(this, {
          uuid: uuidv4()
      }, options);
    }
};

class Interface extends EventModelElement {
}

class Command extends EventModelElement {
}

class Event extends EventModelElement {
}

class ReadModel extends EventModelElement {
}

let ui = [ new Interface, new Interface, new Interface ];
let commands = [ new Command({ui: ui[0]}), new Command, new Command ];
let events = [ new Event({command: commands[0]}), new Event, new Event ];
let read_models = [ new ReadModel({event: events[0]}), new ReadModel, new ReadModel ];

const model = {
  ui: ui,
  commands: commands,
  events: events,
  read_models: read_models
}

export default function () {
    var dragger = function () {
        this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
        this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
        this.animate({"fill-opacity": .2}, 500);
    },
    move = function (dx, dy) {
        var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
        this.attr(att);
        for (var i = connections.length; i--;) {
            paper.connection(connections[i]);
        }
        //paper.safari();
    },
    up = function () {
        this.animate({"fill-opacity": 0}, 500);
    };

    let w = 600, h = 800;

    paper = Raphael("chart",w,h);
    paper.setViewBox(0,0,w,h,true);
    paper.setSize('100%', '100%');

    //connections = [],
    //shapes = [  paper.ellipse(190, 100, 30, 20),
    //            paper.rect(290, 80, 60, 40, 10),
    //            paper.rect(290, 180, 60, 40, 2),
    //            paper.ellipse(450, 100, 20, 20)
    //        ];
    //for (var i = 0, ii = shapes.length; i < ii; i++) {
    //    var color = Raphael.getColor();
    //    shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    //    shapes[i].drag(move, dragger, up);
    //}
    //connections.push(paper.connection(shapes[0], shapes[1], "#fff"));
    //connections.push(paper.connection(shapes[1], shapes[2], "#fff", "#fff|5"));
    //connections.push(paper.connection(shapes[1], shapes[3], "#000", "#fff"));

    const colourise = function(shape) {
      let color = Raphael.getColor();
      shape.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    };
   
    const shapes = [];
    const connections = [];

    // Draw the interface elements
    let x = 190;
    let y = 100;
    model.ui.forEach( (ui) => {
      let shape = paper.ellipse(x, y, 30, 20);
      shape.data('element', ui);
      shapes.push(shape);
      paper.text(x, y, ui.uuid);
      x = x + 100;

      colourise(shape);
      shape.drag(move, dragger, up);
    });

    // Draw the command elements
    x = 190;
    y = 150;
    model.commands.forEach( (command) => {
      let shape = paper.rect(x, y, 40, 10);
      shape.data('element', command);
      shapes.push(shape);
      paper.text(x, y, command.uuid);
      x = x + 100;

      colourise(shape);
      shape.drag(move, dragger, up);
   
      // look in shapes see if any connect to this command (via .ui attr)..
      shapes.forEach( (other_shape) => {
        if (other_shape.data('element').uuid === command.ui.uuid) {
          connections.push(paper.connection(other_shape, shape, "#fff"));
        }
      });
    });

};

