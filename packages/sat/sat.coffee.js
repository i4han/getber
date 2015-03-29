db.init = function() {
  return Config.collections.map(function(c) {
    db[c] = new Meteor.Collection(c);
    if (Meteor.isServer) {
      db[c].allow({
        insert: function(doc) {
          return true;
        },
        update: function(userId, doc, fields, modifier) {
          return true;
        },
        remove: function(userId, doc) {
          return true;
        }
      });
      db[c].deny({
        update: function(userId, doc, fields, modifier) {
          return false;
        },
        remove: function(userId, doc) {
          return false;
        }
      });
      return Meteor.publish(c, function() {
        return db[c].find({});
      });
    } else if (Meteor.isClient) {
      return Meteor.subscribe(c);
    }
  });
};

Pages.init = function() {
  var pagesInFile;
  delete Pages.init;
  pagesInFile = module.exports;
  return (x.keys(pagesInFile)).map(function(file) {
    var key, val, _ref;
    if (file.slice(0, 2) !== '__') {
      _ref = pagesInFile[file];
      for (key in _ref) {
        val = _ref[key];
        Pages[key] = val;
      }
    }
    return ((x.keys(pagesInFile[file])).filter(function(key) {
      return key.slice(0, 2) === '__';
    })).map(function(name) {
      return delete Pages[name];
    });
  });
};

Sat.init = function() {
  var router_map, startup;
  db.init();
  Pages.init();
  if (Meteor.isServer) {
    Sat.isServer = true;
    return Meteor.methods({});
  } else if (Meteor.isClient) {
    Sat.isClient = true;
    Router.configure({
      layoutTemplate: 'layout'
    });
    startup = [];
    router_map = {};
    (x.keys(Pages)).map(function(name) {
      return (x.keys(Pages[name])).map(function(key) {
        if ('helpers' === key) {
          return Template[name].helpers(Pages[name].helpers);
        } else if ('events' === key) {
          return Template[name].events(x.func(Pages[name].events));
        } else if ('router' === key) {
          return router_map[name] = Pages[name].router;
        } else if ('startup' === key) {
          return startup.push(Pages[name].startup);
        } else if ((Config.templates.concat('eco navbar'.split(' '))).indexOf(key === -1)) {
          return '';
        } else if (('rendered created destroyed'.split(' ')).indexOf(key === -1)) {
          return (Template[name] != null) && (Template[name][key] = Pages[name][key]);
        }
      });
    });
    Router.map(function() {
      var key, _results;
      _results = [];
      for (key in router_map) {
        _results.push(this.route(key, router_map[key]));
      }
      return _results;
    });
    return Meteor.startup(function() {
      return startup.map(function(func) {
        return func();
      });
    });
  }
};
