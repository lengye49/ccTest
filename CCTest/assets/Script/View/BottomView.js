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
        backpackButton:cc.Button,
        restButton:cc.Button,
        backpackLabel:cc.Label,
        restLabel:cc.Label,
    },


    start () {

    },

    changeState:function (str) {
        switch (str){
            case "backpackOpen":
                this.bottomState(true,false,'返回','休息');
                break;
            case "backpackClose":
                this.bottomState(true,true,'背包','休息');
                break;
            case "restOpen":
                this.bottomState(false,true,'背包','返回');
                break;
            case "restClose":
                this.bottomState(true,true,'背包','休息');
                break;
        }
    },

    bottomState:function (state0,state1,txt0,txt1) {
        this.backpackButton.interactable = state0;
        this.restButton.interactable = state1;
        this.backpackLabel.string = txt0;
        this.restLabel.string = txt1;
    },

});
