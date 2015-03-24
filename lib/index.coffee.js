var assignPopover, calendar, calendar_size, contentEditable, date_box_size, extend, fym, o, o_list, parseValue, popover, position, query, repcode, scrollSpy, sidebar, slice, ß, ø;

String.prototype.toDash = function() {
  return this.replace(/([A-Z])/g, function($1) {
    return '-' + $1.toLowerCase();
  });
};

extend = function($source, $target) {
  return ('display float resize margin padding'.split(' ')).concat('color backgroundColor border'.split(' ')).forEach(function(a) {
    if ($source.css(a)) {
      return $target.css(a, $source.css(a));
    }
  });
};

position = function(obj) {
  return Meteor.setTimeout(function() {
    return $('#' + obj.parentId + ' .' + obj["class"]).css({
      top: obj.top,
      left: obj.left,
      position: 'absolute'
    });
  }, 200);
};

query = function() {
  return Iron.Location.get().queryObject;
};

repcode = function() {
  return ('ᛡ* ᐩ+ ᐟ/ ǂ# ꓸ. ꓹ, ـ- ᚚ= ꓽ: ꓼ; ˈ\' ᐦ" ᐸ< ᐳ> ʿ( ʾ) ʻ{ ʼ}'.split(' ')).reduce((function(o, v) {
    o[v.slice(1)] = RegExp("" + v[0], "g");
    return o;
  }), {
    ' ': /ˌ/g
  });
};

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

o_list = function(what) {
  return ((what = 'string' === typeof what ? what.split(' ') : Array.isArray(what) ? what : []).map(function(a) {
    return "." + a + " {{" + a + "}}";
  })).join('\n');
};

contentEditable = function(id, func) {
  var $cloned;
  $cloned = void 0;
  return $('#' + id).on('focus', '[contenteditable]', function() {
    $(this).data('before', $(this).html());
    return $(this);
  }).on('blur keyup paste input', '[contenteditable]', function() {
    $(this).data('before', $(this).html());
    if ($(this).data('before') !== $(this).html()) {
      console.log('edited');
      func(this);
    }
    return $(this);
  }).on('scroll', '[contenteditable]', function(event) {
    $(this).scrollTop(0);
    event.preventDefault();
    return false;
  }).on('keydown', '[contenteditable]', function() {
    var zIndex;
    if (!$cloned) {
      zIndex = $(this).css('z-index');
      if (parseInt(zIndex, 10) === NaN) {
        $(this).css({
          'z-index': zIndex = 10
        });
      }
      $cloned = $(this).clone();
      $cloned.css({
        'z-index': zIndex - 1,
        position: 'absolute',
        top: $(this).offset().top,
        left: $(this).offset().left,
        overflow: 'hidden',
        outline: 'auto 5px -webkit-focus-ring-color'
      });
      $(this).before($cloned);
    } else {
      $cloned.html($(this).html());
    }
    console.log($cloned.css({
      opacity: 1
    }));
    console.log($(this).css({
      overflow: 'visible',
      opacity: 0
    }));
    return Meteor.setTimeout((function(_this) {
      return function() {
        $(_this).css({
          overflow: 'hidden',
          opacity: 1
        });
        return $cloned.css({
          opacity: 0
        });
      };
    })(this), 200);
  });
};

(typeof window !== "undefined" && window !== null) && ('DIV H2 BR'.split(' ')).map(function(a) {
  return window[a] = function(obj, str) {
    if (str != null) {
      return HTML.toHTML(HTML[a](obj, str));
    } else {
      return HTML.toHTML(HTML[a](obj));
    }
  };
});

scrollSpy = function(obj) {
  var $$;
  $$ = $('.scrollspy');
  $$.scrollSpy();
  return ['enter', 'exit'].forEach(function(a) {
    return $$.on('scrollSpy:' + a, function() {
      if (obj[a] != null) {
        return obj[a][$(this).attr('id')]();
      }
    });
  });
};

slice = function(str) {
  return this._.slice(str);
};

sidebar = function(list, id) {
  if (id == null) {
    id = 'sidebar_menu';
  }
  return {
    list: list,
    jade: function() {
      return this._.slice("each items|>+menu_list");
    },
    helpers: {
      items: function() {
        return list.map(function(a) {
          return {
            page: a,
            id: id
          };
        });
      }
    }
  };
};

assignPopover = function(o, v) {
  o['focus input#' + v] = function() {
    return $('input#' + v).attr('data-content', __.render('popover_' + v)).popover('show');
  };
  return o;
};

popover = function(list) {
  return list.reduce((function(o, v) {
    return assignPopover(o, v);
  }), {});
};

ø = '';

ß = '&nbsp;';

fym = 'YYYYMM';

calendar = function(id_ym) {
  var $id, action, moment_ym, top, _i, _j, _ref, _ref1, _results, _results1;
  action = moment().format(fym) > id_ym ? 'prepend' : 'append';
  $('#items')[action](DIV({
    "class": 'month',
    id: id_ym
  }));
  moment_ym = moment(id_ym, fym);
  top = $(window).scrollTop();
  ($id = $('#' + id_ym)).append(H2({
    id: id_ym
  }, moment_ym.format('MMMM YYYY')));
  (function() {
    _results = [];
    for (var _i = 1, _ref = parseInt(moment_ym.startOf('month').format('d')); 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--){ _results.push(_i); }
    return _results;
  }).apply(this).forEach(function(i) {
    return $id.append(DIV({
      "class": 'everyday empty',
      style: 'visibility:hidden'
    }));
  });
  (function() {
    _results1 = [];
    for (var _j = 1, _ref1 = parseInt(moment_ym.endOf('month').format('D')); 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; 1 <= _ref1 ? _j++ : _j--){ _results1.push(_j); }
    return _results1;
  }).apply(this).forEach(function(i) {
    var id;
    $id.append(DIV({
      "class": 'everyday',
      id: id = id_ym + ('0' + i).slice(-2)
    }));
    __.insertTemplate('day', id, {
      id: id
    });
    contentEditable(id, function(_id) {
      var content, doc;
      id = $(_id).parent().attr('id');
      content = $(_id).html();
      switch ($(_id).attr('class')) {
        case 'title':
          console.log('title', id, content);
          if (doc = db.Calendar.findOne({
            id: id
          })) {
            return db.Calendar.update({
              _id: doc._id,
              $set: {
                title: content,
                event: doc.event
              }
            });
          } else {
            return db.Calendar.insert({
              id: id,
              title: content
            });
          }
          break;
        case 'event':
          console.log('event', id, content);
          if (doc = db.Calendar.findOne({
            id: id
          })) {
            return db.Calendar.update({
              _id: doc._id,
              $set: {
                title: doc.title,
                event: content
              }
            });
          } else {
            return db.Calendar.insert({
              id: id,
              event: content
            });
          }
      }
    });
    return ['title', 'event'].forEach(function(s) {
      return $("#" + id + " > ." + s).attr('contenteditable', 'true');
    });
  });
  if ('prepend' === action) {
    Meteor.setTimeout((function() {
      return $(window).scrollTop(top + $id.outerHeight());
    }), 10);
    return $('#top').data({
      id: id_ym
    });
  } else {
    return $('#bottom').data({
      id: id_ym
    });
  }
};

date_box_size = 120;

calendar_size = date_box_size * 7 + 14;

module.exports.index = {
  logo: {
    jade: o({
      '#logo': 'Getbur'
    }),
    styl: o({
      '#logo': {
        width: 110,
        float: 'left',
        padding: 15,
        fontWeight: '200',
        fontSize: 15,
        color: 'white',
        textAlign: 'right'
      }
    })
  },
  layout: {
    jade: o({
      '+navbar': '',
      '#wrapper': {
        '+sidebar': '',
        '+yield': ''
      }
    }),
    styl: o({
      body: {
        backgroundColor: '#ddd'
      }
    }),
    navbar: {
      sidebar: true,
      login: true,
      menu: 'home map calendar vehicle request log help'
    }
  },
  home: {
    label: 'Home',
    sidebar: 'sidebar_home',
    router: {
      path: '/'
    },
    jade: o({
      '#contentWrapper': {
        h2: 'Sign up with UBER',
        '.col-md-5': {
          'with uber': {
            '+button': ''
          }
        },
        '.col-md-5': {
          'a(class="btn-info", href="https://uber.getber.com")': 'Connect with Uber'
        },
        '.row#items': {
          '.col-md-12#pack': {
            'each items': {
              '+item': ø
            }
          }
        }
      }
    }),
    styl: o({
      '#items .item': {
        backgroundColor: 'white',
        width: 240,
        height: 240,
        float: 'left',
        margin: 6
      }
    }),
    rendered: function() {
      return Meteor.setTimeout((function() {
        return $('#pack').masonry({
          itemSelector: '.item',
          columnWidth: 126
        });
      }), 40);
    },
    helpers: {
      items: function() {
        return db.Items.find({}, {
          sort: {
            created_time: -1
          }
        });
      },
      uber: {
        "class": 'btn-success',
        id: 'uber-botton',
        label: 'Connect with Uber'
      }
    },
    events: {
      'click #uber-botton': function(event) {
        return console.log('uber');
      }
    }
  },
  sidebar_home: sidebar(['home', 'calendar', 'help']),
  item: {
    jade: ".item(style='height:{{height}}px;color:{{color}}')"
  },
  vehicle: {
    label: 'Vehicle',
    sidebar: 'sidebar_vehicle',
    router: {
      path: 'vehicle'
    },
    jade: o({
      '#contentWrapper': {
        h1: 'You vehicle information',
        br: '',
        '.col-sm-7': {
          'each items': {
            '+form': '',
            br: ''
          }
        }
      }
    }),
    helpers: {
      items: function() {
        return [
          {
            label: 'Maker',
            id: 'maker',
            title: 'Car manufacturer',
            icon: 'mobile'
          }, {
            label: 'Model',
            id: 'model',
            title: 'Year of the model',
            icon: 'mobile'
          }, {
            label: 'Color',
            id: 'color',
            title: 'Color of your vehicle',
            icon: 'mobile'
          }
        ];
      }
    },
    events: popover('maker model color'.split(' '))
  },
  popover_maker: {
    jade: o({
      ul: {
        li: 'manufacturer in 20 characters'
      }
    })
  },
  popover_model: {
    jade: o({
      ul: {
        li: 'For digit'
      }
    })
  },
  popover_color: {
    jade: o({
      ul: {
        li: 'White or black only'
      }
    })
  },
  sidebar_map: sidebar('home map calendar request vehicle log help'.split(' ')),
  map: {
    label: 'Map',
    sidebar: 'sidebar_map',
    router: {
      path: 'map'
    },
    jade: '#map-canvas',
    styl: o({
      '#map-canvas': {
        height: '100%',
        padding: 0,
        margin: 0
      }
    }),
    rendered: function() {
      google.maps.event.addDomListener(window, 'load', Pages.map.map_init);
      return Meteor.setTimeout(Pages.map.map_init, 10);
    },
    map_init: function() {
      return new google.maps.Map(document.getElementById('map-canvas'), {
        disableDefaultUI: true,
        zoom: 11,
        center: {
          lat: 53.52,
          lng: -113.5
        }
      });
    }
  },
  sidebar_map: sidebar('home map calendar request vehicle log help'.split(' ')),
  calendar: {
    label: 'Calendar',
    router: {},
    jade: o({
      '#contentWrapper': {
        '#containerCalendar': {
          '.scrollspy#top': ß,
          '#items': '',
          '.scrollspy#bottom': ß
        }
      }
    }),
    rendered: function() {
      var this_month;
      calendar(this_month = moment().format(fym));
      $('#top').data({
        id: this_month
      });
      return scrollSpy({
        enter: {
          top: function() {
            return calendar(moment($('#top').data('id'), fym).subtract(1, 'month').format(fym));
          },
          bottom: function() {
            return calendar(moment($('#bottom').data('id'), fym).add(1, 'month').format(fym));
          }
        }
      });
    },
    styl: o({
      '#containerCalendar': {
        width: calendar_size,
        maxWidth: calendar_size
      },
      h2: {
        color: 'black',
        display: 'block'
      },
      '.everyday': {
        position: 'relative',
        width: date_box_size,
        height: date_box_size,
        float: 'left',
        padding: 8,
        backgroundColor: 'white',
        margin: 2
      },
      '.month': {
        display: 'block',
        height: calendar_size
      },
      '.spacer': {
        lineHeight: 10
      }
    })
  },
  log: {
    label: 'Log',
    router: {
      path: 'log'
    },
    jade: '#log-canvas',
    rendered: function() {
      return $('#log-canvas').html('<object id="full-screen" data="http://localhost:8778/"/>');
    },
    styl: o({
      '#log-canvas': {
        height: '100%',
        width: '100%'
      },
      '#full-screen': {
        height: '100%',
        width: '100%'
      }
    })
  },
  submit: {
    label: 'Submit',
    router: {
      path: 'submit'
    },
    jade: o({
      h2: 'Connected',
      p: 'code is: {{code}}'
    }),
    helpers: {
      code: function() {
        return Iron.Location.get().queryObject.code;
      }
    }
  },
  policy: {
    label: 'Policy',
    router: {
      path: 'policy'
    },
    jade: o({
      h2: 'Privacy Policy'
    })
  },
  uber: {
    label: 'uber',
    router: {
      path: 'uber'
    },
    jade: o({
      h2: 'Uber'
    })
  },
  redirect: {
    label: 'redirect',
    router: {
      path: 'redirect'
    },
    jade: o({
      h2: 'redirect'
    })
  },
  day: {
    collection: 'calendar',
    jade: o_list('init title date day event'),
    helpers: {
      date: function() {
        return moment(this.id, 'YYYYMMDD').format('D');
      },
      day: function() {
        return moment(this.id, 'YYYYMMDD').format('ddd');
      },
      title: function() {
        var _ref;
        return ((_ref = db.Calendar.findOne({
          id: this.id
        })) != null ? _ref['title'] : void 0) || 'Title';
      },
      event: function() {
        return '';
      },
      init: function() {
        position({
          parentId: this.id,
          "class": 'title',
          top: 14
        }, position({
          parentId: this.id,
          "class": 'event',
          top: 45
        }, position({
          parentId: this.id,
          "class": 'date',
          top: 5,
          left: date_box_size - 35
        })));
        position({
          parentId: this.id,
          "class": 'day',
          top: 28,
          left: date_box_size - 37
        });
        return ø;
      }
    },
    styl: o({
      '.init': {
        display: 'none'
      },
      '.title': {
        display: 'inline',
        fontWeight: '100'
      },
      '.date': {
        display: 'inline',
        fontWeight: '600',
        fontSize: '14pt',
        width: 24,
        textAlign: 'right'
      },
      '.day': {
        display: 'table',
        fontWeight: '100',
        float: 'right',
        width: 24,
        textAlign: 'right',
        color: '#444',
        fontSize: '8pt'
      },
      '.event': {
        resize: 'none',
        fontWeight: '100'
      },
      '.row#day01': {
        marginBottom: 0
      }
    })
  },
  request: {
    label: 'Request',
    router: {
      path: 'request'
    },
    jade: o({
      '#contentWrapper': {
        h1: 'Request a Mek',
        br: '',
        '.col-sm-7': {
          'each items': {
            '+form': '',
            br: ''
          }
        }
      }
    }),
    helpers: {
      items: function() {
        return [
          {
            label: 'Name',
            id: 'name',
            title: 'Your name',
            icon: 'user'
          }, {
            label: 'Phone',
            id: 'phone',
            title: 'Phone Number',
            icon: 'mobile'
          }, {
            label: 'Address',
            id: 'address',
            title: 'Your home Zip code',
            icon: 'envelope'
          }
        ];
      }
    },
    events: popover('name phone address'.split(' '))
  },
  popover_name: {
    jade: o({
      ul: {
        li: 'Write your name.',
        'li ': 'No longer then 12 letters.'
      }
    })
  },
  popover_phone: {
    jade: o({
      ul: {
        li: 'Write your phone number.'
      }
    })
  },
  popover_address: {
    jade: o({
      ul: {
        li: 'Write your zipcode.'
      }
    })
  },
  help: {
    label: 'Help',
    router: {},
    jade: o({
      '#contentWrapper': {
        h1: 'Help'
      }
    })
  }
};
