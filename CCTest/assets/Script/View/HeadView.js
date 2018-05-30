//HeadView展示内容：生命、季节、日期、时间、食物、精神、地点

cc.Class({
    extends: cc.Component,

    properties: {
        lifeLabel:cc.Label,
        foodLabel:cc.Label,
        spiritLabel:cc.Label,
        moneyLabel:cc.Label,
        dateLabel:cc.Label,
        seasonLabel:cc.Label,
        timeLabel:cc.Label,
    },

    UpdateView:function () {
        this.lifeLabel.string = window.Player.hp + "/" + window.Player.hpMax;
        this.lifeLabel.node.color = this.valueColor(window.Player.hp / window.Player.hpMax);

        this.foodLabel.string = window.Player.food;
        this.foodLabel.node.color = this.valueColor(window.Player.food / 100);

        this.spiritLabel.string = player.spirit;
        this.spiritLabel.node.color = this.valueColor(window.Player.spirit / 100);

        this.moneyLabel.string = window.Player.money;
        this.dateLabel.string = window.Player.dayNow;
        this.timeLabel.string = window.Player.hourNow + ":" + window.Player.minuteNow;

        this.seasonLabel.string = this.seasonString(window.Player.seasonNow);
        this.seasonLabel.node.color = this.seasonColor(window.Player.seasonNow);
    },

    seasonString:function (index) {
        switch (index){
            case 0:
                return "春";
            case 1:
                return "夏";
            case 2:
                return "秋";
            case 3:
                return "冬";
            default:
                return "春";
        }
    },

    seasonColor:function (index) {
        switch(index){
            case 0:
                return cc.Color.GREEN;
            case 1:
                return cc.Color.RED;
            case 2:
                return cc.Color.YELLOW;
            case 3:
                return cc.Color.White;
            default:
        }
    },

    valueColor:function (value) {
        if(value<30)
            return cc.Color.RED;
        if(value<60)
            return cc.Color.YELLOW;
        return cc.Color.BLACK;
    }
});
