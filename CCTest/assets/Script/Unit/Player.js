
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

        //性格属性

    },

    onLoad:function(){
        this.HeadView = this.getComponent('HeadView');

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
        this.backpack = this.explainBackpack(strs[6]);
    },

    //解析背包
    explainBackpack:function(str){
        var bp = this.Dictionary();
        var s = str.split(",");
        var i;
        for(i=0;i<s.length;i++){
            var temp = s[i].split("|");
            bp.set(parseInt(temp[0]),parseInt(temp[1]));
        }
        return bp;
    },



    //添加物品
    addItem:function(itemId,count) {
        if (arguments.length === 1)
            this.backpack.add(itemId, 1);
        else
            this.backpack.add(itemId, count);
    },


    //添加物品
    addItems:function(dic){
        var i;
        //遍历问题
        for(var i in dic){
            this.backpack.add(i,dic[i]);
        }
    },

    //拿走物品
    removeItem:function(itemId,count){
        if(this.backpack[itemId]>count)
            this.backpack[itemId] -= count;
        else
            this.backpack.remove(itemId);
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

    //添加单项奖励
    addReward:function (str) {
        var s = str.split(",");
        switch(s){
            case "cash":
                this.getMoney(parseInt(s[1]));
                break;
            case "item":
                this.addItem(parseInt(s[1]),parseInt(s[2]));
                break;
            case "hp":
                this.Heal(parseInt(s[1]));
                break;
            case "spirit":
                this.RecoverSpirit(parseInt(s[1]));
                break;
            default:
                break;
        }

    },

    //格式item,1000,1;confidence,1;hp,1之类的，用分号隔开
    addRewards:function (str) {
        //拆分
        var strs = new Array();
        if(str.indexOf(";")){
            strs = str.split(";");
        }else{
            strs[0] = str;
        }
        //添加
        var i;
        for(i=0;i<strs.length;i++){
            this.addReward(strs[i]);
        }
    },


    isOverWeight:function () {
        return this.weight > this.weightMax;
    },

    isMoneyEnough:function (value) {
        return this.money >= value;
    },

    isItemEnough:function (itemId,count) {
        if(!this.backpack.has(itemId))
            return false;
        if(this.backpack[itemId]<count)
            return false;
        return true;
    }



    Dictionary:function () {
        var items = {};

        this.has = function(key){
            return key in items;
        };

        this.set = function (key,value) {
            items[key] = value;
        };

        this.add = function (key,value) {
            if(this.has(key)){
                items[key] += value;
            }else{
                this.set(key,value);
            }
            return value;
        };

        this.use = function (key,value) {
            if(this.has(key)){
                if(items[key]>value){
                    items[key] -= vlaue;
                    return true;
                }
                else if(items[key] === value){
                    this.remove(key);
                    return true;
                }
            }
            return false;
        };

        this.count = function (key) {
            if (this.has(key)) {
                return items[key];
            }
            return 0;
        };

        this.remove = function (key) {
            if(this.has(key)){
                delete items[key];
                return true;
            }
            return false;
        };

        this.get = function (key) {
            return this.has(key)?items[key]:undefined;
        };

        this.getItems = function () {
            return items;
        };

        this.size = function () {
            return Object.keys(items).length;
        };

        this.clear = function () {
            items = {};
        };
    }

});
