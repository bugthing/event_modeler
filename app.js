import Chart from './chart'
import model from './model'

document.addEventListener("DOMContentLoaded", function(event) {
    const chart = new Chart(model);

    const element = document.getElementById('chart');
    chart.draw(element);
});

