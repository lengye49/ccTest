// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        tipPrefab:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        console.log("OnLoadMethod");
        window.Player = this.getComponent('Player');
        window.Player.SetPlayerData("6;90;100;2;80;17;1001|2,1002|3");
    },

    start () {
        console.log("OnStartMethod");
        console.log(window.Player.dayNow);
    },



});
