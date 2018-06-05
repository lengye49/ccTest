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
        barbecueBtn:cc.Button,
        fabricateBtn:cc.Button,

        restTimeLabel:cc.Label,
        woodPile1Label:cc.Label,
        woodPile2Label:cc.Label,
        meatLabel:cc.Label,
        ironLabel:cc.Label,

        restTime:8,
        barbecueCount:1,
        fabricateCount:1,
    },

    updateShow:function () {
        this.updateRest();
        this.updateBarbecue();
        this.updateFabricate();
    },

    updateRest:function () {
        this.restTimeLabel.string = this.restTime + "小时";
    },

    //木条id 1001，肉id 1002
    updateBarbecue:function () {
        var woodCount = window.Player.backpack[1001];
        var meatCount = window.Player.backpack[1002];
        var canDo = (woodCount>0 && meatCount>0);
        this.woodPile1Label.string = "木条×1/" + woodCount;
        this.meatLabel.string = "生肉×1/" + meatCount;


        this.woodPile1Label.node.color = canDo? color.GREEN : color.RED;
        this.meatLabel.node.color = canDo? color.GREEN : color.RED;
        this.barbecueBtn.interactive = canDo;
    },

    //木条id 1001，铁片id 1002
    updateFabricate:function () {
        var woodCount = window.Player.backpack[1001];
        var ironCount = window.Player.backpack[1002];
        var canDo = (woodCount>0 && ironCount>0);
        this.woodPile2Label.string = "木条×1/" + woodCount;
        this.ironLabel.string = "铁片×1/" + ironCount;


        this.woodPile2Label.node.color = canDo? color.GREEN : color.RED;
        this.ironLabel.node.color = canDo? color.GREEN : color.RED;
        this.fabricateBtn.interactive = canDo;
    },

    rest:function () {

    },

    addRestTime:function () {

    },

    refuceRestTime:function () {

    },

    barbecue:function () {

    },

    addBarbecueTime:function () {

    },

    refuceBarbecueTime:function () {

    },

    fabricate:function () {

    },

    addFabricateTime:function () {

    },

    refuceFabricateTime:function () {

    },

});
