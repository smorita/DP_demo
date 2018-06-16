function DP(P, L, T) {
    var state = new Array(L+1);
    var state_new = new Array(L+1);

    var Init = "random";
    var t = 0;
    var reset_count = 0;
    var reset_limit = 100;
    init_state();

    function update() {
        var i;
        for(i=0; i<L+1; ++i) state_new[i] = 0;
        for(i=0; i<L; ++i) {
            if(state[i]==1) {
                if(Math.random()<P) state_new[i] = 1;
                if(Math.random()<P) state_new[i+1] = 1;
            }
        }
        if(state_new[L]==1) state_new[0] = 1;
        if(state_new[0]==1) state_new[L] = 1;
        if(t%2 == 0) {
            for(i=0; i<L+1; ++i) state[i] = state_new[i];
        } else {
            for(i=0; i<L; ++i) state[i] = state_new[i+1];
            state[L] = state_new[0];
        }

        t = (t+1)%T;

        if(N()==0) {
            reset_count += 1;
        }

        if(t==0 || reset_count==reset_limit) {
            reset();
        }
    }

    function init_state() {
        var i;
        for(i=0; i<L+1; ++i) state[i] = 0;
        if (Init==="single") {
            state[Math.floor(L/2)] = 1;
        } else if (Init==="full") {
            for(i=0; i<L+1; ++i) state[i] = 1;
        } else {
            // Init=="random"
            for(i=0; i<L+1; ++i) {
                state[i] = (Math.random()<0.5) ? 0 : 1;
            }
        }
    }

    function reset() {
        init_state();
        t = 0;
        reset_count = 0;
    }

    function N() {
        var n = 0;
        for(var i=0;i<L;++i) n += state[i];
        return n;
    }

    return {
        update: update,
        state: state,
        L: L,
        get_t: function() {return t;},
        get_n: N,
        get_val: function() {return N()/L;},
        set_p: function(p) {
            P=p;
            reset();
        },
        set_init: function(init) {
            Init=init;
            reset();
        },
        reset: reset
    };
};

function create_DP(canvas) {
    var cw = canvas.width;
    var ch = canvas.height;
    var w = 2; // Size of points.
    var L = Math.ceil(cw / w);
    var T = Math.ceil(ch / w);

    var ctx = canvas.getContext('2d');

    var running = false;
    var timerID;
    var now = Date.now();
    var basetime = 0;
    var interval = 10; // [msec]

    var P_c = 0.6447;
    var model = DP(0.6447, L, T);

    var t;
    var i;
    var shift = 0;

    var graph = undefined;

    function draw() {
        t = model.get_t();
        shift = (t%2==0) ? 0 : Math.floor(w/2);
        ctx.fillStyle = '#eeeeee';
        ctx.fillRect(0, w*model.get_t()+1, cw, w);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, w*model.get_t(), cw, w);
        ctx.fillStyle = '#3366cc';
        for(i=0; i<L+1; ++i) {
            if(model.state[i]==1) {
                ctx.fillRect(w*i - shift, w*model.get_t(), w, w);
            }
        }

        if(!(graph === undefined)) {
            graph.draw(t, model.get_val());
        }
    }

    function clear() {
        ctx.fillStyle = '#eeeeee';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if(!(graph === undefined)) {
            graph.clear();
        }
        model.reset();
    }

    function update() {
        draw();
        model.update();
    }

    function loop() {
        now = Date.now();
        if(now-basetime>interval) {
            basetime = now;
            update();
        }
        timerID = requestAnimationFrame(loop);
    }

    function start() {
        if(!running) loop();
        running = true;
    }

    function set_graph(g) {
        graph = g;
    }

    return {
        L: L,
        T: T,
        draw: draw,
        model: model,
        start: start,
        set_prob: function(p) {
            model.set_p(p);
            $("#prob").text(p);
            $("#prob2").text(p);
        },
        set_init: function(init) {
            model.set_init(init);
        },
        set_graph: set_graph,
        clear: clear
    };
};
