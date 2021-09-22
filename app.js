import model from './model'
import Bound from './bound'

document.addEventListener("DOMContentLoaded", function(event) {
    const bound = new Bound(document.getElementById('container'))
    console.log('adding:', bound);
    bound.add(document.getElementById('item'));
    bound.add(document.getElementById('item2'));

});

