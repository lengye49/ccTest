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
        window.Game = this;

        this.backpack = this.backpackNode.getComponent('BackpackManager');
        this.rest = this.restNode.getComponent('RestManager');
        this.bottomView = this.bottomNode.getComponent('BottomView');
    },

    start () {
        console.log("OnStartMethod");
        // window.explore.showSearch(true);
        // window.Tip.ShowTip("测试TIPS");
        // window.explore.showNormalNotice("你是我的超级英雄");
        var str = new Array();
        str[0] = "你是我的超级英雄";
        str[1] = "你不是我的超级英雄";
        str[3] = "你是我的超级英雄";
        str[4] = "你不是我的超级英雄";
        str[5] = "你是我的超级英雄";
        str[6] = "你不是我的超级英雄";
        str[7] = "你是我的超级英雄";
        str[8] = "你不是我的超级英雄";
        str[9] = "你是我的超级英雄";
        str[10] = "你不是我的超级英雄";
        window.explore.showScreenNotice(str);
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
        this.rest.updateShow();
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
    },

    getReward:function (str) {
        var s = str.split(",");
        var items = new Array();
        var weight = new Array();
        var i;
        for(i=0;i<s.length;i++){
            var ss = s.split("|");
            items[i] = parseInt(ss[0]);
            weight[i] = parseInt(ss[1]);
        }
        i = this.getRewardIndex(weight);
        return items[i];
    },

    getRewardIndex:function(weights){
        var total = 0;
        var i;
        for(i=0;i<weights.length;i++)
            total+= weights[i];
        var r = Math.random()*total;
        total=0;
        for(i=0;i<weights.length;i++)
        {
            total+=weights[i];
            if(total>=r)
                return i;
        }
        return 0;
    },







});
