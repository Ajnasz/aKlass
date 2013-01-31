/*jslint node: true */
var JSFacePerson, JSFaceFrenchGuy, JSFaceParisLover,
    AklassPerson, AklassFrenchGuy, AklassParisLover,
    AklasspPerson, AklasspFrenchGuy, AklasspParisLover,
    JqKlassPerson, JqKlassFrenchGuy, JqKlassParisLover,
    aKlass, aKlassp, jsface,
    dirname;

dirname = __dirname;
if (!global.jQuery) {
    global.jQuery = {};
}

aKlass = require(dirname + '/../index').aKlass;
aKlassp = require(dirname + '/../aklass-parent').aKlass;
jsface = require(dirname + '/jsface');
require(dirname + '/jqueryClass');

JSFacePerson = jsface.Class({
    constructor: function (name) {
        this.name = name;
    },
    setAddress: function (country, city, street) {
        this.country = country;
        this.city = city;
        this.street = street;
    }
});

JSFaceFrenchGuy = jsface.Class(JSFacePerson, {
    constructor: function (name) {
        JSFaceFrenchGuy.$super.call(this, name);
    },
    setAddress: function (city, street) {
        JSFaceFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
    }
});

JSFaceParisLover = jsface.Class(JSFaceFrenchGuy, {
    constructor: function (name) {
        JSFaceParisLover.$super.call(this, name);
    },
    setAddress: function (street) {
        JSFaceParisLover.$superp.setAddress.call(this, 'Paris', street);
    }
});

AklassPerson = aKlass.klass({
    initialize: function (name) {
        this.name = name;
    },

    setAddress: function (country, city, street) {
        this.country = country;
        this.city = city;
        this.street = street;
    }
});

AklassFrenchGuy = AklassPerson.extend({
    initialize: function (name) {
        AklassFrenchGuy.$super.call(this, name);
    },

    setAddress: function (city, street) {
        AklassFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
    }
});

AklassParisLover = AklassFrenchGuy.extend({
    initialize: function (name) {
        AklassParisLover.$super.call(this, name);
    },

    setAddress: function (street) {
        AklassParisLover.$superp.setAddress.call(this, 'Paris', street);
    }
});

AklasspPerson = aKlassp.klass({
    initialize: function (name) {
        this.name = name;
    },

    setAddress: function (country, city, street) {
        this.country = country;
        this.city = city;
        this.street = street;
    }
});

AklasspFrenchGuy = AklasspPerson.extend({
    initialize: function (name) {
        // AklasspFrenchGuy.$super.call(this, name);
        this.parent(name);
    },

    setAddress: function (city, street) {
        // AklasspFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
        this.parent('France', city, street);
    }
});

AklasspParisLover = AklasspFrenchGuy.extend({
    initialize: function (name) {
        // AklasspParisLover.$super.call(this, name);
        this.parent(name);
    },

    setAddress: function (street) {
        // AklasspParisLover.$superp.setAddress.call(this, 'Paris', street);
        this.parent('Paris', street);
    }
});

JqKlassPerson = global.jQuery.klass({
    initialize: function (name) {
        this.name = name;
    },

    setAddress: function (country, city, street) {
        this.country = country;
        this.city = city;
        this.street = street;
    }
});

JqKlassFrenchGuy = JqKlassPerson.extend({
    initialize: function (name) {
        // AklasspFrenchGuy.$super.call(this, name);
        this.parent(name);
    },

    setAddress: function (city, street) {
        // AklasspFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
        this.parent('France', city, street);
    }
});

JqKlassParisLover = JqKlassFrenchGuy.extend({
    initialize: function (name) {
        // AklasspParisLover.$super.call(this, name);
        this.parent(name);
    },

    setAddress: function (street) {
        // AklasspParisLover.$superp.setAddress.call(this, 'Paris', street);
        this.parent('Paris', street);
    }
});

global.JSFacePerson = JSFacePerson;
global.JSFaceFrenchGuy = JSFaceFrenchGuy;
global.JSFaceParisLover = JSFaceParisLover;
global.AklassPerson = AklassPerson;
global.AklassFrenchGuy = AklassFrenchGuy;
global.AklassParisLover = AklassParisLover;
global.AklasspPerson = AklasspPerson;
global.AklasspFrenchGuy = AklasspFrenchGuy;
global.AklasspParisLover = AklasspParisLover;
global.JqKlassPerson = JqKlassPerson;
global.JqKlassFrenchGuy = JqKlassFrenchGuy;
global.JqKlassParisLover = JqKlassParisLover;
