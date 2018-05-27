
cc.Class({
    extends: cc.Component,

    properties: {
        moveButton:cc.Button,
        searchButton:cc.Buttoon,
    },

    start:function(){
        require("Dictionary");
    },

    updateShow:function (isShowMove) {
        if(isShowMove)
            this.moveButton.node.active = true;
        else
            this.moveButton.node.active = false;
    },

    //赶路
    moveForward:function () {
        //检测负重
        if(window.Player.isOverWeight()){
            window.Tip.ShowTip("现在背包超重，请清理背包后再前进！");
            return;
        }

        window.Player.addMinutes(60);

        //检测是否遇到怪物
        if (false) {
            window.Battle.startBattle(0,this.node,this.node);
        } else {
            var dis = window.Player.speed * 3600 ;
            window.Player.addDistance(dis);

            var msg = "你前进了" + dis + "米,并获得了...";
            msg += this.getReward(2);
            window.explore.showNormalNotice(msg);
        }
    },

    //搜索
    searchAround:function () {
        //检测负重
        if(window.Player.isOverWeight()){
            window.Tip.ShowTip("现在背包超重，请清理背包后再探索！");
            return;
        }

        window.Player.addMinutes(60);
        if (false) {
            window.Battle.startBattle(0, this.node, this.node);
        } else {
            var dis = window.Player.speed * 3600/4;
            window.Player.addDistance(dis);

            var msg = "你四周寻找了一圈，找到了...";
            msg += this.getReward(5);
            window.explore.showNormalNotice(msg);
        }
    },


    getReward:function (count) {
        console.log("获得奖励代码。");
        var num = (int)(Math.random()*(count+1));
        var i;
        var rewards = new this.Dictionary();
        for(i=0;i<num;i++){
            var item = window.Game.getReward("1000|100,1001|200,1002|1");
            rewards.add(item,1);
        }
        return rewards.getItems();
    },

});
