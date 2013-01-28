/* jslint node: true */
(function (context) {

    function skipKey(key) {
        var keys = {
            '$superb': 1,
            '$super': 1
        };
        return !keys.hasOwnProperty(key);
    }

    function mix(parent, mixin) {
        var prop;

        for (prop in mixin) {
            if (mixin.hasOwnProperty(prop) && skipKey(prop)) {
                parent[prop] = mixin[prop];
            }
        }
    }

    function addMixins(Class, mixins) {
        var index, mixinLength, mixin;

        for (index = 0, mixinLength = mixins.length; index < mixinLength; index += 1) {
            mixin = mixins[index];
            if (mixin.prototype) {
                mixin = mixin.prototype;
            }
            mix(Class.prototype, mixin);
        }
    }

    function addStatics(statics, Class) {
        mix(statics, Class);
    }

    function classExtend(proto) {
        return extend(this, proto);
    }

    function extend(Parent, proto) {
        var Class, key, mixin, index, mixinLength, constructor, oldInit;
        constructor = function () {
            if (typeof this.initialize === 'function') {
                this.initialize.apply(this, arguments);
            }
        };

        // constructor = proto.initialize || function () {};

        Class = constructor;

        if (Parent) {
            oldInit = Parent.prototype.initialize;
            Parent.prototype.initialize = null;
            Class.prototype = new Parent();
            Parent.prototype.initialize = oldInit;

            // inherit prototype
            mix(Class.prototype, Parent.prototype);

            // mix statics
            mix(Class, Parent);

            // if no both super and superp and want to access to
            // superp.initialize it makes much slower the construction when
            // instanciate a inherited class.
            Class.$super = Parent.prototype.initialize;
            Class.$superp = Parent.prototype;
        }

        Class.prototype.constructor = Class;
        Class.extend = classExtend;

        if (proto.mixins) {
            addMixins(Class, proto.mixins);
            delete proto.mixins;
        }

        if (proto.statics) {
            addStatics(Class, proto.statics);
            delete proto.statics;
        }

        mix(Class.prototype, proto);

        return Class;
    }

    function klass(proto) {
        return extend(null, proto);
    }

    context.aKlass = {
        klass: klass,
        extend: extend
    };

    if (typeof module === 'object' && module.exports) {
        exports.aKlass = context.aKlass;
    }

}(this));
