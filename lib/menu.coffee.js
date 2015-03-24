var getMenu;

getMenu = function(Config, Pages) {
  var index, menu, _;
  _ = require('underscore');
  _.templateSettings = {
    interpolate: /\[(.+?)\]/g
  };
  index = Pages[Config.index_file];
  menu = index.layout.navbar.menu;
  return (('string' === typeof menu ? menu.split(' ') : Array.isArray(menu) ? menu : []).map(function(a) {
    return (_.template("            li: a(href=\"{{pathFor '[path]'}}\" id='[id]') [label]"))({
      path: a,
      label: index[a].label,
      id: 'navbar-menu'
    });
  })).join('\n');
};

module.exports.menu = {
  menu_list: {
    jade: "li: a(href=\"{{path}}\" id=\"{{id}}\") {{label}}",
    helpers: {
      path: function() {
        return Router.path(this.page);
      },
      label: function() {
        return Pages[this.page].label;
      }
    }
  },
  navbar: {
    jade: function(Config) {
      var menu;
      menu = getMenu(this.C, this.Pages);
      return ".navbar.navbar-default.navbar-" + this.C.$.navbar.style + "\n    +logo\n    .navbar-left \n        ul.nav.navbar-nav\n            li: a#menu-toggle: i.fa.fa-bars\n" + menu + "\n    .navbar-right\n        +login";
    },
    styl: function() {
      return this._.slice(".navbar|>background-color rgba(0, 3, 240, 0.8)|<.navbar-fixed-top|>border 0px");
    },
    events: {
      'click #menu-toggle': function(event) {
        return $("#wrapper").toggleClass("toggled");
      },
      'click #navbar-menu': function(event) {
        var menu_selected;
        menu_selected = event.target.innerText.toLowerCase();
        return $('#listen-to-menu-change').trigger('custom', [menu_selected]);
      }
    },
    styl$: function(Config) {
      return "#menu-toggle\n    width 50px\n#login-buttons\n    height 50px\n    width " + Config.$.navbar.login.width + "\nli#login-dropdown-list\n    width " + Config.$.navbar.login.width + "\n    height " + Config.$.navbar.height + "\n    display table-cell\n    text-align center\n    vertical-align middle\n.navbar-default .navbar-nav > li > a\n    color " + Config.$.navbar.text.color + "\n.navbar-left > ul > li > a\n    width " + Config.$.navbar.text.width + "\n    text-align center\n.navbar-right > li:hover\n.navbar-left > ul > li:hover\n.navbar-nav > li > a:hover\n    text-decoration none\n    color " + Config.$.navbar.hover.color + "\n    background-color " + Config.$.navbar.hover.background_color + "\n.dropdown-toggle > i.fa-chevron-down\n    padding-left 4px\n#navbar-menu:focus\n    color black\n    background-color " + Config.$.navbar.focus.background_color + "\n#login-dropdown:hover\n    cursor pointer\n#login-dropdown-list > a\n    width  " + Config.$.navbar.login.width + "\n    height " + Config.$.navbar.height + "\n    color  " + Config.$.navbar.text.color + "\n    text-decoration none\n    cursor pointer\n    padding ( ( " + Config.$.navbar.height + " - " + Config.$.navbar.text.height + " ) / 2 )\n#login-dropdown-list > a:hover\n    background-color " + Config.$.navbar.hover.background_color;
    }
  },
  sidebar: {
    styl$: function(Config) {
      var sidebar_width;
      sidebar_width = '160px';
      return "#wrapper \n    padding-top: 50px;\n    padding-left: 0px;\n    -webkit-transition: all 0.5s ease;\n    -moz-transition: all 0.5s ease;\n    -o-transition: all 0.5s ease;\n    transition: all 0.5s ease; /* (-webkit-|-moz-|-o-|)transition */\n#wrapper.toggled \n    padding-left: " + sidebar_width + ";\n#sidebar-wrapper\n    z-index: 1000;\n    position: fixed;\n    left: 0; /* " + sidebar_width + "; */\n    width: 100;\n    height: 100%;\n    padding-top: 50px\n    margin-left: 0; /* -" + sidebar_width + "; */\n    overflow-y: auto;\n    background: #aaa;\n    -webkit-transition: all 0.5s ease;\n    -moz-transition: all 0.5s ease;\n    -o-transition: all 0.5s ease;\n    transition: all 0.5s ease;\n#wrapper.toggled #sidebar-wrapper\n    margin-left: -" + sidebar_width + "; /* width: " + sidebar_width + "; */\n#content-wrapper\n    width: 100%;\n    padding: 15px;\n#wrapper.toggled #content-wrapper\n    position: absolute;\n    margin-right: -" + sidebar_width + ";\n.sidebar-nav\n    position absolute\n    top 40px\n    width " + sidebar_width + "\n    margin 0\n    padding 0\n    list-style none\n.sidebar-nav li\n    text-indent 20px\n    line-height 40px\n.sidebar-nav li a \n    display block\n    text-decoration none\n    color " + Config.$.sidebar.a.color + "\n.sidebar-nav li a:hover\n    text-decoration: none\n    color #000\n    background-color #e8e8e8\n.sidebar-nav li a:active,\n.sidebar-nav li a:focus\n    text-decoration none\n    color #000\n    background-color #ddd\n.sidebar-nav > .sidebar-brand\n    height 65px\n    font-size 18px\n    line-height 60px\n.sidebar-nav > .sidebar-brand a\n    color #999\n.sidebar-nav > .sidebar-brand a:hover\n    color #fff\n    background none\n@media(min-width:768px)\n    #wrapper\n        padding-left " + sidebar_width + "\n        height 100%\n    #wrapper.toggled \n        padding-left 0\n    #sidebar-wrapper\n        width " + sidebar_width + ";\n    #wrapper.toggled #sidebar-wrapper\n        /* width: 0; */\n    #wrapper.toggled #content-wrapper\n        position relative\n        margin-right 0";
    },
    jade: "form#listen-to-menu-change\n#sidebar-wrapper\n    #sidebar-top\n    ul.sidebar-nav#sidebar_menu_insert",
    rendered: function() {
      return $('#listen-to-menu-change').trigger('custom', [__.currentRoute()]);
    },
    events: {
      'custom #listen-to-menu-change': function(event, instance, navbar_menu) {
        var sidebar;
        sidebar = Pages[navbar_menu].sidebar;
        if (sidebar) {
          __.insertTemplate(sidebar, 'sidebar_menu_insert');
          return $("#wrapper").removeClass("toggled");
        } else {
          $('#' + sidebar).empty();
          return $("#wrapper").addClass("toggled");
        }
      }
    }
  },
  __style: {
    __styl: ".navbar-inner\n    padding 0              \n.navbar-header\n    float left\n.navbar-right\n    border 0\n    padding 0\n    margin 0\n.navbar-brand\n    font-size 14px\n.navbar-header > a.navbar-brand:hover\n    color black\n    background-color #eee\n.navbar-right > li > a.dropdown-toggle\n    color #555\n    padding-right 12px\n.navbar-header > a.navbar-brand:focus\n.navbar-right > li > a.dropdown-toggle:focus\n.navbar-nav > li > a:focus\n    color black\n    background-color #ddd\n.navbar-collapse\n    float left\n    width 500px\n#btn-toggle-collapsed\n    height 34px\n    width 38px\n    padding-left 1px\n    padding-right 5px\n    padding-top 5px\n    padding-bottom 2px\n    margin 8px\n.fa-bars:before\n    font-size 18px\n    content \"\f0c9\""
  }
};
