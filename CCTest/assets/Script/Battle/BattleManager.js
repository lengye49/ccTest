// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var BattleAction = require("BattleActionState");

cc.Class({
    extends: cc.Component,

    properties: {
        weapon1Action:BattleAction,
        weapon2Action:BattleAction,
        dogAction:BattleAction,
        forwardAction:BattleAction,
        backwardAction:BattleAction,
        escapeAction:BattleAction,

        leaveNode:cc.Node,
        enemyName:cc.Label,
        enemyHpProgress:cc.ProgressBar,
        enemyHpLabel:cc.Label,
        distanceLabel:cc.Label,

        distance:100.0,
        rate:0.0,
        heroCD:0.0,
        enemyCD:0.0,
        dogCD:0.0,
        dogState:"准备",

        enemyNoticed:false,

        bottomUi:cc.Node,
    },

    onLoad:function(){
        this.BattleLog = this.node.getChildByName("battleLog").getComponent("BattleLog");
    },


    startBattle:function(enemyIds,lastPanel){
        lastPanel.active = false;
        this.bottomUi.active = false;
        this.leaveNode.active = false;

        this.BattleLog.initLogs();
        this.node.position = cc.p(0,0);

        this.enemyIds = enemyIds;
        this.enemyIndex = 0;
        this.getEnemy();
        this.enemyNoticed = false;

        this.initBattle();
    },

    leaveBattle:function() {
        this.node.position = cc.p(-3000, 0);
        window.explore.showSearch();
        this.bottomUi.active = true;
    },

    initBattle:function () {
        this.initBattleAction();

        this.UpdateEnemyState();
        this.UpdateDistance();

        this.CheckTurn();
    },

    //************************交互UI************************
    initBattleAction:function() {
        var nameStr;

        var weaponId = window.Player.weapon1;
        if (weaponId != 0) {
            this.weapon1 = window.ReadJson.getItem(weaponId);
            nameStr = this.weapon1.name;
            // stateStr = this.weapon1.distance + "米";
        }else{
            nameStr = "拳头";
            // stateStr = "1米";
        }
        this.weapon1Action.initState(nameStr);

        weaponId = window.Player.weapon2;
        if(weaponId != 0){
            this.weapon2 = window.ReadJson.getItem(weaponId);
            nameStr = this.weapon2.name;
            // stateStr = this.weapon2.distance + "米";
        }else{
            nameStr = "拳头";
            // stateStr = "1米";
        }
        this.weapon2Action.initState(nameStr);

        if(window.Player.hasDog){
            nameStr = window.Player.dogName;
        }else{
            nameStr = "无";
        }
        this.dogAction.initState(nameStr);
        this.forwardAction.initState("前跳");
        this.backwardAction.initState("后跃");
        this.escapeAction.initState("逃跑");
    },

    updateBattleAction:function() {
        var isOn = true;
        var stateStr = "";

        if (this.weapon1 != undefined) {
            stateStr = window.Player.weapon1Distance + "米";
            isOn = (this.distance <= window.Player.weapon1Distance);
        } else {
            stateStr = "1米";
            isOn = (this.distance <= 1);
        }
        this.weapon1Action.updateState(stateStr, isOn);

        if (this.weapon2 != undefined) {
            if (window.Player.isItemEnough(this.weapon2.ammo, 1)) {
                stateStr = window.Player.weapon2Distance + "米";
                isOn = (this.distance <= window.Player.weapon2Distance);
            } else {
                stateStr = "缺少弹药";
                isOn = false;
            }
        } else {
            stateStr = "1米";
            isOn = (this.distance <= 1);
        }
        this.weapon2Action.updateState(stateStr, isOn);

        if(window.Player.hasDog && this.dogState === "准备"){
            isOn=true;
        }else
            isOn=false;
        this.dogAction.updateState(this.dogState,isOn);

        stateStr = window.Player.speed * 5 +"米";
        this.forwardAction.updateState(stateStr,true);
        this.backwardAction.updateState(stateStr,true);

        //toDo 计算逃跑概率
        this.escapeAction.updateState("50%",true);
    },

    pauseBattleActions:function(){
        this.weapon1Action.stop();
        this.weapon2Action.stop();
        this.dogAction.stop();
        this.forwardAction.stop();
        this.backwardAction.stop();
        this.escapeAction.stop();
    },

    showLeave(){
        this.pauseBattleActions();
        this.leaveNode.active = true;
    },

    //************************敌人状态显示************************
    UpdateEnemyState:function () {
        this.enemyName.string = this.enemy.name;
        this.enemyHpProgress.progress = this.enemy.hp/this.enemy.hpMax;
        this.enemyHpLabel.string = this.enemy.hp + "/" + this.enemy.hpMax;
    },

    UpdateDistance:function () {
        this.distanceLabel.string = this.distance+"米";
    },


    //************************判断攻击顺序************************
    CheckTurn:function() {
        if (this.dogState === "战斗中") {
            if (this.heroCD <= this.enemyCD && this.heroCD <= this.dogCD) {
                this.PlayerTurn();
            } else if (this.dogCD <= this.heroCD && this.dogCD <= this.enemyCD) {
                this.DogAttack();
            } else
                this.EnemyTurn();
        } else {
            if (this.heroCD <= this.enemyCD)
                this.PlayerTurn();
            else{
                this.EnemyTurn();
                this.enemyNoticed = true;
            }
        }
    },

    //************************敌人行动************************
    EnemyTurn:function () {
        this.pauseBattleActions();

        if(this.enemy.attackDistance>this.distance)
            this.EnemyMoveForward();
        else
            this.EnemyAttack();
    },

    EnemyAttack:function () {
        var p = window.Player.hp/(window.Player.hp+window.Player.dogHp);
        var rnd = Math.random();
        if(rnd<=p){
            this.EnemyAtkHero();
        }else
            this.EnemyAtkDog();
        this.enemyCD += this.enemy.cd;
    },

    EnemyAtkHero:function () {
        this.BattleLog.add("-->" +this.enemy.name + "朝你"+this.enemy.actionName+"。",color.RED);
        if(!this.CalHit(this.enemy.hit))
            this.BattleLog.add("-->"+"但是很幸运，你躲过了。",color.BLACK);
        else
        {
            var dmg = this.CalDamage(this.enemy.attack,window.Player.defence,this.CalCrit(this.enemy.crit));
            window.Player.damage(dmg);
            this.BattleLog.add("-->"+"你受到了"+dmg+"点伤害。",color.RED);
            if(window.Player.hp<=0){
                var rnd = Math.floor(Math.random() * 100);
                if(rnd<this.enemy.cruel){
                    console.log("Player is killed.");
                }else{
                    console.log("Player is wounded!");
                    var money = Math.floor(Math.random() * window.Player.money * 0.3);
                    if(money<=0){
                        this.BattleLog.add("-->你被打成重伤，对方鄙视了你一番，扬长而去。",color.RED);
                    }else{
                        window.Player.costMoney(money);
                        this.BattleLog.add("-->你被打成重伤，还被抢走了"+money+"元钱，真是太背了！",color.RED);
                    }
                    window.Player.CostSpirit(5);
                    this.showLeave();
                }
            }
        }
    },

    EnemyAtkDog:function () {
        this.BattleLog.add("-->" +this.enemy.name + "朝"+window.Player.dogName+this.enemy.actionName+"。",color.RED);
        if(!this.CalHit(this.enemy.hit))
            this.BattleLog.add("-->"+"但是很幸运，"+window.Player.dogName+"躲过了。",color.GREEN);
        else
        {
            var dmg = this.CalDamage(this.enemy.attack,window.Player.dogDef,this.CalCrit(this.enemy.crit));
            window.Player.damageDog(dmg);
            this.BattleLog.add("-->"+window.Player.dogName+"受到了"+dmg+"点伤害。",color.RED);
            if(window.Player.dogHp < window.Player.dogHpMax){
                this.dogState="准备";
                this.BattleLog.add("-->"+window.Player.dogName+"被重伤，躲起来了。",color.RED);
            }
        }
    },

    EnemyMoveForward:function () {
        var d = this.enemy.speed <= this.distance ? this.enemy.speed : this.distance;
        this.BattleLog.add("-->" + this.enemy.name + "向你靠近了" + d + "米。",color.BLACK);
        this.distance -= d;
        this.UpdateDistance();
        this.enemyCD += 1;
    },

    EnemyLoseHp:function(value) {
        var dmg = value > this.enemy.hp ? this.enemy.hp : value;
        this.enemy.hp -= dmg;
        this.BattleLog.add("-->造成"+dmg+"点伤害",color.BLACK);
        this.UpdateEnemyState();
        this.checkGameOver();
    },

    //************************玩家行动************************
    PlayerTurn:function () {
        this.updateBattleAction();
    },

    Weapon1Attack:function () {
        if (!this.CalHit(window.Player.weapon1Hit)) {
            this.BattleLog.add("-->没有打中!",color.BLACK);
            return;
        } else {
            var dmg = this.CalDamage(window.Player.weapon1Atk, this.enemy.defence, this.CalCrit(window.Player.weapon1Crit));
            this.EnemyLoseHp(dmg);
            window.Player.meleeProficiency++;
        }
        this.heroCD += window.Player.weapon1CD;
        this.CheckTurn();
    },

    Weapon2Attack:function () {
        if (!this.CalHit(window.Player.weapon2Hit)) {
            this.BattleLog.add("-->没有打中!",color.BLACK);
            return;
        } else {
            var dmg = this.CalDamage(window.Player.weapon2Atk, this.enemy.defence, this.CalCrit(window.Player.weapon2Crit));
            this.EnemyLoseHp(dmg);
            window.Player.rangedProficiency++;
        }
        this.heroCD += window.Player.weapon2CD;
        this.CheckTurn();
    },

    ReleaseDog:function () {
        this.dogState = "战斗中";
        this.dogCD = 0.0;
    },

    DogAttack:function () {
        this.BattleLog.add("-->"+window.Player.dogName+"向"+this.enemy.name+"咬去，",color.BLACK);
        if (!this.CalHit(window.Player.dogHit)) {
            this.BattleLog.add("-->但被躲开了!",color.BLACK);
            return;
        } else {
            var dmg = this.CalDamage(window.Player.dogAtk, this.enemy.defence, false);
            this.EnemyLoseHp(dmg);
        }
        this.dogCD += window.Player.dogCD;
        this.CheckTurn();
    },


    JumpForward:function () {
        var d = window.Player.speed * 5;
        var d = (d <= this.distance ? d : this.distance);
        this.BattleLog.add("-->你前进了" + d + "米。",color.BLACK);
        this.distance -= d;
        this.UpdateDistance();
        this.heroCD+=1;
        this.CheckTurn();
    },

    JumpBackward:function () {
        var d = window.Player.speed * 5;
        this.BattleLog.add("-->你后退了" + d + "米。",color.BLACK);
        this.distance += d;
        this.UpdateDistance();
        this.heroCD += 1;
        this.CheckTurn();
    },

    EscapeBattle:function () {
        var rnd = Math.floor(Math.random() * 10000);
        var rate = window.Player.speed/(window.Player.speed+this.enemy.speed)*10000;

        //如果没被敌人发现，就增加逃跑几率
        if(!this.enemyNoticed)
            rate += 5000 + rate/2;

        if(rnd<=rate){
            this.showLeave();
            window.Player.escapeProficiency++;
        }
        else{
            this.BattleLog.add("-->你试图逃跑，但是被阻止了！",color.BLACK);
            this.heroCD+=1;
            this.CheckTurn();
        }
    },

    //************************通用计算************************
    CalHit:function (hit) {
        var rnd = Math.random() * 100;
        return rnd < hit;
    },

    CalCrit:function (crit) {
        var rnd = Math.random() * 100;
        return rnd < crit;
    },

    CalDamage:function(att,def,isCrit) {
        var dmg = (att - def) > 0 ? (att - def) : 0;
        if (isCrit)
            dmg *= 2;
        return dmg;
    },

    //************************检测战斗结果************************
    checkGameOver:function () {
        if (this.enemy.hp > 0)
            return;
        this.BattleLog.add("-->你击败" + this.enemy.name + "。");
        var rwd = this.getReward(this.enemy.killReward);
        this.BattleLog.add("-->获得了"+rwd,color.GREEN);
        if (this.enemyIndex < this.enemyIds.length) {
            this.getEnemy();
            this.initBattle();
        }
        else {
            window.Player.RecoverSpirit(3);
            this.showLeave();
        }
    },

    getEnemy:function () {
        this.enemy = window.ReadJson.getNPC(this.enemyIds[this.enemyIndex]);
        this.BattleLog.add("-->你发现了" + this.enemy.name + "。",color.RED);
        this.enemyIndex++;
    },

    getReward:function(str){
        var s = str.split(',');
        var rwdStr = "你获得了";
        for(let i=0;i<s.length;i++){
            var ss = s[i].split('|');
            var itemId = parseInt(ss[0]);
            var num = parseInt(ss[1]);
            window.Player.addItem(itemId,num);
            rwdStr += " " + window.ReadJson.getItem(itemId).name + "×" + num;
        }
        rwdStr += "。";
        return rwdStr;
    },


});
