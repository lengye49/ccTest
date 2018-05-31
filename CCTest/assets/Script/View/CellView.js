
cc.Class({
    extends: cc.Component,

    properties: {
        // background:cc.Node,
        itemName:cc.Label,
        weight:cc.Label,
    },

    start () {

    },

    updateShow:function (itemId,count,manager) {
        this.item = window.ReadJson.getItem(itemId);
        this.Manager = manager;

        // this.background.color = this.bgColor(index);
        if(count>0)
            this.itemName.string = this.item.name + "×" + count;
        else
            this.itemName.string = this.item.name;
        this.weight.string = this.item.weight * count + "kg";
    },

    onClick:function () {
        this.Manager.showItemTips(this.item,false);
    },

    // bgColor:function (index) {
    //     if(index%2===0)
    //         return cc.Color.GRAY;
    //     else
    //         return cc.Color.WHITE;
    // },



});
