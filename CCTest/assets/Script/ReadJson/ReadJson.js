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
        require("Dictionary");
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
                    item.price = res[i].price;
                    item.type = res[i].type;
                    item.effects = res[i].effects;
                    item.ammo = res[i].ammo;//弹药种类 1箭2子弹
                    item.canTier = res[i].canTier;
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

    getPropName:function (t) {
        switch (t){
            case 0:
                return "生命";
            case 1:
                return "生命上限";
            case 2:
                return "攻击";
            case 3:
                return "基础攻击";
            case 4:
                return "防御";
            case 5:
                return "基础防御";
            case 6:
                return "速度";
            case 7:
                return "基础速度";
            case 8:
                return "精力";
            case 9:
                return "食物";
            case 10:
                return "水";
            case 11:
                return "体质";
            case 12:
                return "负重";
            case 13:
                return "负重上限";
            case 14:
                return "逃跑熟练度";
            case 15:
                return "搏斗熟练度";
            case 16:
                return "瞄准熟练度";
            case 20:
                return "自信";
            case 21:
                return "善良";
            case 22:
                return "聪明";
            case 30:
                return "钱";
            case 31:
                return "路途";
            default:
                return "";
        }
    },

    //属性列表
    /*
    * 0 hp
    * 1 hpMax
    * 2 attack
    * 3 basicAtk
    * 4 defence
    * 5 basicDef
    * 6 speed
    * 7 basicSpeed
    * 8 spirit
    * 9 food
    * 10 water
    * 11 constitution
    * 12 weight
    * 13 weightMax
    * 14 escapeProficiency
    * 15 meleeProficiency
    * 16 rangedProficiency
    *
    * 20 confidence自信 自卑，自信，狂妄
    * 21 kindness仁慈 凶残 残忍 淳朴 善良 老好人
    * 22 cleverness聪明 愚蠢 笨拙 聪明 精明
    *
    * 30 money
    * 31 distance
    *
    * */

});
