/**
 * monpy-router
 *
 * Copyright (c) 2015 monpoco
 * MIT Licensed
 */

/**
 * root routing
 */
var __routing_root__ = {
    controller: 'home',
    action: 'index'
};


/**
 * Initialize a new `Rule`.
 */
var Rule = function (pattern, obj) {

    var self = this;

    self.pattern = pattern.slice(pattern.length - 1) == '/' 
                    ? pattern.substr(0, pattern.length-1) 
                    : pattern;

    self.params = obj 
                    ? obj 
                    : {};

    self.regex = self.pattern;
    self.matches = self.regex.match(/:([^/\.]+)/g);

    if (self.matches) {

        for (var i = 0; i < self.matches.length; i++) {

            var str = self.matches[i].slice(1);
            var r;
            
            if(str === 'controller' || str === 'action') r = '([^/\.]+)';
            else r = '([^/]+)';

            self.regex = self.regex.replace(':' + str, r);
            self.params[str] = i;

        }

    }

    this.__validate();
};


/**
 * Rule validation.
 *
 * @return {boolean}
 * @api private
 */
Rule.prototype.__validate = function () {

    if (typeof this.params['controller'] === 'undefined')
        throw new Error('"controller" is required');

    if (typeof this.params['action'] === 'undefined')
        this.params['action'] = __routing_root__.action;

    if (this.regex.substr(0, 1) != '^')
        this.regex = '^' + this.regex;

    if (this.regex.slice(this.regex.length - 1) != '$')
        this.regex = this.regex + '$';
};

/**
 * Matching a url against a rule.
 *
 * @return {object}
 * @api private
 */
Rule.prototype.match = function (src) {

    if (src.substr(src.length - 1) == '/')
        src = src.substr(0, src.length - 1);

    var r = new RegExp(this.regex, 'i'),
        m = src.match(r);

    if(m) {

        var param = easyDeepClone(this.params);

        if(m.length == 1)
            return  param;

        var i = 1;
        for(var k in param) {
            if(param[k] === (i-1)){
                
                var v = m[i++] || '';
                param[k] = v;
            }
        }
        return param;
    }
    return null;
};


function easyDeepClone(o) {
    return (typeof uneval == "function") ? eval(uneval(o)) : JSON.parse(JSON.stringify(o));
}


/**
 * Initialize a new `Router`.
 */
var Router = function () {

    this.__routing_table = [];
    this.__routing_table_default = [
        (new Rule('/:controller/:action')),
        (new Rule('/:controller'))
    ];
};

/**
 * Set root
 *
 * @param {object} obj
 * @api public
 */
Router.prototype.root = function (obj) {
    __routing_root__.controller = obj.controller || __routing_root__.controller;
    __routing_root__.action = obj.action || __routing_root__.action;
    return this;
};

/**
 * Add rule
 *
 * @param {string} pattern
 * @param {object} obj
 * @api public
 */
Router.prototype.add = function (pattern, obj) {
    this.__routing_table.push( new Rule(pattern, obj) );
};

/**
 * resolve url
 *
 * @param {string} pattern
 * @param {object} obj
 * @api public
 */
Router.prototype.resolve = function (url) {
    
    var ret;
    if (url === '/')
        return easyDeepClone(__routing_root__);

    ret = this.__resolve_by_table(url, this.__routing_table);

    if(!ret)
        ret = this.__resolve_by_table(url, this.__routing_table_default);
    
    if(!ret)
        return null;

    if(ret.controller && !ret.action)
        ret.action = __routing_root__.action;

    return ret;
};

/**
 * resolve url
 *
 * @param {string} pattern
 * @param {object} obj
 * @api public
 */
Router.prototype.__resolve_by_table = function (url, tbl) {
    for (var i in tbl) {
        var ret = tbl[i].match(url);
        if(ret)
            return ret;
    }
    return null;
};

module.exports = new Router;


