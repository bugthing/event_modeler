
import Bound from './bound'

export default class ModelElements {
  constructor(model) {
    this.model = model;
  }

  draw(container) {
    this.model.ui.forEach( (ui) => {
      this.applyInterface(ui, container);
    });

    this.model.commands.forEach( (cmd) => {
      this.applyCommand(cmd, container);
    });

    this.model.events.forEach( (evt) => {
      this.applyEvent(evt, container);
    });

    this.model.read_models.forEach( (rm) => {
      this.applyReadModel(rm, container);
    });
  }

  buildUI(model) {
    const div = document.createElement("div");
    div.setAttribute("id", `ui_${model.uuid}`);

    let style='';
    switch (model.lane) {
    case 'Interface':
      style = "background: radial-gradient(#1fe4f5, #3fbafe);"
      break;
    case 'Command':
      style = " background: radial-gradient(#fbc1cc, #fa99b2); ";
      break;
    case 'Event':
      style = " background: radial-gradient(#76b2fe, #b69efe); ";
      break;
    case 'ReadModel':
      style = " background: radial-gradient(#60efbc, #58d5c9); ";
      break;
    default:
      style = "background: radial-gradient(#f588d8, #c0a3e5);"
    }
    div.setAttribute("class", 'card');
    div.setAttribute("style", style);
    div.innerHTML = `
        <a class="card__link" href="#">${model.name} <i class="fas fa-arrow-right"></i></a>
    `.trim()

    return div
  }

  getLane(model, element) {
    const lane_name = model.lane
    let div = document.getElementById(`lane_${lane_name}`)
    if ( div === null ) {
        console.log(`LANE: ${lane_name}`);
      div = document.createElement("div",{"id":`lane_${lane_name}`, "class": "lane"},lane_name);
      div = document.createElement("div")
      div.setAttribute("id", `lane_${lane_name}`)
      div.setAttribute("class", "lane");
      div.appendChild(document.createTextNode(lane_name));
      element.appendChild(div);
    }
    return div
  }

  applyInterface(ui, container) {
    const element = this.buildUI(ui)
    const lane = this.getLane(ui, container)
    lane.appendChild(element)
    const bind = new Bound(lane); bind.add(element)
  }

  applyCommand(command, container) {
    const element = this.buildUI(command)
    const lane = this.getLane(command, container)
    lane.appendChild(element)
    const bind = new Bound(lane); bind.add(element)
  }

  applyEvent(event, container) {
    const element = this.buildUI(event)
    const lane = this.getLane(event, container)
    lane.appendChild(element)
    const bind = new Bound(lane); bind.add(element)
  }

  applyReadModel(read_model, container) {
    const element = this.buildUI(read_model)
    const lane = this.getLane(read_model, container)
    lane.appendChild(element)
    const bind = new Bound(lane); bind.add(element)
  }
}
