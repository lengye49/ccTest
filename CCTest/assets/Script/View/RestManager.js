
cc.Class({
    extends: cc.Component,

    properties: {
        restBtn:cc.Button,
        barbecueBtn:cc.Button,
        fabricateBtn:cc.Button,

        restTimeLabel:cc.Label,
        woodPile1Label:cc.Label,
        woodPile2Label:cc.Label,
        meatLabel:cc.Label,
        ironLabel:cc.Label,
        barbecueTimeLabel:cc.Label,
        fabricateTimeLabel:cc.Label,

        restTime:8,
        barbecueCount:1,
        fabricateCount:1,
        fabricateTime:1,

        woodId:1000,
        meatId:1001,
        ironId:1002,
        baconId:1003,
        arrowId:1004,
    },

    updateShow:function () {
        this.updateRest();
        this.updateBarbecue();
        this.updateFabricate();
    },

    updateRest:function () {
        var canDo = (this.restTime <= window.Player.maxActionTime());
        var str = this.restTime + "小时";
        this.setLabelState(this.restTimeLabel,str,canDo);
        this.restBtn.interactable = canDo;
    },

    //木条id 1001，肉id 1002
    updateBarbecue:function () {
        var isWoodEnough = this.checkItemEnough(this.woodId,this.barbecueCount,this.woodPile1Label,"木条");
        var isMeatEnough = this.checkItemEnough(this.meatId,this.barbecueCount,this.meatLabel,"生肉");
        var isTimeEnough = (window.Player.maxActionTime()>=1);
        this.setLabelState(this.barbecueTimeLabel,"耗时:1小时",isTimeEnough);

        var canDo = (isWoodEnough && isMeatEnough && isTimeEnough);
        this.barbecueBtn.interactable = canDo;
    },

    //木条id 1001，铁片id 1002
    updateFabricate:function () {
        var isWoodEnough = this.checkItemEnough(this.woodId,this.fabricateCount,this.woodPile2Label,"木条");
        var isIronEnough = this.checkItemEnough(this.meatId,this.fabricateCount,this.ironLabel,"铁片");
        this.fabricateTime = Math.ceil(this.fabricateCount/5);
        var isTimeEnough = (window.Player.maxActionTime()>=this.fabricateTime);
        var timeStr = "耗时:"+ this.fabricateTime+"小时";
        this.setLabelState(this.barbecueTimeLabel,timeStr,isTimeEnough);

        var canDo = (isWoodEnough && isIronEnough && isTimeEnough);
        this.fabricateBtn.interactable = canDo;
    },

    checkItemEnough:function(itemId,reqNum,textLabel,itemName){
        var count = window.Player.backpack[itemId];
        var isEnough = count>=reqNum;
        var str = itemName +"×"+reqNum+"/"+count;
        this.setLabelState(textLabel,str,isEngough);
        return isEnough;
    },

    setLabelState(l,str,canDo){
        l.string = str;
        l.node.color = canDo?color.GREEN:color.RED;
    },

    rest:function () {
        window.Player.Sleep(this.restTime);
        this.updateRest();
    },

    addRestTime:function () {
        this.restTime++;
        this.updateRest();
    },

    reduceRestTime:function () {
        this.restTime--;
        this.updateRest();
    },

    barbecue:function () {
        var isWoodEnough = window.Player.isItemEnough(this.woodId, this.barbecueCount);
        var isMeatEnough = window.Player.isItemEnough(this.meatId, this.barbecueCount);
        if (isWoodEnough && isMeatEnough) {
            window.Player.addMinutes(60);
            window.Player.removeItem(this.woodId, this.barbecueCount);
            window.Player.removeItem(this.meatId, this.barbecueCount);
            window.Player.addItem(this.baconId, this.barbecueCount);
            window.Tip.ShowTip("烤肉+" + this.barbecueCount);
        } else {
            window.Tip.ShowTip("材料不足！");
        }
    },

    addBarbecueTime:function () {
        this.barbecueCount++;
        this.updateBarbecue();
    },

    reduceBarbecueTime:function () {
        this.barbecueCount--;
        this.updateBarbecue();
    },

    fabricate:function () {
        var isWoodEnough = window.Player.isItemEnough(this.woodId, this.fabricateCount);
        var isIronEnough = window.Player.isItemEnough(this.ironId, this.fabricateCount);
        if (isWoodEnough && isIronEnough) {
            window.Player.addMinutes(this.fabricateTime * 60);
            window.Player.removeItem(this.woodId, this.fabricateCount);
            window.Player.removeItem(this.ironId, this.fabricateCount);
            window.Player.addItem(this.arrowId, this.fabricateCount);
            window.Tip.ShowTip("箭支+" + this.fabricateCount);
        } else {
            window.Tip.ShowTip("材料不足！");
        }
    },

    addFabricateTime:function () {
        this.fabricateCount++;
        this.updateFabricate();
    },

    reduceFabricateTime:function () {
        this.fabricateCount--;
        this.updateFabricate();
    },


});
