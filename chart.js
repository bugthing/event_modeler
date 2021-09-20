import Raphael from 'raphael'

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

export default class Chart {
  constructor(model) {
    this.model = model;
    this.shapes = [];
    this.connections = [];

    let w = 600, h = 600;
    const paper = Raphael("chart",w,h);
    paper.setViewBox(0,0,w,h,true);
    paper.setSize('100%', '100%');
    this.paper = paper;
  }

  dragise(shape) {

    const chart = this;
    const move = function (dx, dy) {
      var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
      this.attr(att);
      for (var i = chart.connections.length; i--;) {
        this.paper.connection(chart.connections[i]);
      }
    };

    const dragger = function () {
      this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
      this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
      this.animate({"fill-opacity": .2}, 500);
    };

    const up = function() {
       this.animate({"fill-opacity": 0}, 500);
    };

    shape.drag(move, dragger, up);
  }

  draw(element) {
    this.model.ui.forEach( (ui) => {
      this.applyInterface(ui);
    });

    this.model.commands.forEach( (cmd) => {
      this.applyCommand(cmd);
    });

    this.model.events.forEach( (evt) => {
      this.applyEvent(evt);
    });

    this.model.read_models.forEach( (rm) => {
      this.applyReadModel(rm);
    });
  }

  applyInterface(ui) {
    this.ui_x = (this.ui_x === undefined) ? 60 : this.ui_x;
    this.ui_y = (this.ui_y === undefined) ? 30 : this.ui_y;

    let shape = this.paper.ellipse(this.ui_x, this.ui_y, 30, 20);
    shape.data('element', ui);
    shape.attr({fill: 'lightblue', stroke: 'lightblue', "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    this.shapes.push(shape);
    this.ui_x = this.ui_x + 100;
  }

  applyCommand(command) {
    this.command_x = (this.command_x === undefined) ? 60 : this.command_x;
    this.command_y = (this.command_y === undefined) ? 120 : this.command_y;

    let shape = this.paper.rect(this.command_x, this.command_y, 40, 10);
    shape.data('element', command);
    shape.attr({fill: 'lightgreen', stroke: 'lightgreen', "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    this.shapes.push(shape);
    this.command_x = this.command_x + 100;

    this.dragise(shape);

    this.connectUp((uuid) => { return uuid === command.ui?.uuid ? command.uuid : undefined });
  }

  applyEvent(event) {
    this.event_x = (this.event_x === undefined) ? 60 : this.event_x;
    this.event_y = (this.event_y === undefined) ? 210 : this.event_y;

    let shape = this.paper.rect(this.event_x, this.event_y, 40, 10);
    shape.data('element', event);
    shape.attr({fill: 'green', stroke: 'green', "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    this.shapes.push(shape);
    this.event_x = this.event_x + 100;
    this.dragise(shape);

    this.connectUp((uuid) => { return uuid === event.command?.uuid ? event.uuid : undefined });
  }

  applyReadModel(read_model) {
    this.read_model_x = (this.read_model_x === undefined) ? 110 : this.read_model_x;
    this.read_model_y = (this.read_model_y === undefined) ? 160 : this.read_model_y;

    let shape = this.paper.rect(this.read_model_x, this.read_model_y, 40, 10);
    shape.data('element', read_model);
    shape.attr({fill: 'blue', stroke: 'blue', "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    this.shapes.push(shape);
    this.read_model_x = this.read_model_x + 100;
    this.read_model_y = this.read_model_y + 10;

    this.dragise(shape);

    this.connectUp((uuid) => { return uuid === read_model.event?.uuid ? read_model.uuid : undefined });
  }

  connectUp(matchFunc) {
    this.shapes.forEach( (other_shape) => {
      let uuid = other_shape.data('element').uuid
      let shape_uuid;
      if (shape_uuid = matchFunc(uuid)) {
        let shape = this.shapes.find(shp => shape_uuid === shp.data('element').uuid);
        this.connections.push(this.paper.connection(other_shape, shape, "#fff"));
      }
    });
  }

}
