var isVisible, o, parseValue;

parseValue = function(value) {
  var k, v;
  if ('number' === typeof value) {
    return value.toString() + 'px';
  } else if ('string' === typeof value) {
    return ((function() {
      var _ref, _results;
      _ref = repcode();
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        _results.push(value = value.replace(v, k));
      }
      return _results;
    })()).pop();
  } else if ('function' === typeof value) {
    return value();
  } else {
    return value;
  }
};

o = function(obj, depth) {
  if (depth == null) {
    depth = 1;
  }
  return ((Object.keys(obj)).map(function(key) {
    var k, v, value, _ref;
    value = obj[key];
    _ref = repcode();
    for (k in _ref) {
      v = _ref[k];
      key = key.replace(v, k);
    }
    key = key.toDash();
    return (Array(depth).join('    ')) + ('object' === typeof value ? [key, o(value, depth + 1)].join('\n') : '' === value ? key : key + ' ' + parseValue(value));
  })).join('\n');
};

isVisible = function(v) {
  if ('function' === typeof v) {
    return v();
  } else if (false === v) {
    return false;
  } else {
    return true;
  }
};

module.exports.ui = {
  html: {
    jade: ' ',
    head: function() {
      return o({
        'title': this.C.title,
        "link(rel='stylesheet'": "href='" + this.C._.font_style.pt_sans + "')",
        "script(type='text/javascript'": "src='https://maps.googleapis.com/maps/api/js?key=AIzaSyB2RuPxiq1JbG18Lq793FdEzWM-7-MYX8Q')"
      });
    },
    startup: function() {
      return Config.collections;
    },
    styl: function() {
      return o({
        html: {
          height: '100%'
        },
        body: {
          height: '100%',
          fontFamily: this.C.$.font_family,
          fontWeight: this.C.$.font_weight
        }
      });
    }
  },
  form: {
    jade: "if visible\n    .input-group.margin-bottom-sm\n       span.input-group-addon: i.fa.fa-fw(class=\"fa-{{icon}}\")\n       input.form-control(id=\"{{id}}\" type=\"{{type}}\" placeholder=\"{{label}}\" title=\"{{title}}\" data-toggle=\"popover\" data-trigger=\"hover\" data-placement=\"right\" data-html=\"true\")",
    helpers: {
      type: function() {
        return this.type || "text";
      },
      visible: function() {
        return isVisible(this.visible);
      },
      id: function() {
        return this.id || __.dasherize(this.label.toLowerCase().trim());
      },
      title: function() {
        return this.title;
      }
    },
    styl$: ".popover\n    font-family 'PT Sans', sans-serif\n    width 200px\n.popover-title\n    font-size 14px                \n.popover-content\n    font-size 12px\n    padding 5px 0px\n.popover-content > ul\n    padding-left 32px\n.popover-inner\n    width 100%"
  },
  button: {
    jade: "if visible\n    button.btn(class=\"{{class}}\" id=\"{{id}}\" type=\"{{type}}\") {{label}}",
    helpers: {
      type: function() {
        return this.type || "button";
      },
      visible: function() {
        return isVisible(this.visible);
      },
      id: function() {
        return this.id || __.dasherize(this.label.toLowerCase().trim());
      },
      "class": function() {
        return this["class"] || 'btn-primary';
      }
    },
    styl$: ".btn\n    font-family 'PT Sans'\n    width 150px //166\n    border 0\n    margin-top 5px\n.btn-default\n    background-color #f8f8f8  \n.btn-default \n.btn-primary \n.btn-success \n.btn-info \n.btn-warning \n.btn-danger \n.btn-default:hover\n.btn-primary:hover\n.btn-success:hover\n.btn-info:hover\n.btn-warning:hover\n.btn-danger:hover\n    border 0"
  },
  dialog: {
    jade: "button.btn(href=\"#myModal\" role=\"button\" data-toggle=\"modal\") Modal\n.modal.fade#myModal(tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\")\n    .modal-dialog: .modal-content\n        .modal-header\n            button.close(type=\"button\" data-dismiss=\"modal\" aria-hidden=\"true\") ×\n            h3#myModalLabel {{modalHeader}}\n        .modal-body\n            p {{modalBody}}\n        .modal-footer\n            button.btn(data-dismiss=\"modal\" aria-hidden=\"true\") {{modalCloseButton}}\n            button.btn.btn-primary {{modalActionButton}}",
    helpers: {
      modalHeader: function() {
        return "Modal Header";
      },
      modalBody: function() {
        return "One fine body!";
      },
      modalCloseButton: function() {
        return "Close";
      },
      modalActionButton: function() {
        return "Save Changes";
      }
    },
    styl$: ".modal-backdrop\n    opacity: 0.50"
  },
  a: {
    jade: "if visible\n    a(class=\"{{class}}\" id=\"{{id}}\") {{label}}",
    helpers: {
      visible: function() {
        return isVisible(this.visible);
      },
      id: function() {
        return this.id || __.dasherize(this.label.toLowerCase().trim());
      },
      "class": function() {
        return this["class"];
      }
    }
  },
  menu: {
    jade: "if visible\n    if divider\n        li.divider\n    else\n        li: a(id=\"{{id}}\" class=\"{{class}}\" style=\"{{style}}\")\n            i.fa(class=\"fa-{{icon}}\" class=\"{{icon_class}}\")\n            | {{label}}",
    helpers: {
      visible: function() {
        return isVisible(this.visible);
      },
      id: function() {
        return this.id;
      },
      icon: function() {
        return this.icon;
      },
      "class": function() {
        return this["class"] || 'menu-list';
      },
      style: function() {
        return this.style;
      },
      icon_class: function() {
        return this.icon_class || 'dropdown-menu-icon';
      },
      label: function() {
        return this.label;
      },
      divider: function() {
        if (this.label === '-') {
          return true;
        }
      }
    }
  },
  alert: {
    jade: "if visible\n    .alert(class=\"{{class}}\") {{message}}",
    helpers: {
      visible: function() {
        return isVisible(this.visible) && this.message;
      },
      "class": function() {
        return this["class"] || 'alert-success';
      }
    }
  },
  br: {
    jade$: "br(style='line-height:{{height}};')"
  }
};
