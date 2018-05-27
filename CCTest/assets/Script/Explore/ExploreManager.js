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
        searchNode:cc.Node,
        choiceNode:cc.Node,
        normalNoticeNode:cc.Node,
        screenNoticeNode:cc.Node,
    },

    onLoad:function(){
        this.searchPanel = this.searchNode.getComponent('Search');
        this.choicePanel = this.choiceNode.getComponent('Choice');
        this.normalNoticePanel = this.normalNoticeNode.getComponent('Notice');
        this.screenNoticePanel = this.screenNoticeNode.getComponent('Screen');

        this.hideAll();
        window.explore = this;
    },

    showSearch:function(param){
        this.hideAll();
        this.searchNode.active = true;
        this.searchPanel.updateShow(param);
    },

    showChoice:function(param){
        this.hideAll();
        this.choiceNode.active = true;
        this.choicePanel.updateShow(param);
    },

    showNormalNotice:function(param){
        this.hideAll();
        this.normalNoticeNode.active = true;
        this.normalNoticePanel.updateShow(param);
    },

    showScreenNotice:function(param){
        this.hideAll();
        this.screenNoticeNode.active = true;
        this.screenNoticePanel.updateShow(param);
    },

    hideAll:function(){
        this.searchNode.active = false;
        this.choiceNode.active = false;
        this.normalNoticeNode.active = false;
        this.screenNoticeNode.active = false;
    },

    closeNormalNotice:function(){
        this.showSearch(true);
    },

    closeScreenNotice:function () {
        this.showSearch(true);
    },

});
