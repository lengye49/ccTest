
cc.Class({
    extends: cc.Component,

    properties: {
        // background:cc.Node,
        itemName:cc.Label,
        weight:cc.Label,
    },

    start () {

    },

    updateShow:function (item,count,manager) {
        this.Manager = manager;

        // this.background.color = this.bgColor(index);
        if(count>0)
            this.itemName.string = item.name + "×" + count;
        else
            this.itemName.string = item.name;
        this.weight.string = item.weight * count + "kg";
    },

    onClick:function () {
        this.Manager.showItemTips();
    },

    // bgColor:function (index) {
    //     if(index%2===0)
    //         return cc.Color.GRAY;
    //     else
    //         return cc.Color.WHITE;
    // },



});
