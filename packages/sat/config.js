var fs, jade, local, main, stylus, theme, theme_clean, _;

if (typeof Meteor === "undefined" || Meteor === null) {
  _ = require('underscore');
  fs = require('fs');
  jade = require('jade');
  stylus = require('stylus');
} else {
  if (!(Package.underscore._.isEmpty(this.Config) || Package.underscore._.isEmpty(this.__))) {
    return {
      Config: this.Config,
      __: this.__
    };
  }
  _ = this._;
  this.module = {
    exports: {}
  };
  if (Meteor.isServer) {
    fs = Npm.require('fs');
  }
}

main = {
  autogen_prefix: 'auto_',
  callback_port: 3300,
  local_config: 'local.coffee',
  init: function() {
    if ((typeof Meteor === "undefined" || Meteor === null) || Meteor.isServer) {
      this.home_dir = process.env.HOME + '/';
      this.workspace = this.home_dir + 'workspace/';
      this.site_dir = process.env.site ? this.workspace + process.env.site + '/' : process.env.SITE + '/';
      this.module_dir = this.workspace + 'lib/';
      this.meteor_dir = this.site_dir + 'app/';
      this.source_dir = this.meteor_dir + 'lib/';
      this.target_dir = this.meteor_dir + 'client/';
    }
    return this;
  }
}.init();

theme = {
  clean: {
    font_family: "'PT Sans', sans-serif",
    font_weight: 200,
    backgound_color: '#ccc',
    navbar: {
      style: 'fixed-top',
      height: '50px',
      color: '#999',
      border: '1px',
      border_color: '#fff',
      background_color: '#eee',
      login: {
        width: '100px',
        dropdown: {
          width: '190px'
        }
      },
      dropdown: {
        width: '240px',
        padding: '25px',
        a: {
          height: '24px',
          hover: '#eee'
        }
      },
      text: {
        color: '#fff',
        font_size: '10px',
        height: '20px',
        width: '80px'
      },
      hover: {
        color: 'black',
        background_color: '#eee'
      },
      focus: {
        color: 'black',
        background_color: 'white'
      }
    },
    sidebar: {
      a: {
        color: 'white'
      }
    }
  }
};

theme_clean = {
  __theme: {
    styl$: '\n.tooltip\n    width 300px\n.tooltip-inner\n    width 100%\n    text-align left\n    color white\n    background-color green\nli.selected\n    background-color #a4c5ff\n.container-fluid#main-body\n    padding-top 70px\n.fa\n    width 10px\n    height 10px'
  }
};

local = {};

local = {
  title: 'Application',
  port_index: 1,
  home_url: 'circus-baboon.codio.io',
  index_file: 'index',
  other_files: [],
  modules: 'accounts menu ui responsive'.split(' '),
  collections: 'Connects Items Updates Calendar User'.split(' '),
  theme: 'clean'
};

if (main == null) {
  module.exports = local;
}

this.Config = {
  title: local.title,
  home_url: local.home_url,
  callback_port: main.callback_port,
  indent_string: '    ',
  local_config: main.local_config,
  collections: local.collections,
  menu: local.menu,
  _: {
    font_style: {
      pt_sans: "https://fonts.googleapis.com/css?family=PT+Sans:400,700"
    }
  },
  $: (theme != null ? theme[local.theme] : void 0) != null ? theme[local.theme] : void 0,
  instagram: {
    callback_path: '/callback/instagram/',
    response_type: 'code',
    grant_type: 'authorization_code',
    oauth_url: 'https://api.instagram.com/oauth/authorize/',
    client_id: '91ee62d198554e1c83305df1dc007335',
    final_url: main.home_url,
    request_url: 'https://api.instagram.com/oauth/access_token/',
    subscription_url: 'https://api.instagram.com/v1/subscriptions/',
    callback_url: 'http://www.hi16.ca:3003/callback/instagram/?command=update',
    media_url: function(media_id, access_token) {
      return "https://api.instagram.com/v1/media/" + media_id + "/?access_token=" + access_token;
    },
    redirect_uri: function(user_id) {
      return "http://www.hi16.ca:3003/callback/instagram/?command=oauth&user_id=" + user_id;
    }
  },
  pages: {
    jade: {
      file: main.target_dir + main.autogen_prefix + '1.jade',
      indent: 1,
      format: function(name, block) {
        return "template(name=\"" + name + "\")\n" + block + "\n\n";
      }
    },
    jade$: {
      file: main.target_dir + main.autogen_prefix + '2.html',
      indent: 1,
      format: function(name, block) {
        return jade.compile("template(name=\"" + name + "\")\n" + block + "\n\n", null)();
      }
    },
    HTML: {
      file: main.target_dir + main.autogen_prefix + '3.html',
      indent: 1,
      format: function(name, block) {
        return "<template name=\"" + name + "\">\n" + block + "\n</template>\n";
      }
    },
    head: {
      file: main.target_dir + main.autogen_prefix + '0.jade',
      indent: 1,
      header: 'head\n',
      format: function(name, block) {
        return block + '\n';
      }
    },
    less: {
      file: main.target_dir + main.autogen_prefix + '7.less',
      indent: 0,
      format: function(name, block) {
        return block + '\n';
      }
    },
    css: {
      file: main.target_dir + main.autogen_prefix + '5.css',
      indent: 0,
      format: function(name, block) {
        return block + '\n';
      }
    },
    styl: {
      file: main.target_dir + main.autogen_prefix + '4.styl',
      indent: 0,
      format: function(name, block) {
        return block + '\n\n';
      }
    },
    styl$: {
      file: main.target_dir + main.autogen_prefix + '6.css',
      indent: 0,
      format: function(name, block) {
        return stylus(block).render() + '\n';
      }
    }
  },
  auto_generated_files: [],
  init: function() {
    var a, i;
    if ((typeof Meteor === "undefined" || Meteor === null) || Meteor.isServer) {
      this.meteor_dir = main.meteor_dir;
      this.index_file = local.index_file;
      this.module_dir = main.module_dir;
      this.source_dir = main.source_dir;
      this.client_dir = main.target_dir;
      this.target_dir = main.target_dir;
      this.site_dir = main.site_dir;
      this.build_dir = this.site_dir + 'build/';
      this.meteor_lib = this.meteor_dir + 'lib/';
      this.packages = main.workspace + 'meteor/packages/';
      this.site_packages = this.site_dir + 'app/packages/';
      this.config_js_dir = this.site_dir + 'app/packages/sat/';
      this.sync_dir = this.site_dir + 'app/lib/';
      this.config_js = this.config_js_dir + 'config.js';
      this.config_source = this.module_dir + 'config.coffee';
      this.index_module = this.site_dir + local.index_file;
      this.local_source = this.site_dir + main.local_config;
      this.local_module = this.site_dir + main.local_config;
      this.theme_source = this.module_dir + 'theme.coffee';
      this.header_source = this.module_dir + 'header.coffee';
      this.log_file = main.home_dir + '.log.io/satellite';
      this.set_prefix = '';
      this.autogen_prefix = main.autogen_prefix;
      if (typeof Meteor === "undefined" || Meteor === null) {
        a = '';
      } else {
        this.server_config = this.meteor_dir + 'server/config';
      }
    }
    this.templates = Object.keys(this.pages);
    this.auto_generated_files = (function() {
      var _i, _len, _ref, _results;
      _ref = this.templates;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(this.pages[i].file);
      }
      return _results;
    }).call(this);
    delete this.init;
    return this;
  },
  quit: function(func) {
    if (func != null) {
      return func();
    }
  }
}.init();

(typeof Meteor === "undefined" || Meteor === null) && (module.exports = {
  __: this.__,
  Config: this.Config
});


/*

@__.slice = (str, tab=1, indent='    ') -> (((str.replace /~\s+/g, '').split '|').map (s) ->
    s = if 0 == s.search /^(<+)/ then s.replace /^(<+)/, Array(tab = Math.max tab - RegExp.$1.length, 1).join indent 
    else if 0 == s.search /^>/ then s.replace /^>/, Array(++tab).join indent 
    else s.replace /^/, Array(tab).join indent).join '\n'


@__ =
    queryString: (obj) ->
        parts = []
        for i of obj
            parts.push encodeURIComponent(i) + "=" + encodeURIComponent(obj[i])
        parts.join "&"

    trim: (str) -> if str? then str.trim() else null
    capitalize: (string) -> string.charAt(0).toUpperCase() + string.slice(1)
    dasherize: (str) -> str.trim().replace(/([A-Z])/g, "-$1").replace(/[-_\s]+/g, "-").toLowerCase()
    prettyJSON: (obj) -> JSON.stringify obj, null, 4
    getValue: (id) ->
        element = document.getElementById(id)
        if element then element.value else null
    trimmedValue: (id) ->
        element = document.getElementById(id)
        if element then element.value.replace(/^\s*|\s*$/g, "") else null
    reKey: (obj, oldName, newName) ->
        if obj.hasOwnProperty(oldName)
            obj[newName] = obj[oldName]
            delete obj[oldName]
        this


@__.insertTemplate = (page, id, data={}) ->
    $('#' + id).empty()
    Blaze.renderWithData(
        Template[page], 
        if Object.keys(data).length then data else Template[page].helpers 
        document.getElementById id  )

@__.currentRoute = -> Router.current().route.getName()

@__.render = (page) -> Template[page].renderFunction().value

@__.renameKeys = (obj, keyObject) ->
    _.each _.keys keyObject, (key) -> @__.reKey obj, key, keyObject[key]

@__.repeat = (pattern, count) ->
    return '' if count < 1
    result = ''
    while count > 0
        result += pattern if count & 1
        count >>= 1
        pattern += pattern
    result

@__.deepExtend = (target, source) ->
    for prop of source
        if prop of target
            @__.deepExtend target[prop], source[prop]
        else
            target[prop] = source[prop]
    target


@__.flatten = (obj, chained_keys) ->
    toReturn = {}       
    for i in obj
        if typeof obj[i] == 'object'
            flatObject = @__.flatten obj[i]
            for j in flatObject
                if chained_keys
                    toReturn[i+'_'+j] = flatObject[j]
                else
                    toReturn[j] = flatObject[j]
        else
            toReturn[i] = obj[i]
    toReturn

@__.log = (arg) ->
     console.log( arg + '' );
 */
