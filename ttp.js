function TTP(L, T) {
    var P = 0.6894;
    var N_update = Math.floor(L/4);
    var state = new Array(L+1);

    var t = 0;

    reset();


    function update_single() {
        var i = Math.floor(Math.random() * L);
        var j;
        if(state[i]==0) {
            if(Math.random()<P) state[i]=1;
        } else if(state[i]==1) {
            if(Math.random()<1.0-P) state[i]=0;
        } else {
            j = (Math.random()<0.5) ? (i-1+L)%L : (i+1+L)%L;
            if(state[j]<2) {
                state[j] += 1;
                state[i] -= 1;
            }
            j = (Math.random()<0.5) ? (i-1+L)%L : (i+1+L)%L;
            if(state[j]<2) {
                state[j] += 1;
                state[i] -= 1;
            }
        }
    }

    function update() {
        var i;
        for(i=0;i<N_update;++i) {
            update_single();
        }

        t = (t+1)%T;
        if(t==0) {
            reset();
        }
    }

    function reset_state() {
        var i;
        var x;
        for(i=0; i<L; ++i) {
            state[i] = Math.floor(Math.random() * 3);
        }
        state[L] = state[0];
    }

    function reset() {
        reset_state();
        t = 0;
    }

    function N() {
        var n = 0;
        for(var i=0;i<L;++i) {
            if(state[i]==2) n += 1;
        }
        return n;
    }

    function get_vals() {
        var n = [0, 0, 0];
        for(var i=0;i<L;++i) {
            n[state[i]] += 1;
        }
        return [n[0]/L, n[1]/L, n[2]/L];
    }

    function set_prob (p) {
        P = p;
        // reset();
    }

    return {
        update: update,
        state: state,
        L: L,
        get_t: function() {return t;},
        get_n: N,
        get_val: function() {return N()/L;},
        get_vals: get_vals,
        set_prob: set_prob,
        get_prob: function() {return P;},
        reset: reset
    };
};

function create_TTP(canvas) {
    var cw = canvas.width;
    var ch = canvas.height;
    var w = 2; // Size of points.
    var L = Math.ceil(canvas.width / w);
    var T = Math.ceil(canvas.height / w);

    var ctx = canvas.getContext('2d');

    var running = false;
    var timerID;
    var now = Date.now();
    var basetime = 0;
    var interval = 10; // [msec]

    var model = TTP(L, T);

    var t;
    var i;

    var graph = undefined;
    // var graph = create_graph(gw, ch, w);

    function draw() {
        t = model.get_t();
        ctx.fillStyle = '#eeeeee';
        ctx.fillRect(0, w*model.get_t()+1, cw, w);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, w*model.get_t(), cw, w);
        ctx.fillStyle = '#ffeef3';
        for(i=0; i<L+1; ++i) {
            if(model.state[i]==1) {
                ctx.fillRect(w*i, w*model.get_t(), w, w);
            }
        }
        ctx.fillStyle = '#3366cc';
        for(i=0; i<L+1; ++i) {
            if(model.state[i]==2) {
                ctx.fillRect(w*i, w*model.get_t(), w, w);
            }
        }

        if(!(graph === undefined)) {
            graph.draw(t, model.get_vals());
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
        get_prob: model.get_prob,
        set_graph: function(g) {graph = g;},
        clear: clear
    };
};
