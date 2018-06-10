
cc.Class({
    extends: cc.Component,

    properties: {
        cell:cc.Prefab,
        itemContainer:cc.Node,
        itemTipNode:cc.Node,

        backpackNode:cc.Node,
        characterNode:cc.Node,
        isBackpackOn:true,

        weapon1Btn:cc.Button,
        weapon1Label:cc.Label,

        weapon2Btn:cc.Button,
        weapon2Label:cc.Label,

        armorBtn:cc.Button,
        armorLabel:cc.Label,

        shoesBtn:cc.Button,
        shoesLabel:cc.Label,
    },


    start () {
        this.itemTip = this.itemTipNode.getComponent("ItemTip");
        this.cellPool = new Array();
        this.character = this.characterNode.getComponent("CharacterManager");
    },

    //*************************切换界面***************************
    switchPanel:function(){
        if(this.isBackpackOn){
            this.toCharacter();
        }else{
            this.toBackpack();
        }
    },

    toBackpack:function(){
        this.backpackNode.position = cc.p(0,0);
        this.characterNode.position = cc.p(-5000,0);
        this.isBackpackOn=true;
    },

    toCharacter:function(){
        this.characterNode.position = cc.p(0,0);
        this.backpackNode.position = cc.p(-5000,0);
        this.isBackpackOn=false;
        this.character.updateShow();
    },

    //*************************更新展示***************************
    //默认使用的是第一个
    updateShow:function () {
        this.toBackpack();
        var i;
        var totalWeight = 0.0;
        var items = window.Player.backpack.getItems();
        for(i=0;i<items.length;i++){
            var cellView = this.requireCell(i).getComponent("CellView");
            var itemId = items[i];
            var num = window.Player.backpack[itemId];
            totalWeight += window.ReadJson.getItem(itemId).weight * num;
            cellView.updateShow(itemId,num,this);
        }
        this.hidePool(i);
        window.Player.updateWeight(totalWeight);
        this.updateEquipedItems();
    },

    //更新装备信息
    updateEquipedItems:function () {
        this.refreshEquipState(window.Player.weapon1,this.weapon1Label,this.weapon1Btn);
        this.refreshEquipState(window.Player.weapon2,this.weapon2Label,this.weapon2Btn);
        this.refreshEquipState(window.Player.armor,this.armorLabel,this.armorBtn);
        this.refreshEquipState(window.Player.shoes,this.shoesLabel,this.shoesBtn);
    },

    refreshEquipState:function (equipId,equipLabel,equipBtn) {
        if(equipId>0){
            equipLabel.string = window.ReadJson.getItem(equipId).name;
            equipBtn.interactable = true;
        }else{
            equipLabel.string = "";
            equipBtn.interactable = false;
        }
    },

    requireCell:function (index) {
        if (index >= this.cellPool.length){
            this.cellPool[index] = cc.instantiate(this.cell);
            this.cellPool[index].parent = this.itemContainer;
        }
        this.cellPool[index].active = true;
        return this.cellPool[index];
    },

    hidePool:function (index) {
        if (index < this.cellPool.length) {
            var i;
            for (i = index; i < this.cellPool.length; i++)
                this.cellPool[i].active = false;
        }
    },

    //******************点击已装备按钮，弹出tips***********************
    onClickEquipedItem:function (index) {
        var item;
        switch (index){
            case 0:
                item = window.ReadJson.getItem(window.Player.weapon1);
                break;
            case 1:
                item = window.ReadJson.getItem(window.Player.weapon2);
                break;
            case 2:
                item = window.ReadJson.getItem(window.Player.armor);
                break;
            case 3:
                item = window.ReadJson.getItem(window.Player.shoes);
                break;
        }
        this.showItemTips(item,true);
    },

    //*************************更新物品Tip***************************
    //如果是已装备的，则isUsing = true
    showItemTips:function (item,isUsing) {
        this.itemInShow = item;
        this.itemUsingState = isUsing;

        this.itemTipNode.active = true;
        this.itemTipNode.node.position = cc.p(0,0);

        this.itemTip.updateShow(item,isUsing);
    },

    closeItemTips:function () {
        this.itemTipNode.active = false;
    },


    ////*************************背包物品操作***************************
    drop:function () {
        if(this.itemUsingState){

        }else{
            window.Player.removeItem(this.itemInShow.id,1);
            this.updateShow();
        }
    },

    dropAll:function () {
        if (this.itemUsingState) {

        } else {
            window.Player.removeAllItems(this.itemInShow.id);
            this.updateShow();
        }
    },

    action1:function () {
        switch (this.itemInShow.type) {
            case 0:
            case 1:
            case 2:
            case 6:
            case 7:
                if (this.itemUsingState)
                    this.takeOffEquip();
                else
                    this.putOnEquip();
                break;
            case 3:
            case 4:
            case 5:
                this.useItem();
                break;
            case 8:
            default:
                break;
        }
    },

    action2:function () {
        switch (this.itemInShow.type) {
            case 3:
            case 4:
                this.feedDog();
                break;
            default:
                break;
        }
    },

    takeOffEquip:function () {
        window.Player.takeOffEquip(this.itemInShow.id);
        window.Player.initProperties();
        this.updateShow();
    },

    putOnEquip:function () {
        window.Player.putOnEquip(this.itemInShow.id);
        window.Player.initProperties();
        this.updateShow();
    },

    useItem:function () {
        window.Player.removeItem(this.itemInShow.id,1);
        window.Player.changeProperties(this.itemInShow.effects,false);
        this.updateShow();
    },

    feedDog:function () {
        window.Player.removeItem(this.itemInShow.id,1);
        window.Player.changeProperties(this.itemInShow.effects,true);
        this.useItemInShow();
    },


});
