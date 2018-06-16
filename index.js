function start_dp() {
    var canvas = document.getElementById("dp");
    var w = $("#dp").width();
    canvas.width = w;
    canvas.height = w;
    var dp = create_DP(canvas);
    dp.start();
}

function start_dk() {
    var canvas = document.getElementById("dk");
    var w = $("#dk").width();
    canvas.width = w;
    canvas.height = w;
    var dk = create_DK(canvas);
    dk.set_prob(0.5, 1.0);
    dk.set_rotate();
    dk.start();
}

function start_ttp() {
    var canvas = document.getElementById("ttp");
    var w = $("#ttp").width();
    canvas.width = w;
    canvas.height = w;
    var ttp = create_TTP(canvas);
    ttp.start();
}


$(function () {
    start_dp();
    start_dk();
    start_ttp();
});
