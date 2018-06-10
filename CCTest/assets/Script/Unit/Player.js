
cc.Class({
    extends: cc.Component,

    properties: {
        //战斗属性：
        hp: 100,
        hpMax: 100,
        attack: 10,
        defence: 0,
        speed: 0.0,
        basicSpeed: 1.0,
        hit:0,
        crit:0,
        cd:0.0,

        weapon1Atk:100,
        weapon2Atk:500,
        weapon1Hit:80,
        weapon2Hit:50,
        weapon1Crit:60,
        weapon2Crit:50,
        weapon1CD:0.1,
        weapon2CD:0.2,
        weapon1Distance:1.0,
        weapon2Distance:10.0,


        //精力：影响探索,精力、食物和水的上限都是100
        spirit: 100,
        food: 100,
        water: 100,

        //体质：影响生命上限、精力上限
        constitution: 10,

        //熟练度
        escapeProficiency: 0,
        meleeProficiency: 0,
        rangedProficiency: 0,

        //负重，超重会影响速度
        weight: 0,
        weightMax: 100,

        //金钱
        money: 0,

        //时间
        seasonNow: 0,
        dayNow: 1,
        hourNow: 0,
        minuteNow: 0,
        minutesPassed: 0,

        //装备
        weapon1: 0,
        weapon2: 0,
        armor: 0,
        shoes: 0,

        //行走距离
        distance: 0,

        //性格属性
        confidence: 0,
        kindness: 0,
        cleverness: 0,

        //狗属性
        hasDog:false,
        dogName:"大黄",
        dogHp: 0,
        dogHpMax: 0,
        dogAtk: 0,
        dogDef: 0,
        dogHit:50,
        dogCD:5,
        dogFood: 0,
        dogWater: 0,
        dogConstitution: 0,
        dogType:0,
        dogRetrieve:0,
        dogAlert:0,
    },

    onLoad:function(){
        this.HeadView = this.getComponent('HeadView');

    },

    //需要提供的角色数据：hp,constitution,spirit,food,water,weapon1,weapon2,armor,shoes,confidence,kindness,cleverness,weight
    //需要提供的宠物数据：hasDog,dogName,
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
        var bp = new this.Dictionary();
        var s = str.split(",");
        var i;
        for(i=0;i<s.length;i++){
            var temp = s[i].split("|");
            bp.set(parseInt(temp[0]),parseInt(temp[1]));
        }
        return bp;
    },

//*************************************更新基础属性************************************
    initProperties:function () {
        this.hpMax = 50+this.constitution * 2;
        this.attack =  this.constitution;
        this.defence = 0;
        this.weightMax = 10 + Math.floor(this.constitution/5);
        this.readWeapon1();
        this.readWeapon2();
        this.readArmor();
        this.readShoes();
    },

    readWeapon1:function(){
        if(this.weapon1>0){
            var effects = window.ReadJson.getItem(this.weapon1).effects;
            var s = effects.split(";");
            for(let i=0;i<s.length;i++){
                var ss = s[i].split("|");
                if(i===0)
                    this.weapon1Atk = this.attack + parseInt(ss[1]);
                else if(i===1)
                    this.weapon1Hit = parseInt(ss[1]) * (1+this.meleeProficiency/100);
                else if(i===2)
                    this.weapon1Crit = parseInt(ss[1]) * (1+this.meleeProficiency/100);
                else if(i===3)
                    this.weapon1CD = parseFloat(ss[1])/(1+this.meleeProficiency/100);
                else if(i===4)
                    this.weapon1Distance = parseFloat(ss[1]);
            }
        }else{
            this.weapon1Atk = this.attack;
            this.weapon1Hit = 80 * (1+this.meleeProficiency/100);
            this.weapon1Crit = 10 * (1+this.meleeProficiency/100);
            this.weapon1CD = 1.0/(1+this.meleeProficiency/100);
            this.weapon1Distance = 0.5;
        }
    },

    //枪械不受体质加成
    readWeapon2:function() {
        if (this.weapon2 > 0) {
            var equip = window.ReadJson.getItem(this.weapon2);
            var effects = equip.effects;
            var s = effects.split(";");
            for (let i = 0; i < s.length; i++) {
                var ss = s[i].split("|");
                if (i === 0) {
                    if (equip.type === 6)
                        this.weapon2Atk = this.attack + parseInt(ss[1]);
                    else
                        this.weapon2Atk = parseInt(ss[1]);
                }
                else if (i === 1)
                    this.weapon2Hit = parseInt(ss[1]) * (1 + this.rangedProficiency / 100);
                else if (i === 2)
                    this.weapon2Crit = parseInt(ss[1]) * (1 + this.rangedProficiency / 100);
                else if (i === 3)
                    this.weapon2CD = parseFloat(ss[1]) / (1 + this.rangedProficiency / 100);
                else if (i === 4)
                    this.weapon2Distance = parseFloat(ss[1]);
            }
        } else {
            this.weapon2Atk = this.attack;
            this.weapon2Hit = 80 * (1 + this.meleeProficiency / 100);
            this.weapon2Crit = 10 * (1 + this.meleeProficiency / 100);
            this.weapon2CD = 1.0 / (1 + this.meleeProficiency / 100);
            this.weapon2Distance = 0.5;
        }
    },

    readArmor:function(){
        if(this.armor>0){
            var effects = window.ReadJson.getItem(this.armor).effects;
            var ss= effects.split("|");
            this.armor = parseInt(ss[1]);
        }else {
            this.armor = 0;
        }
    },

    readShoes:function(){
        this.speed =this.basicSpeed + this.constitution*0.02
        if(this.shoes>0){
            var effects = window.ReadJson.getItem(this.shoes).effects;
            var ss= effects.split("|");
            this.speed *= (1 + parseInt(ss[1])/100);
        }
    },

    putOnEquip:function (equipId) {
        var equip = window.ReadJson.getItem(equipId);
        switch (equip.type){
            case 0:
                if(this.weapon1 != 0)
                    this.takeOffEquip(this.weapon1);
                this.weapon1 = equip.id;
                this.backpack.removeItem(equip.id,1);
                break;
            case 1:
                if(this.armor!=0)
                    this.takeOffEquip(this.armor);
                this.armor = equip.id;
                this.backpack.removeItem(equip.id,1);
                break;
            case 2:
                if(this.shoes!=0)
                    this.takeOffEquip(this.shoes);
                this.shoes = equip.id;
                this.backpack.removeItem(equip.id,1);
                break;
            case 6:
            case 7:
                if(this.weapon2!=0)
                    this.takeOffEquip(this.weapon2);
                this.weapon2 = equip.id;
                this.backpack.removeItem(equip.id,1);
                break;
            default:
                window.Tip.ShowTip("该物品不可装备！");
                break;
        }
    },

    takeOffEquip:function (equipId) {
        var equip = window.ReadJson.getItem(equipId);
        switch (equip.type) {
            case 0:
                if (this.weapon1 != equipId) {
                    window.Tip.ShowTip("数据错误，请重试！");
                    return;
                } else{
                    this.weapon1 = 0;
                    this.addItem(equipId,1);
                }
                break;
            case 1:
                if (this.armor != equipId) {
                    window.Tip.ShowTip("数据错误，请重试！");
                    return;
                } else{
                    this.armor = 0;
                    this.addItem(equipId,1);
                }
                break;
            case 2:
                if (this.shoes != equipId) {
                    window.Tip.ShowTip("数据错误，请重试！");
                    return;
                } else{
                    this.shoes = 0;
                    this.addItem(equipId,1);
                }
                break;
            case 6:
            case 7:
                if (this.weapon2 != equipId) {
                    window.Tip.ShowTip("数据错误，请重试！");
                    return;
                } else{
                    this.weapon2 = 0;
                    this.addItem(equipId,1);
                }
                break;
            default:
                window.Tip.ShowTip("数据错误，请重试！");
                break;
        }
    },

 //*************************************更新属性************************************

    //格式 类型1|值1;类型2|值2
    changeProperties:function (str,isFeedDog) {
        var s = str.split(";");
        for (let i = 0; i < s.length; i++) {
            var ss = s[i].split("|");
            if (isFeedDog) {
                this.changeDogProperty(parseInt(ss[0]), parseInt(ss[1]));
            } else {
                this.changeProperty(parseInt(ss[0]), parseInt(ss[1]));
            }
        }
    },

    changeProperty:function (t,v) {
        switch (t) {
            case 0:
                this.heal(v);
                break;
            case 2:
                this.attack += v;
                break;
            case 4:
                this.defence += v;
                break;
            case 6:
                this.speed += v;
                break;
            case 8:
                this.RecoverSpirit(v);
                break;
            case 9:
                this.addFood(v);
                break;
            case 10:
                this.addWater(v);
                break;
            case 11:
                this.constitution += v;
                break;
            case 12:
                this.weight += v;
                break;
            case 13:
                this.weightMax += v;
                break;
            case 14:
                this.escapeProficiency += v;
                break;
            case 15:
                this.meleeProficiency += v;
                break;
            case 16:
                this.rangedProficiency += v;
                break;
            case 20:
                this.confidence += v;
                break;
            case 21:
                this.kindness += v;
                break;
            case 22:
                this.cleverness += v;
                break;
            case 30:
                this.money += v;
                break;
            case 31:
                this.distance +=v;
                break;
            default:
                console.log("错误的属性id = " + v);
                break;
        }
    },

    changeDogProperty:function (t,v) {
        switch (t){
            case 0:
                this.healDog(v);
                break;
            case 9:
                this.addDogFood(v);
                break;
            case 10:
                this.addDogWater(v);
                break;
            default:
                console.log("不可使用的狗属性 = " + v);
                break;
        }
    },

    //恢复生命
    heal:function (value) {
        var healValue = (value > this.hpMax - this.hp) ? (this.hpMax - this.hp) : (value);
        this.hp += healValue;
        this.HeadView.UpdateView();
    },

    healDog:function (value) {
        var healValue = (value > this.dogHpMax - this.dogHp) ? (this.dogHpMax - this.dogHp) : (value);
        this.dogHp += healValue;
        this.HeadView.UpdateView();
    },

    //受到伤害
    damage:function (value) {
        var damageValue = value>this.hp?this.hp:value;
        this.hp-=damageValue;
        this.HeadView.UpdateView();

        //被打死
        if(this.hp<=0)
            console.log("被打死！");
    },

    damageDog:function (value) {
        var damageValue = value>this.dogHp?this.dogHp:value;
        this.dogHp-=damageValue;
        this.HeadView.UpdateView();

        //被打死
        if(this.dogHp<=0)
            console.log("狗被打死了！");
    },

    //吃食物
    addFood:function (value) {
        var eatValue = (value > 100 - this.food) ? (100 - this.food) : value;
        this.food += eatValue;
        this.HeadView.UpdateView();
    },

    addDogFood:function () {
        var eatValue = (value > 100 - this.dogFood) ? (100 - this.dogFood) : value;
        this.dogFood += eatValue;
        this.HeadView.UpdateView();
    },

    //喝水
    addWater:function(value){
        var drinkValue = (value > 100 - this.water) ? (100 - this.water) : value;
        this.water += drinkValue;
        this.HeadView.UpdateView();
    },

    addDogWater:function (value) {
        var drinkValue = (value > 100 - this.dogWater) ? (100 - this.dogWater) : value;
        this.dogWater += drinkValue;
        this.HeadView.UpdateView();
    },

    //时间消耗食物和水,每小时1点
    ConsumeFoodAndWater:function (value) {
        var v = this.food>value?value:this.food;
        this.food -= v;

        v = this.water>value?value:this.water;
        this.water-=v;

        this.HeadView.UpdateView();

        if(this.food<=0)
            console.log("饿死！");

        if(this.water<=0)
            console.log("渴死！");
    },

    Sleep:function(value){

        this.addMinutes(value*60);
        //toDo 这里要根据升级的水平来提高回复量
        this.RecoverSpirit(value);
        this.HeadView.UpdateView();
    },

    RecoverSpirit:function (value) {
        var v = (100-this.spirit>value)?value:(100-this.spirit);
        this.spirit += v;
    },

 //*************************************获得奖励************************************

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
                this.heal(parseInt(s[1]));
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


 //*************************************更新资源************************************
    //添加物品
    addItem:function(itemId,count) {
        if (arguments.length === 1)
            this.backpack.add(itemId, 1);
        else
            this.backpack.add(itemId, count);
    },

    //添加物品
    addItems:function(dic){
        //遍历问题
        for(var i in dic){
            this.backpack.add(i,dic[i]);
        }
    },

    //删除物品
    removeItem:function(itemId,count){
        if(this.backpack[itemId]>count)
            this.backpack[itemId] -= count;
        else
            this.removeAllItems(itemId);
    },

    //删除所有物品
    removeAllItems:function (itemId) {
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

        this.HeadView.UpdateView();
    },


//*************************************判断资源数量************************************

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
    },

    maxActionTime:function(){
        return Math.min(this.food-1,this.water-1);
    },

    updateWeight:function (value) {
        this.weight = value;
        this.HeadView.UpdateView();
    },

//*************************************定义字典************************************
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
    },

    //toDo getDog, DogDie
    dogDie:function () {

    },

});
