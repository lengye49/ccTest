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
        background:cc.Node,
        itemName:cc.Label,
        effect:cc.Label,
        desc:cc.Label,
        itemType:cc.Label,
        weight:cc.Label,
        state:cc.Label,
    },

    start () {

    },

    updateShow:function (item,count,state,index,manager) {
        this.Manager = manager;

        this.background.color = this.bgColor(index);
        this.itemName.string = item.name;
        this.effect.string = this.itemEffectString(item.effects);
        this.desc.string = item.desc;
        this.itemType.string = this.itemTypeString(item.type);
        this.weight.string = item.weight + "kg";
    },

    onClick:function () {

    },

    bgColor:function (index) {
        if(index%2===0)
            return cc.Color.GRAY;
        else
            return cc.Color.WHITE;
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
            default:
                return "杂物";
        }
    }

});
