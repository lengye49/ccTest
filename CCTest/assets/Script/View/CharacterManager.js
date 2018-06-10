cc.Class({
    extends: cc.Component,

    properties: {
        heroConstitution:cc.Label,
        heroDefence:cc.Label,
        heroSpeed:cc.Label,

        meleeExp:cc.Label,
        rangedExp:cc.Label,
        escapeExp:cc.Label,

        dogConstitution:cc.Label,
        dogAtk:cc.Label,
        dogRetrieve:cc.Label,
        dogAlert:cc.Label,
    },

    updateShow:function () {
        this.heroConstitution.string = window.Player.constitution;
        this.heroDefence.string = window.Player.defence;
        this.heroSpeed.string = window.Player.speed;

        this.meleeExp.string = window.Player.meleeProficiency;
        this.rangedExp.string = window.Player.rangedProficiency;
        this.escapeExp.string = window.Player.escapeProficiency;

        this.dogConstitution.string = window.Player.dogHpMax;
        this.dogAtk.string = window.Player.dogAtk;
        this.dogRetrieve.string = window.Player.dogRetrieve;
        this.dogAlert.string = window.Player.dogAlert;
    },
});
