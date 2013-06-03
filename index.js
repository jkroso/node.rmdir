
var fs = require('fs')
  , join = require('path').join

/**
 * rm -r path
 *
 * @param {String} path
 * @param {Function} cb
 */

module.exports = function rmdir(path, cb) {
  fs.readdir(path, function(e, files) {
    if (e) return done(e);
    var i = files.length;
    if (!i) return fs.rmdir(path, cb);

    files.forEach(function(file){
      file = join(path, file);
      fs.lstat(file, function (e, stat) {
        if (e) return done(e);
        if (stat.isDirectory()) rmdir(file, done);
        else fs.unlink(file, done);
      });
    });

    function done(e){
      if (e) {
        cb && cb(e);
        // `cb` mustn't be called twice
        cb = null;
        return;
      }
      if (--i <= 0) fs.rmdir(path, cb);
    }
  });
}
