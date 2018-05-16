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
        nameLabel:cc.Label,
        descLabel:cc.Label,

        choice0:cc.Button,
        choice0Text:cc.Label,

        choice1:cc.Button,
        choice1Text:cc.Label,

        choice2:cc.Button,
        choice2Text:cc.Label,

        choice3:cc.Button,
        choice3Text:cc.Label,
    },

    showChoice:function (choice) {
        this.nameLabel.string = choice.name;
        this.descLabel.string = choice.desc;

        this.choice0Text.string = choice.text0;

        if(choice.choicesCount>1){
            this.choice1.node.active = true;
            this.choice1Text.string = choice.text1;
        }else{
            this.choice1.node.active = false;
        }

        if(choice.choicesCount>2){
            this.choice2Text.string = choice.text2;
            this.choice2.node.active = true;
        }else{
            this.choice2.node.active = false;
        }

        if(choice.choicesCount>3){
            this.choice3Text.string = choice.text3;
            this.choice3.node.active = true;
        }else{
            this.choice3.node.active = false;
        }
    }

});
