function DK(L, T) {
    var P1 = 0.0;
    var P2 = 0.0;
    var state = new Array(L+1);
    var state_new = new Array(L+1);

    var Init = "random";

    var t = 0;
    var reset_count = 0;
    var Reset_interval = 32;

    var Model = "free";
    var rotate = false;
    var idx_model = 0;

    reset();

    function update() {
        var i;
        for(i=0; i<L+1; ++i) state_new[i] = 0;
        for(i=0; i<L; ++i) {
            if(state[i] + state[i+1] == 1) {
                if(Math.random()<P1) state_new[i] = 1;
            } else if (state[i] + state[i+1] == 2) {
                if(Math.random()<P2) state_new[i] = 1;
            }
        }
        state_new[L] = state_new[0];

        if(t%2 == 0) {
            for(i=0; i<L; ++i) state[i+1] = state_new[i];
            state[0] = state_new[L];
        } else {
            for(i=0; i<L+1; ++i) state[i] = state_new[i];
        }

        if(N()==0) {
            reset_count += 1;
        }
        if(reset_count==Reset_interval) {
            reset_state();
            reset_count = 0;
        }

        t = (t+1)%T;
        if(t==0) {
            if(rotate) {
                rotate_model();
            }
            reset();
        }
    }

    function reset_state() {
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
        reset_state();
        t = 0;
        reset_count = 0;
    }

    function N() {
        var n = 0;
        for(var i=0;i<L;++i) n += state[i];
        return n;
    }

    function get_p2(p1) {
        if(Model==="bond") {
            return p1 * (2.0 - p1);
        } else if(Model==="site") {
            return p1;
        } else if(Model==="compact") {
            return 1.0;
        } else if(Model==="w18") {
            return 0.0;
        } else {
            return P2;
        }
    }

    function get_p1(p2) {
        if(Model==="bond") {
            return 1.0 - Math.sqrt(1.0 - p2);
        } else if(Model==="site") {
            return p2;
        } else if(Model==="compact") {
            return P1;
        } else if(Model==="w18") {
            return P1;
        } else {
            return P1;
        }
    }

    function set_prob (p1, p2) {
        P1 = p1;
        P2 = p2;
        reset();
    }

    function set_p1(p1) {
        P1 = p1;
        P2 = get_p2(p1);
        reset();
    }

    function set_p2(p2) {
        P2 = p2;
        P1 = get_p1(p2);
        P2 = get_p2(P1);
        reset();
    }

    function set_model(m) {
        Model = m;
        if (Model==="bond") {
            P1 = 0.6447;
        } else if (Model==="site") {
            P1 = 0.7055;
        } else if (Model==="compact") {
            P1 = 0.5;
        } else if (Model==="w18") {
            P1 = 0.811;
        }
        P2 = get_p2(P1);
        reset();
    }

    function rotate_model() {
        if (idx_model == 0) {
            set_model("w18");
        } else if (idx_model == 1) {
            set_model("site");
        } else if (idx_model == 2) {
            set_model("bond");
        } else if (idx_model == 3) {
            set_model("compact");
        }
        idx_model = (idx_model+1)%4;
    }

    return {
        update: update,
        state: state,
        L: L,
        get_t: function() {return t;},
        get_n: N,
        get_val: function() {return N()/L;},
        set_prob: set_prob,
        set_p1: set_p1,
        set_p2: set_p2,
        get_p1: function() {return P1;},
        get_p2: function() {return P2;},
        set_init: function(init) {
            Init=init;
            reset();
        },
        set_model: set_model,
        get_model: function() {return Model;},
        set_rotate: function() {rotate = true;},
        reset: reset
    };
};

function create_DK(canvas) {
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

    var model = DK(L, T);

    var t;
    var i;
    var shift = 0;
    var rotate = false;

    var graph = undefined;
    // var graph = create_graph(gw, ch, w);

    function draw() {
        t = model.get_t();
        shift = (t%2==0) ? 0 : Math.floor(w/2);
        ctx.fillStyle = '#eeeeee';
        ctx.fillRect(0, w*model.get_t()+1, cw, w);
        ctx.fillStyle = '#ffffff';
        ctx.fillStyle = (model.get_n()>0) ? '#ffffff' : '#f9f9f9';
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


    return {
        L: L,
        T: T,
        draw: draw,
        model: model,
        start: start,
        set_prob: model.set_prob,
        set_p1: model.set_p1,
        set_p2: model.set_p2,
        get_p1: model.get_p1,
        get_p2: model.get_p2,
        set_init: model.set_init,
        set_model: model.set_model,
        get_model: model.get_model,
        set_graph: function(g) {graph = g;},
        set_rotate: model.set_rotate,
        clear: clear
    };
};
