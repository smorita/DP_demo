function create_graph(canvas) {
    var cw = canvas.width;
    var ch = canvas.height;
    var w = 2;
    var ctx = canvas.getContext('2d');

    function draw(t,vals) {
        ctx.fillStyle = '#eeeeee';
        ctx.fillRect(0, w*t+1, cw, w);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, w*t, cw, w);
        ctx.fillStyle = '#ffeef3';
        ctx.fillRect(vals[0]*cw, w*t, vals[1]*cw, w);
        ctx.fillStyle = '#3366cc';
        ctx.fillRect((vals[0]+vals[1])*cw, w*t, vals[2]*cw, w);
        ctx.fillStyle = '#666666';
        ctx.fillRect(0, w*t, 1.0, w);
    }

    function clear() {
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return {
        draw: draw,
        clear: clear
    };
}


$(function () {
    var P_c = 0.6894;

    var slider_p = $("#slider_p1").slider({
        min: 0.0,
        max: 1.0,
        step: 0.001,
        value: P_c,
        tooltip: 'hide'
    });

    function update_UI() {
        var p = Model.get_prob();
        if (typeof p !== "undefined") {
            $("#prob").text(p.toFixed(3));
        }
        // slider_p.slider('setValue', p);
    }

    slider_p.on('change', function(e) {
        Model.set_prob(e.value.newValue);
        update_UI();
    });

    var canvas_ttp = document.getElementById("ttp");
    var canvas_graph = document.getElementById("graph");
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    var gw = (ww > 768) ? 100 : 50; // graph width
    canvas_ttp.width = ww - gw;
    canvas_ttp.height = wh;
    canvas_graph.width = gw;
    canvas_graph.height = wh;

    var Model = create_TTP(canvas_ttp);
    var Graph = create_graph(canvas_graph);
    Model.set_prob(P_c);
    Model.set_graph(Graph);
    Model.start();
    update_UI();

    $("#clear").click(function(e) { Model.clear(); });
});
