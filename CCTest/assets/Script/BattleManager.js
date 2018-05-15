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
        weapon1Distance:cc.Label,
        weapon2Distance:cc.Label,
        weapon3Distance:cc.Label,
        forwardDistance:cc.Label,
        backwardDistance:cc.Label,
        escapeRate:cc.Label,

        weapon1Action:cc.Button,
        weapon2Action:cc.Button,
        weapon3Action:cc.Button,
        jumpForward:cc.Button,
        jumpBackward:cc.Button,
        escapeBattle:cc.Button,

        enemyName:cc.Label,
        enemyHpProgress:cc.ProgressBar,
        enemyHpLabel:cc.Label,

        distanceLabel:cc.Label,

        distance:100,
        rate:0.0,
        heroCD:0.0,
        enemyCD:0.0,
        // battleLog:cc.BattleLog,
    },

    start:function () {
        this.player = this.node.getParent().getComponent("Player");

        var Unit = require("Unit");
        this.enemy = new Unit();

        this.InitBattle(this.enemy);

        this.BattleLog = this.node.getChildByName("battleLog").getComponent("BattleLog");
    },
    
    InitBattle:function () {
        this.UpdateActionLabel();
        this.UpdateEnemyState();
        this.UpdateDistance();
        this.CheckTurn();
    },

    //处理场景元素
    UpdateActionState:function (IsOn) {
        this.weapon1Action.interactable = IsOn;
        this.weapon2Action.interactable = IsOn;
        this.weapon3Action.interactable = IsOn;
        this.jumpForward.interactable = IsOn;
        this.jumpBackward.interactable = IsOn;
        this.escapeBattle.interactable = IsOn;
    },

    UpdateActionLabel:function(){
        this.weapon1Distance.string = "0";
        this.weapon2Distance.string = "0";
        this.weapon3Distance.string = "0";
        this.forwardDistance.string = "0";
        this.backwardDistance.string = "0";
        this.escapeRate.string = "0";
    },

    UpdateEnemyState:function () {
        this.enemyName.string = this.enemy.Name;
        this.enemyHpProgress.progress = 1.0;
        this.enemyHpLabel.string = this.enemy.hp + "/" + this.enemy.hpMax;

    },

    UpdateDistance:function () {
        this.distanceLabel.string = this.distance+"米";
    },

    //判断攻击顺序
    CheckTurn:function(){
        if(this.heroCD<=this.enemyCD)
            this.PlayerTurn();
        else
            this.EnemyTurn();
    },

    //敌方行动
    EnemyTurn:function () {
        this.UpdateActionState(false);

        if(enemy.attackDistance>this.distance)
            this.EnemyMoveForward();
        else
            this.EnemyAttack();
    },

    EnemyAttack:function () {
        this.BattleLog.add("-->" +this.enemy.Name + "朝你开了一枪。");
        if(!this.CalHit())
            this.BattleLog.add("-->"+"但是很幸运，你躲过了。");
        else
        {
            var dmg = this.CalDamage(this.enemy.attack,this.player.defence,this.CalCrit());
            this.player.Damage(dmg);
        }
        this.enemyCD+=1;
    },

    EnemyMoveForward:function () {
        var d = this.enemy.speed <= this.distance ? this.enemy.speed : this.distance;
        this.BattleLog.add("-->" + this.enemy.Name + "向你靠近了" + d + "米。");
        this.distance -= d;
        this.UpdateDistance();
        this.enemyCD += 1;
    },

    EnemyLoseHp:function(value) {
        var dmg = value > this.enemy.hp ? this.enemy.hp : value;
        this.enemy.hp -= dmg;
        this.UpdateEnemyState();
        if (this.enemy.hp <= 0)
            console.log("战斗结束！");
    },

    //玩家行动
    PlayerTurn:function () {
        this.UpdateActionState(true);
    },

    Weapon1Attack:function () {
        if(!this.CalHit()){
            this.BattleLog.add("没有打中!");
            return;
        }

        //需要加上武器的攻击
        var dmg = this.CalDamage(this.player.attack,this.enemy.defence,this.CalCrit());
        this.EnemyLoseHp(dmg);
        this.heroCD+=1;

        this.player.meleeProficiency++;
    },

    Weapon2Attack:function () {
        if(!this.CalHit()){
            this.BattleLog.add("没有打中!");
            return;
        }

        var dmg = this.CalDamage(this.player.attack,this.enemy.defence,this.CalCrit());
        this.EnemyLoseHp(dmg);
        this.heroCD+=1;
        this.player.rangedProficiency++;
    },

    Weapon3Attack:function () {
        if(!this.CalHit()){
            this.BattleLog.add("没有打中!");
            return;
        }

        var dmg = this.CalDamage(this.player.attack,this.enemy.defence,this.CalCrit());
        this.EnemyLoseHp(dmg);
        this.heroCD+=1;
    },


    JumpForward:function () {
        var d = this.player.speed <= this.distance ? this.player.speed : this.distance;
        this.BattleLog.add("-->你前进了" + d + "米。");
        this.distance -= d;
        this.UpdateDistance();
        this.heroCD+=1;
    },

    JumpBackward:function () {
        var d = this.player.speed;
        this.BattleLog.add("-->你后退了"+d+"米。");
        this.distance += d;
        this.UpdateDistance();
        this.heroCD+=1;
    },

    EscapeBattle:function () {
        var rnd = Math.floor(Math.random() * 10000);
        var rate = this.player.speed/(this.player.speed+this.enemy.speed)*10000;
        if(rnd<=rate){
            console.log("打不过就跑，并不丢人。");
            player.escapeProficiency++;
        }
        else
            console.log("你试图逃跑，但没成功。");

        this.heroCD+=1;
    },


    //通用计算
    CalHit:function () {
        return true;
    },

    CalCrit:function () {
        return false;
    },

    CalDamage:function(att,def,isCrit) {
        var dmg = (att - def) > 0 ? (att - def) : 0;
        if (isCrit)
            dmg *= 2;
        return dmg;
    },


});
