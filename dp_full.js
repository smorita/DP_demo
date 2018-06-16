function create_graph(canvas) {
    var cw = canvas.width;
    var ch = canvas.height;
    var w = 2;
    var ctx = canvas.getContext('2d');
    var lw = 1.5; // line width

    function draw(t,val) {
        ctx.fillStyle = '#eeeeee';
        ctx.fillRect(0, w*t+1, cw, w);
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, w*t, cw, w);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(val*(cw-lw), w*t, lw, w);
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
    var P_c = 0.6447;
    var P_min = 0.6;
    var P_max = 0.8;

    var slider = $("#slider").slider({
        min: 0.6,
        max: 0.8,
        step: 0.0001,
        value: P_c,
        ticks: [P_min, P_c, P_max],
        ticks_labels: [String(P_min), String(P_c), String(P_max)],
        ticks_positions: [0, (P_c-P_min)/(P_max-P_min)*100, 100],
        ticks_snap_bounds: 0.001,
        tooltip: 'hide'
    });

    slider.on('change', function(e) {
        set_prob(e.value.newValue);
    });

    function set_prob(p) {
        Model.set_prob(p);
        $("#prob").text(p);
    };

    var ww = window.innerWidth;
    var wh = window.innerHeight;
    var gw = (ww > 768) ? 100 : 50; // graph width
    var canvas_dp = document.getElementById("dp");
    var canvas_graph = document.getElementById("graph");
    canvas_dp.width = ww - gw;
    canvas_dp.height = wh;
    canvas_graph.width = gw;
    canvas_graph.height = wh;

    var Model = create_DP(canvas_dp);
    var Graph = create_graph(canvas_graph);
    Model.set_graph(Graph);
    set_prob(P_c);
    Model.start();

    $("#init_single").parent().click(function(e) { Model.set_init("single"); });
    $("#init_full").parent().on('click', function(e) { Model.set_init("full"); });
    $("#init_random").parent().on('click', function(e) { Model.set_init("random"); });
    $("#clear").on('click', function(e) { Model.clear(); });
});
