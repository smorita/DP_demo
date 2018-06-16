function create_graph(canvas) {
    var cw = canvas.width;
    var ch = canvas.height;
    var ctx = canvas.getContext('2d');
    var w = 2;
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


function set_text_p1(p1) {
    if (typeof p1 !== "undefined") {
        $("#prob1").text(p1.toFixed(3));
    }
}

function set_text_p2(p2) {
    if (typeof p2 !== "undefined") {
        $("#prob2").text(p2.toFixed(3));
    }
}


$(function () {
    var P_c = 0.6447;

    var slider_p1 = $("#slider_p1").slider({
        min: 0.0,
        max: 1.0,
        step: 0.001,
        value: P_c,
        tooltip: 'hide'
    });

    var slider_p2 = $("#slider_p2").slider({
        min: 0.0,
        max: 1.0,
        step: 0.001,
        value: P_c * (2.0 - P_c),
        tooltip: 'hide'
    });

    function update_UI() {
        var p1 = Model.get_p1();
        var p2 = Model.get_p2();
        set_text_p1(p1);
        set_text_p2(p2);
        slider_p1.slider('setValue', p1);
        slider_p2.slider('setValue', p2);
    }

    function set_model(m) {
        Model.set_model(m);
        update_UI();
    }

    slider_p1.on('change', function(e) {
        Model.set_p1(e.value.newValue);
        update_UI();
    });

    slider_p2.on('change', function(e) {
        if(Model.get_model()==="compact" || Model.get_model()==="w18") {
            $("#model_free").parent().click();
        }
        Model.set_p2(e.value.newValue);
        update_UI();
    });

    var canvas_dk = document.getElementById("dk");
    var canvas_graph = document.getElementById("graph");
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    var gw = (ww > 768) ? 100 : 50; // graph width
    canvas_dk.width = ww - gw;
    canvas_dk.height = wh;
    canvas_graph.width = gw;
    canvas_graph.height = wh;

    var Model = create_DK(canvas_dk);
    var Graph = create_graph(canvas_graph);
    Model.set_graph(Graph);
    Model.set_prob(P_c, P_c*(2.0-P_c));
    Model.start();
    update_UI();

    $("#init_single").parent().click(function(e) { Model.set_init("single"); });
    $("#init_full").parent().click(function(e) { Model.set_init("full"); });
    $("#init_random").parent().click(function(e) { Model.set_init("random"); });

    $("#model_free").parent().click(function(e) { set_model("free"); });
    $("#model_bond").parent().click(function(e) { set_model("bond"); });
    $("#model_site").parent().click(function(e) { set_model("site"); });
    $("#model_compact").parent().click(function(e) { set_model("compact"); });
    $("#model_w18").parent().click(function(e) { set_model("w18"); });

    $("#clear").click(function(e) { Model.clear(); });
});
