import model from "./model";
import ModelElements from "./model_elements";

document.addEventListener("DOMContentLoaded", function (event) {
  const elements = new ModelElements(model);
  elements.draw(document.getElementById("event_model"));
});
