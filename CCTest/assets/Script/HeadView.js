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

    UpdateView:function (player) {
        this.lifeLabel.string = player.hp + "/" + player.hpMax;
        this.foodLabel.string = player.food;
        this.spiritLabel.string = player.spirit;
        this.moneyLabel.string = player.money;
        this.dateLabel.string = player.dayNow;
        this.timeLabel.string = player.hourNow + ":" + player.minuteNow;
        this.seasonLabel.string = SeasonString(player.seasonNow);
        this.seasonLabel.color = SeasonColor(player.seasonNow);
    },

    SeasonString:function (index) {
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

    SeasonColor:function (index) {
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
    }
});
