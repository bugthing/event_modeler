import model from './model'
import Bound from './bound'

document.addEventListener("DOMContentLoaded", function(event) {

    const ui_bound = new Bound(document.getElementById('ui_lane'))
    const cd_bound = new Bound(document.getElementById('commands_and_read_lane'))
    const ev_bound = new Bound(document.getElementById('events_lane'))

    ui_bound.add(document.getElementById('item1'))
    cd_bound.add(document.getElementById('item2'))
    ev_bound.add(document.getElementById('item3'))
    cd_bound.add(document.getElementById('item4'))

});
