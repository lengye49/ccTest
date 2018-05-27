

cc.Class({
    extends: cc.Component,

    Dictionary:function () {
        var items = {};

        this.has = function(key){
            return key in items;
        };

        this.set = function (key,value) {
            items[key] = value;
        };

        this.add = function (key,value) {
            if(this.has(key)){
                items[key] += value;
            }else{
                this.set(key,value);
            }
            return value;
        };

        this.use = function (key,value) {
            if(this.has(key)){
                if(items[key]>value){
                    items[key] -= vlaue;
                    return true;
                }
                else if(items[key] === value){
                    this.remove(key);
                    return true;
                }
            }
            return false;
        };

        this.count = function (key) {
            if (this.has(key)) {
                return items[key];
            }
            return 0;
        };

        this.remove = function (key) {
            if(this.has(key)){
                delete items[key];
                return true;
            }
            return false;
        };

        this.get = function (key) {
            return this.has(key)?items[key]:undefined;
        };

        this.getItems = function () {
            return items;
        };

        this.size = function () {
            return Object.keys(items).length;
        };

        this.clear = function () {
            items = {};
        };

    },

});
