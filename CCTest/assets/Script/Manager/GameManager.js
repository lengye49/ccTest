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
        tipNode:cc.Node,
        exploreNode:cc.Node,
        battleNode:cc.Node,
        backpackNode:cc.Node,
        restNode:cc.Node,

        isBpOpen:false,
        isRestOpen:false,
        bottomNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        console.log("OnLoadMethod");
        window.Player = this.getComponent('Player');
        window.Player.SetPlayerData("6;90;100;2;80;17;1001|2,1002|3");

        window.Tip = this.tipNode.getComponent('Tip');
        window.Battle = this.battleNode.getComponent('BattleManager');
        // window.Game = this;

        this.explore = this.exploreNode.getComponent('ExploreManager');
        this.backpack = this.backpackNode.getComponent('BackpackManager');
        this.bottomView = this.bottomNode.getComponent('BottomView');
    },

    start () {
        console.log("OnStartMethod");
        this.explore.showSearch(true);
        // window.Tip.ShowTip("测试TIPS");
    },


    //界面操作
    onClickBackpack:function () {
        if (this.isBpOpen) {
            this.closeBackpack();
            this.isBpOpen = false;
            this.bottomView.changeState('backpackClose');
        } else {
            this.openBackpack();
            this.isBpOpen = true;
            this.bottomView.changeState('backpackOpen');
        }
    },

    openBackpack:function () {
        this.moveOut(this.exploreNode);
        this.moveIn(this.backpackNode);
        this.backpack.updateShow();
    },

    closeBackpack:function(){
        this.moveOut(this.backpackNode);
        this.moveIn(this.exploreNode);
    },

    onClickRest:function () {
        if(this.isRestOpen){
            this.closeRest();
            this.isRestOpen=false;
            this.bottomView.changeState('restClose');
        }else{
            this.openRest();
            this.isRestOpen=true;
            this.bottomView.changeState('restOpen');
        }
    },

    openRest:function () {
        this.moveOut(this.exploreNode);
        this.moveIn(this.restNode);
    },

    closeRest:function () {
        this.moveOut(this.restNode);
        this.moveIn(this.exploreNode);
    },

    moveOut:function (target) {
        target.position = new cc.p(-5000,0);
    },

    moveIn:function (target) {
        target.position = new cc.p(0,0);
    }







});
