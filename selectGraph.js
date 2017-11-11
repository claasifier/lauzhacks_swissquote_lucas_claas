$(document).ready(function(){
  openGraph(event, emptygraph);
});

function openGraph(evt, graphName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="graph" and hide them
    graph = document.getElementsByClassName("graph");
    for (i = 0; i < graph.length; i++) {
        graph[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    graphlinks = document.getElementsByClassName("graphlinks");
    for (i = 0; i < graphlinks.length; i++) {
        graphlinks[i].className = graphlinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    if(document.getElementById(graphName) != undefined){
      document.getElementById(graphName).style.display = "block";
      evt.currentTarget.className += " active";
    }
}
