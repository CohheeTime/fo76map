window.onload = function () {
  $test = 'A simple container to divide your page into <strong>sections</strong>, like the one you\'re currently reading.'
  var app = new Vue({
    el: '#app',
    data: {
      title: 'Section',
      message: $test
    }
  });
}