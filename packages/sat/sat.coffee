


db.init = ->
    Config.collections.map (c) ->
        db[c] = new Meteor.Collection c
        if Meteor.isServer
            db[c].allow
                insert: (doc) -> true
                update: (userId, doc, fields, modifier) -> true 
                remove: (userId, doc) -> true
            db[c].deny
                update: (userId, doc, fields, modifier) -> false
                remove: (userId, doc) -> false
            Meteor.publish c, -> db[c].find {}
        else if Meteor.isClient
            Meteor.subscribe c

#        if pagesInFile[file].__events__? and pagesInFile[file].__events__.startup?
#            startup.push pagesInFile[file].__events__.startup
#            delete pagesInFile[file].__events__.startup  # delete Pages if page name startwith __

Pages.init = ->
    delete Pages.init
    pagesInFile = module.exports
    (x.keys pagesInFile).map (file) ->
        Pages[key] = val for key, val of pagesInFile[file] if file[0..1] != '__'
        (( x.keys pagesInFile[file] ).filter (key) -> key[0..1] == '__').map (name) -> delete Pages[name]

Sat.init = ->
    db.init()
    Pages.init()
 
    if Meteor.isServer
        Sat.isServer = true
        Meteor.methods {}
    else if Meteor.isClient
        Sat.isClient = true
        Router.configure layoutTemplate: 'layout'
        startup = []
        router_map = {}
        (x.keys Pages).map (name) -> (x.keys Pages[name]).map (key) ->  # __key will be ignored including __events__. Defined keys = [helpers, events, router]
            if 'helpers' == key
                Template[name].helpers Pages[name].helpers
            else if 'events' == key
                Template[name].events x.func Pages[name].events
            else if 'router' == key 
                router_map[name] = Pages[name].router
            else if 'startup' == key
                startup.push Pages[name].startup
            else if (Config.templates.concat 'eco navbar'.split ' ').indexOf key == -1
                ''
            else if ('rendered created destroyed'.split ' ').indexOf key == -1
                Template[name]? and Template[name][key] = Pages[name][key]
        Router.map ->
            this.route key, router_map[key] for key of router_map
        Meteor.startup -> startup.map (func) -> func()


