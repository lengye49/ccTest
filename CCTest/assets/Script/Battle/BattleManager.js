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
var Unit = require("Unit");
cc.Class({
    extends: cc.Component,

    properties: {
        weapon1Action:BattleAction,
        weapon2Action:BattleAction,
        dogAction:BattleAction,
        forwardAction:BattleAction,
        backwardAction:BattleAction,
        escapeAction:BattleAction,

        enemyName:cc.Label,
        enemyHpProgress:cc.ProgressBar,
        enemyHpLabel:cc.Label,
        distanceLabel:cc.Label,

        distance:100.0,
        rate:0.0,
        heroCD:0.0,
        enemyCD:0.0,
        dogState:"准备",

        bottomUi:cc.Node,
    },

    onLoad:function(){
        this.BattleLog = this.node.getChildByName("battleLog").getComponent("BattleLog");
        this.enemy = new Unit();
    },


    startBattle:function(enemyIds,lastPanel,nextPanel){
        lastPanel.active = false;
        this.NextPanel = nextPanel;
        this.bottomUi.active = false;

        this.BattleLog.initLogs();
        this.node.position = cc.p(0,0);

        this.enemyIds = enemyIds;
        this.enemyIndex = 0;
        this.getEnemy();

        this.initBattle();
    },

    leaveBattle:function() {
        this.node.position = cc.p(-3000, 0);
        if (this.NextPanel === undefined)
            window.explore.showSearch();
        else {
            this.NextPanel.active = true;
            this.NextPanel.position = cc.p(0, 0);
        }
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
            stateStr = this.weapon1.distance + "米";
            isOn = (this.distance <= this.weapon1.distance);
        } else {
            stateStr = "1米";
            isOn = (this.distance <= 1);
        }
        this.weapon1Action.updateState(stateStr, isOn);

        if (this.weapon2 != undefined) {
            if (window.Player.isItemEnough(this.weapon2.ammo, 1)) {
                stateStr = this.weapon2.distance + "米";
                isOn = (this.distance <= this.weapon1.distance);
            } else {
                stateStr = "缺少弹药";
                isOn = false;
            }
        } else {
            stateStr = "1米";
            isOn = (this.distance <= 1);
        }
        this.weapon2Action.updateState(stateStr, isOn);

        if(window.Player.hasDog || this.dogState === "准备"){
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
    CheckTurn:function(){
        if(this.heroCD <= this.enemyCD)
            this.PlayerTurn();
        else
            this.EnemyTurn();
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
        this.BattleLog.add("-->" +this.enemy.name + "朝你"+this.enemy.actionName+"。");
        if(!this.CalHit(this.enemy.hit))
            this.BattleLog.add("-->"+"但是很幸运，你躲过了。");
        else
        {
            var dmg = this.CalDamage(this.enemy.attack,window.Player.defence,this.CalCrit(this.enemy.crit));
            window.Player.damage(dmg);
        }
        this.enemyCD += this.enemy.cd;
    },

    EnemyMoveForward:function () {
        var d = this.enemy.speed <= this.distance ? this.enemy.speed : this.distance;
        this.BattleLog.add("-->" + this.enemy.name + "向你靠近了" + d + "米。");
        this.distance -= d;
        this.UpdateDistance();
        this.enemyCD += 1;
    },

    EnemyLoseHp:function(value) {
        var dmg = value > this.enemy.hp ? this.enemy.hp : value;
        this.enemy.hp -= dmg;
        this.UpdateEnemyState();
        this.checkGameOver();
    },

    //************************玩家行动************************
    PlayerTurn:function () {
        this.updateBattleAction();
    },

    Weapon1Attack:function () {
        if(!this.CalHit()){
            this.BattleLog.add("没有打中!");
            return;
        }

        //需要加上武器的攻击
        var dmg = this.CalDamage(window.Player.attack,this.enemy.defence,this.CalCrit());
        this.EnemyLoseHp(dmg);
        this.heroCD+=1;

        window.Player.meleeProficiency++;
    },

    Weapon2Attack:function () {
        if(!this.CalHit()){
            this.BattleLog.add("没有打中!");
            return;
        }

        var dmg = this.CalDamage(window.Player.attack,this.enemy.defence,this.CalCrit());
        this.EnemyLoseHp(dmg);
        this.heroCD+=1;
        window.Player.rangedProficiency++;
    },

    Weapon3Attack:function () {
        if(!this.CalHit()){
            this.BattleLog.add("没有打中!");
            return;
        }

        var dmg = this.CalDamage(window.Player.attack,this.enemy.defence,this.CalCrit());
        this.EnemyLoseHp(dmg);
        this.heroCD+=1;
    },


    JumpForward:function () {
        var d = window.Player.speed <= this.distance ? window.Player.speed : this.distance;
        this.BattleLog.add("-->你前进了" + d + "米。");
        this.distance -= d;
        this.UpdateDistance();
        this.heroCD+=1;
    },

    JumpBackward:function () {
        var d = window.Player.speed;
        this.BattleLog.add("-->你后退了"+d+"米。");
        this.distance += d;
        this.UpdateDistance();
        this.heroCD+=1;
    },

    EscapeBattle:function () {
        var rnd = Math.floor(Math.random() * 10000);
        var rate = window.Player.speed/(window.Player.speed+this.enemy.speed)*10000;
        if(rnd<=rate){
            console.log("打不过就跑，并不丢人。");
            player.escapeProficiency++;
        }
        else
            console.log("你试图逃跑，但没成功。");

        this.heroCD+=1;
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
        this.BattleLog.add("-->你击败了" + this.enemy.name + "。");
        if (this.enemyIndex < this.enemyIds.length) {
            this.getEnemy();
            this.initBattle();
        }
        else {
            this.leaveBattle();
        }
    },

    getEnemy:function (index) {
        this.enemy = window.ReadJson.getNPC(this.enemyIds[this.enemyIndex]);
        this.BattleLog.add("-->你发现了" + this.enemy.name + "。");
        this.enemyIndex++;
    }


});
