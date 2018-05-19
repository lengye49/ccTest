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
        moveButton:cc.Button,
        searchButton:cc.Button,
    },

    updateShow:function (isShowMove) {
        if(isShowMove)
            this.moveButton.node.active = true;
        else
            this.moveButton.node.active = false;
    },

    //赶路界面
    moveForward:function () {
        window.Player.addMinutes(60);

        //检测是否遇到怪物
        if (true) {
            window.Battle.startBattle(0,this.node,this.node);
        } else {
            var dis = window.Player.speed * 3600 / 2;
            this.getReward();
            console.log("你前进了" + dis + "米,并获得了...");
        }

    },

    searchAround:function () {
        window.Player.addMinutes(60);

        if (true) {
            window.Battle.startBattle(0, this.node, this.node);
        } else {
            this.getReward();
            console.log("你四周寻找了一圈，找到了{...");
        }
    },

    getReward:function () {
        console.log("获得奖励代码。");
    },

});
