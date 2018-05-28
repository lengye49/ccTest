
cc.Class({
    extends: cc.Component,

    properties: {
        //战斗属性：
        hp : 100,
        hpMax : 100,
        attack:10,
        defence:0,
        speed:0,

        //熟练度
        escapeProficiency:0,
        meleeProficiency:0,
        rangedProficiency:0,
        //速度：
        speed:2.0,
        //精力：影响探索
        spirit : 100,
        food : 100,
        water : 100,
        //体质：影响生命上限、精力上限
        constitution:30,
        //负重，会影响速度
        weightMax:100,
        weight:0,
        //金钱
        money:0,
        //时间
        seasonNow:0,
        dayNow:1,
        hourNow:0,
        minuteNow:0,
        minutesPassed:0,
        //装备
        weapon1 : 0,
        weapon2 : 0,
        armor : 0,
        shoes : 0,
        //离家距离
        distance : 0,
        //背包

    },

    onLoad:function(){
        this.HeadView = this.getComponent('HeadView');
        require("Dictionary");
    },

    //根据数据重新配置
    SetPlayerData :function(str) {
        var strs = str.split(";");
        this.day = parseInt(strs[0]);
        this.hp = parseInt(strs[1]);
        this.hpMax = parseInt(strs[2]);
        this.basicAttack = parseInt(strs[3]);
        this.spirit = parseInt(strs[4]);
        this.money = parseInt(strs[5]);
        // this.backpack = this.explainBackpack(strs[6]);
    },

    //添加物品
    addItem:function(itemId){
        this.backpack.add(itemId,1);
    },

    //添加物品
    addItems:function(dic){
        var i;
        //遍历问题
        for(var i in dic){
            this.backpack.add(i,dic[i]);
        }
    },

    //获得金钱
    getMoney:function (value) {
        this.money += value;
    },

    //花钱
    costMoney:function (value) {
        this.money -= value;
        this.money = Math.max(0,this.money);
    },

    //解析背包
    explainBackpack:function(str){
        var bp = new this.Dictionary();
        var strs = str.split(",");
        var i;
        for(i=0;i<strs.length;i++){
            var temp = strs[i].split("|");
            bp.set(parseInt(temp[0]),parseInt(temp[1]));
        }
        return bp;
    },

    //增加里程
    addDistance:function(value){
        this.distance += value;
    },

    //增加时间
    addMinutes:function (min) {
        this.minutesPassed += min;
        this.updateTime();
    },

    updateTime:function () {
        var min = this.minutesPassed;
        var monthNow = parseInt(min/43200);

        var lastSeason = this.seasonNow;
        this.seasonNow = (monthNow % 12) / 3;
        if(this.seasonNow>lastSeason)
            console.log("SeasonChanged!");

        var lastDay = this.dayNow;
        this.dayNow = min / 1440;
        if(this.dayNow>lastDay)
            console.log("DayChanged!");

        min -= this.dayNow * 1440;
        var lastHour = this.hourNow;
        this.hourNow = min / 60;
        if(this.hourNow!=lastHour) {
            console.log("HourChanged!")
            var hours = (this.hourNow>lastHour)?(this.hourNow-lastHour):(this.hourNow+24-lastHour);
            this.ConsumeFoodAndWater(hours);
        }

        this.minuteNow = min % 60;

        this.HeadView.UpdateView(this);
    },



    //恢复生命
    Heal:function (value) {
        var healValue = (value > this.hpMax - this.hp) ? (this.hpMax - this.hp) : (value);
        this.hp += healValue;
        this.HeadView.UpdateView(this);
    },

    //受到伤害
    Damage:function (value) {
        var damageValue = value>this.hp?this.hp:value;
        this.hp-=damageValue;
        this.HeadView.UpdateView(this);

        //被打死
        if(this.hp<=0)
            console.log("被打死！");
    },

    //吃食物
    Eat:function (value) {
        var eatValue = (value > 100 - this.food) ? (100 - this.food) : value;
        this.food += eatValue;
        this.HeadView.UpdateView(this);
    },

    //喝水
    Drink:function(value){
        var drinkValue = (value > 100 - this.water) ? (100 - this.water) : value;
        this.water += drinkValue;
        this.HeadView.UpdateView(this);
    },

    //时间消耗食物和水,每小时1点
    ConsumeFoodAndWater:function (value) {
        var v = this.food>value?value:this.food;
        this.food -= v;

        v = this.water>value?value:this.water;
        this.water-=v;

        this.HeadView.UpdateView(this);

        if(this.food<=0)
            console.log("饿死！");

        if(this.water<=0)
            console.log("渴死！");
    },

    Sleep:function(value){

        this.addMinutes(value*60);

        this.ConsumeFoodAndWater(value);
        this.RecoverSpirit(value);
        this.HeadView.UpdateView(this);
    },

    RecoverSpirit:function (value) {
        var v = (100-this.spirit>value)?value:(100-this.spirit);
        this.spirit += v;
    },

    isOverWeight:function () {
        return this.weight > this.weightMax;
    },

    isMoneyEnough:function (value) {
        return this.money >= value;
    }

});
