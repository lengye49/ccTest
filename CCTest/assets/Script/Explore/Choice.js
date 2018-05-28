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
        nameLabel:cc.Label,
        descLabel:cc.Label,

        choice0:cc.Button,
        choice0Text:cc.Label,

        choice1:cc.Button,
        choice1Text:cc.Label,

        choice2:cc.Button,
        choice2Text:cc.Label,

        choice3:cc.Button,
        choice3Text:cc.Label,
    },

    Choice:function () {
        var name = "Hello";
        var desc = "Desc";
        var params = new Array();
        params[0] = "0|不买，走了";//离开的格式 0|文本
        params[1] = "1|奸商，抢他|1001";//抢劫的格式 1|文本|enemyId
        params[2] = "2|买个AK47|100";//购买的格式 2|文本|物品id
        params[3] = "3|卖出1个烟头|100";//卖出的格式 3|文本|物品id
        params[4] = "4|卖出所有烟头|100";//卖出的格式 4|文本|物品id
        //动态需求，根据玩家当前状态向玩家索要东西
        params[5] = "5|给他一个面包|100|1|confidence|5"//赠与物品的格式 5|文本|物品id|数量|奖励的属性、金钱、物品|值
        params[6] = "6|给他点钱|0.2|item,100"//赠与金钱的格式 6|文本|金钱数量|奖励的属性、物品
        params[7] = "7|我也没钱|cruel,2"//拒绝赠与的格式 7|文本|需求的数量|奖励的属性、物品
    },


    updataShow:function (choice) {
        this.presentChoice = choice;

        this.nameLabel.string = choice.name;
        this.descLabel.string = choice.desc;
        this.choice0Text.string = this.getChoiceText(choice.params[0]);

        if (choice.params.length > 1) {
            this.choice1.node.active = true;
            this.choice1Text.string = this.getChoiceText(choice.params[1]);
        } else {
            this.choice1.node.active = false;
        }

        if (choice.params.length > 2) {
            this.choice2Text.string = this.getChoiceText(choice.params[2]);
            this.choice2.node.active = true;
        } else {
            this.choice2.node.active = false;
        }

        if (choice.params.length > 3) {
            this.choice3Text.string = this.getChoiceText(choice.params[3]);
            this.choice3.node.active = true;
        } else {
            this.choice3.node.active = false;
        }
    },

    getChoiceText:function (str) {
        var s = str.split("|");
        var ss = s[1];
        switch(parseInt(s[0])) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                ss += "(" + window.ReadJson.getItem(parseInt(s[2])).price + ")";
                break;
            case 3:
                ss += "(剩余" + window.Player.backpack[parseInt(s[2])] + ")";
                break;
            case 4:
                ss += "(剩余" + window.Player.backpack[parseInt(s[2])] + ")";
                break;
            case 5:
                ss += "(剩余" + window.Player.backpack[parseInt(s[2])] + ")";
                break;
            case 6:
                var v = Math.min(5, Math.ceil(0.1 * window.Player.money));
                ss += "(" + v + "元)";
                break;
            case 7:
                break;
            default:
                break;
        }
        return ss;
    },

    makeChoice:function (index) {
        var s = this.presentChoice.params[index].split("|");
        switch(parseInt(s[0])) {
            case 0:
                window.explore.showSearch(true);
                break;
            case 1:
                var ids = new Array();
                ids[0] = parseInt(s[2]);
                window.Battle.startBattle(ids, this.node, undefined);
                break;
            case 2:
                var itemId = parseInt(s[2]);
                var cost = window.ReadJson.getItem(itemId).price;
                if (!window.Player.isMoneyEnough(cost)) {
                    window.Tip.ShowTip("你的钱不够！");
                    break;
                }
                window.Player.costMoney(cost);
                window.Player.addItem(itemId);
                break;
            case 3:
                var itemId = parseInt(s[2]);
                var price = window.ReadJson.getItem(itemId).price;
                if (!window.Player.isItemEnough(itemId, 1)) {
                    window.Tip.ShowTip("没有了！");
                    break;
                }
                window.Player.removeItem(itemId, 1);
                window.Player.getMoney(price);
                break;
            case 4:
                var itemId = parseInt(s[2]);
                var price = window.ReadJson.getItem(itemId).price;
                if (!window.Player.isItemEnough(itemId, 1)) {
                    window.Tip.ShowTip("没有了！");
                    break;
                }
                window.Player.removeItem(itemId, window.Player.backpack[itemId]);
                window.Player.getMoney(price * window.Player.backpack[itemId]);
                break;
            case 5:
                var itemId = parseInt(s[2]);

                break;
            case 6:
                // var v = Math.min(5, Math.ceil(0.1 * window.Player.money));
                // ss += "(" + v + "元)";
                break;
            case 7:
                break;
            default:
                break;
        }
    },


});
