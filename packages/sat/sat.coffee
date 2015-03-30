
db.server = ->
    Settings.collections.map (collection) ->
        console.log collection
        db[collection] = new Meteor.Collection collection
        db[collection].allow
            insert: (doc) -> true
            update: (userId, doc, fields, modifier) -> true 
            remove: (userId, doc) -> true
        db[collection].deny
            update: (userId, doc, fields, modifier) -> false
            remove: (userId, doc) -> false
        Meteor.publish collection, -> db[collection].find {}

db.client = ->
    Settings.collections.map (collection) ->
        db[collection] = new Meteor.Collection collection
        Meteor.subscribe collection

Pages.init = ->
    delete Pages.init
    pagesInFile = module.exports
    (x.keys pagesInFile).map (file) ->
        Pages[key] = val for key, val of pagesInFile[file] if file[0..1] != '__'
        (( x.keys pagesInFile[file] ).filter (key) -> key[0..1] == '__').map (name) -> delete Pages[name]

Sat.init = ->
    Pages.init() 
    if Meteor.isServer
        x.extend Settings, Meteor.settings
        Settings.isServer = true
        db.server()
        methods = {}
        (x.keys Pages).map (name) -> (x.keys Pages[name]).map (key) ->  
            methods[k] = v for k, v of Pages[name][key] if 'methods' == key
        Meteor.methods methods
        console.log Settings
    else if Meteor.isClient
        x.extend Settings, Session.get 'Settings'
        Settings.isClient = true
        db.client()
        Router.configure layoutTemplate: 'layout'
        startup = []
        router_map = {}
        (x.keys Pages).map (name) -> (x.keys Pages[name]).map (key) ->  
            if 'events' == key
                Template[name].events x.func Pages[name].events
            else if 'router' == key 
                router_map[name] = Pages[name].router
            else if 'startup' == key
                startup.push Pages[name].startup
            else if key in Config.templates.concat 'eco navbar'.split ' '
                ''
            else if key in 'helpers onRendered onCreated onDestroyed'.split ' '
                Template[name][key] Pages[name][key]
        Router.map ->
            this.route key, router_map[key] for key of router_map
        Meteor.startup -> startup.map (func) -> func()

if Meteor.isClient
    $ ($) -> 
        Settings.isClient or Sat.init()
        $.fn[k] = x.$[k] for k of x.$
else if Meteor.isServer
    Meteor.startup -> Settings.isServer or Sat.init()

###
if (Meteor.isClient) {
    $( function ($) { 
        Settings.isClient || Sat.init();
        for (key in x) {
            $.fn[key] = x.$[key]
        }
    });
} else if (Meteor.isServer) {
    Meteor.startup(function() { Settings.isServer || Sat.init(); });
}
###

