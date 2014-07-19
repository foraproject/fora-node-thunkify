module.exports = function thunkify(fn){
  var thunkFn = function(){
    var args = new Array(arguments.length);
    var ctx = this;

    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function(done){
      var called;

      args.push(function(){
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }

  return function*() {
    try {
        yield thunkFn.call(this, arguments);
    } catch(e) {
        e._inner = new Error();
        throw e;
    }
  }
};
