
cc.Class({
    extends: cc.Component,

    properties: {
        cell:cc.Prefab,
        itemTip:cc.Node,
    },


    start () {

    },

    //默认使用的是第一个
    updateShow:function () {

    },

    showItemTips:function () {
        this.itemTip.active = true;
        this.itemTip.node.position = cc.p(0,0);
    },

    closeItemTips:function () {
        this.itemTip.active = false;
    }
});
