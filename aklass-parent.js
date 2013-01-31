/* jslint node: true */
(function (context) {
    var keys = {
        '$superb': 1,
        '$super': 1,
        'constructor': 1
    };

    function mix(parent, mixin) {
        var prop;

        for (prop in mixin) {
            if (mixin.hasOwnProperty(prop) && !keys.hasOwnProperty(prop)) {
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

    function addStatics(Class, statics) {
        mix(Class, statics);
    }

    /**
     * Function that does exactly the same as the mout counterpart,
     * but is faster in firefox due to a bug:
     * https://bugzilla.mozilla.org/show_bug.cgi?id=816439
     * @method inheritPrototype
     * @private
     * @param {Function} A Function which inherits the protoype of B
     * @param {Function} B Functions which's prototype will be inherited by A
     */
    function inheritPrototype(A, B) {
        var F = function () {};
        F.prototype = B.prototype;
        A.prototype = new F();
        A.prototype.constructor = A;
    }

    function extend(Proto) {
        var Parent, Class, parentProto, classProto, key, mixin, index, mixinLength, constructor, i;

        Parent = this;

        constructor = function () {
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }
        };

        Class = constructor;

        inheritPrototype(Class, Parent);

        addStatics(Class, Parent);

        if (Proto.mixins) {
            addMixins(Class, Proto.mixins);
            delete Proto.mixins;
        }

        if (Proto.statics) {
            addStatics(Class, Proto.statics);
            delete Proto.statics;
        }

        classProto = Class.prototype;
        parentProto = Parent.prototype;

        function getInheritedFunction(parent, i) {
            return function () {
                this.parent = Class.$superp[i];
                return Proto[i].apply(this, arguments);
            };
        }

        // mix(classProto, Proto);
        for (i in Proto) {
            if (Proto.hasOwnProperty(i)) {
                if (typeof parentProto[i] === 'function') {
                    classProto[i] = getInheritedFunction(Parent, i);
                } else {
                    classProto[i] = Proto[i];
                }
            }
        }

        // if no both super and superp and want to access to
        // superp.initialize it makes much slower the construction when
        // instanciate a inherited class.
        Class.$super = parentProto.initialize;
        Class.$superp = parentProto;

        classProto.constructor = Class;
        Class.extend = extend;

        return Class;
    }

    function klass(proto) {
        var constructor, Class;
        constructor = function () {
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }
        };
        Class = constructor;
        Class.prototype = proto;
        Class.prototype.constructor = constructor;
        Class.extend = extend;

        if (proto.mixins) {
            addMixins(Class, proto.mixins);
            delete proto.mixins;
        }

        if (proto.statics) {
            addStatics(Class, proto.statics);
            delete proto.statics;
        }

        return Class;
    }

    context.aKlass = {
        klass: klass,
        extend: extend
    };

    if (typeof module === 'object' && module.exports) {
        exports.aKlass = context.aKlass;
    }

}(this));
