
import { v4 as uuidv4 } from 'uuid';

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

export default model;
