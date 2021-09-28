import Bound from "./bound";

export default class ModelElements {
  constructor(model) {
    this.model = model;
  }

  draw(container) {
    this.container = container;
    this.bound = new Bound(container);

    const all_lanes = new Set(
      this.model.ui
        .concat(this.model.commands, this.model.events, this.model.read_models)
        .map((m) => m.lane)
    );

    all_lanes.forEach((l) => {
      this.applyLane(l);
    });

    this.model.ui.forEach((ui) => {
      this.applyInterface(ui);
    });

    this.model.commands.forEach((cmd) => {
      this.applyCommand(cmd);
    });

    this.model.events.forEach((evt) => {
      this.applyEvent(evt);
    });

    this.model.read_models.forEach((rm) => {
      this.applyReadModel(rm);
    });
  }

  buildUI(model) {
    const div = document.createElement("div");
    div.setAttribute("id", `ui_${model.uuid}`);
    div.setAttribute(`data-mel_type`, model.constructor.name);

    let style = "";
    switch (model.lane) {
      case "Interface":
        style = "background: radial-gradient(#1fe4f5, #3fbafe);";
        break;
      case "Command":
        style = " background: radial-gradient(#fbc1cc, #fa99b2); ";
        break;
      case "Event":
        style = " background: radial-gradient(#76b2fe, #b69efe); ";
        break;
      case "ReadModel":
        style = " background: radial-gradient(#60efbc, #58d5c9); ";
        break;
      default:
        style = "background: radial-gradient(#f588d8, #c0a3e5);";
    }
    div.setAttribute("class", "card");
    div.setAttribute("style", style);
    div.innerHTML = `
        <a class="card__link" href="#">${model.name} <i class="fas fa-arrow-right"></i></a>
    `.trim();

    // perhaps we can place the UI element at this point
    //this.possitionElement(model);

    return div;
  }

  getLane(name) {
    const lane_id = `lane_${name}`;
    let div = document.getElementById(lane_id);
    if (div === null) {
      console.log("LANE:", name);
      div = document.createElement("div");
      div.setAttribute("id", lane_id);
      div.setAttribute("class", "lane");
      div.setAttribute(`data-mel_type`, "Lane");
      div.appendChild(document.createTextNode(name));
      this.container.appendChild(div);
      this.bound.add(div);
    }
    return div;
  }

  applyLane(name) {
    const lane = this.getLane(name);
    this.container.appendChild(lane);
  }

  applyInterface(ui) {
    const element = this.buildUI(ui);
    this.container.appendChild(element);
  }

  applyCommand(command) {
    const element = this.buildUI(command);
    this.container.appendChild(element);
  }

  applyEvent(event) {
    const element = this.buildUI(event);
    this.container.appendChild(element);
  }

  applyReadModel(read_model) {
    const element = this.buildUI(read_model);
    this.container.appendChild(element);
  }
}
