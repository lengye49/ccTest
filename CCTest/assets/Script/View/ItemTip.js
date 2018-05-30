// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        itemName:cc.Label,
        effect:cc.Label,
        desc:cc.Label,
        itemType:cc.Label,
        weight:cc.Label,
    },

    start () {

    },

    updateShow:function (item,count) {
        if(count>0)
            this.itemName.string = item.name + "×" + count;
        else
            this.itemName.string = item.name;
        this.effect.string = this.itemEffectString(item.effects);
        this.desc.string = item.desc;
        this.itemType.string = this.itemTypeString(item.type);
        this.weight.string = item.weight * count + "kg";
    },

    itemEffectString:function (str) {
        return "防御+5(需要子弹)";
    },

    itemTypeString:function (t) {
        switch(t){
            case 0:
                return "武器";
            case 1:
                return "衣服";
            case 2:
                return "鞋子";
            case 3:
                return "药品";
            case 4:
                return "食物";
            case 5:
                return "消耗品";
            case 6:
                return "弓箭";
            case 7:
                return "枪械";
            default:
                return "杂物";
        }
    },

});
