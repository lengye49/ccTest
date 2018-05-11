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
        // battleLog:cc.BattleLog,
    },

    start:function () {
        this.player = this.node.getParent().getComponent("Player");

        var Unit = require("Unit");
        var enemy = new Unit();

        this.InitBattle(enemy);

        this.BattleLog = this.node.getChildByName("battleLog").getComponent("BattleLog");
    },
    
    InitBattle:function (enemy) {
        this.UpdateActionState();
        this.UpdateActionLabel();
        this.UpdateEnemyState(enemy);
        this.UpdateDistance();
    },

    //处理场景元素
    UpdateActionState:function () {
        this.weapon1Action.interactable = true;
        this.weapon2Action.interactable = true;
        this.weapon3Action.interactable = true;
        this.jumpForward.interactable = true;
        this.jumpBackward.interactable = true;
        this.escapeBattle.interactable = true;
    },

    UpdateActionLabel:function(){
        this.weapon1Distance.string = "0";
        this.weapon2Distance.string = "0";
        this.weapon3Distance.string = "0";
        this.forwardDistance.string = "0";
        this.backwardDistance.string = "0";
        this.escapeRate.string = "0";
    },

    UpdateEnemyState:function (enemy) {
        this.enemyName.string = enemy.Name;
        this.enemyHpProgress.progress = 1.0;
        this.enemyHpLabel.string = enemy.hp + "/" + enemy.hpMax;

    },

    UpdateDistance:function () {
        this.distanceLabel.string = this.distance+"米";
    },

    //处理战斗
    Weapon1Attack:function () {

    },

    Weapon2Attack:function () {

    },

    Weapon3Attack:function () {

    },

    JumpForward:function () {
        var d = this.player.speed <= this.distance ? this.player.speed : this.distance;
        this.BattleLog.add("-->你前进了"+d+"米");
        this.distance -= d;
        this.UpdateDistance();
    },

    JumpBackward:function () {
        var d = this.player.speed;
        this.BattleLog.add("-->你后退了"+d+"米");
        this.distance += d;
        this.UpdateDistance();
    },

    EscapeBattle:function () {
        var r = Math.floor(Math.random() * 10000);
    },

});
