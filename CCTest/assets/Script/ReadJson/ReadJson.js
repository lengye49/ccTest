// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {

    },


    start:function () {
        window.ReadJson = this;
    },

    ReadJsonFile:function (url) {
        cc.loader.loadRes(url,function(err,res){
            // console.log('load['+url+'],err['+err+'],result'+JSON.stringify(res));
            // var obj = JSON.parse(res);
            console.log("********name:"+res[0].name);
            console.log("********desc"+res[1].desc);
        });
    },


    getItem:function (itemId) {
        var item = new Object;
        var i;
        cc.loader.loadRes("items.json",function(err,res){
            for(i=0;i<res.length;i++){
                if(res[i].id != itemId)
                    continue;
                else{
                    item.id = itemId;
                    item.name = res[i].name;
                    item.desc = res[i].desc;
                    break;
                }
            }
        });
        return item;
    },

    getNPC:function (npcId) {
        var npc = new Object;
        var i;
        cc.loader.loadRes("npcs.json",function(err,res){
            for(i=0;i<res.length;i++){
                if(res[i].id != npcId)
                    continue;
                else{
                    npc.id = npcId;
                    npc.name = res[i].name;
                    npc.desc = res[i].desc;
                    break;
                }
            }
        });
        return npc;
    },

    getBackPackItems:function (str) {
        var backpackItems = new this.Dictionary();
        var strs = str.split(",");
        var i;
        for(i=0;i<strs.length;i++){
            var temp = strs[i].split("|");
            var item = this.getItem(parseInt(temp[0]));
            var num = parseInt(temp[1]);
            backpackItems.set(item,num);
        }
        return backpackItems;
    },

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
