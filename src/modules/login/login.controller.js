angular.module('sc.modules')
    .controller('loginCtrl', loginCtrl);

function loginCtrl($scope, $state, $timeout, $sce, $ionicPlatform, $ionicPopup, $location, $ionicHistory, SessionService, AssembleiaService) {
    var vm = $scope;
    vm.login = login;
    vm.init = getAssembleiasAtivas;
    vm.config = {};
    vm.mensagensErro = [];

    function getAssembleiasAtivas() {
        vm.listAssembleias = AssembleiaService.getAssembleiasAtivas();
    }


    function login(config) {
        var msg = validaCampos(config);
        if (msg.length < 1) {
            SessionService.setSession(config);
            if (config.perfil != "ASSIST") {
                $state.go("tab.assembleia");
            } else {
                $location.url('/participantes/lista-participantes/' + config.evento.id);
            }

        } else {
            vm.mensagensErro = msg;
            $timeout(function () {
                vm.mensagensErro = null;
            }, 10000);
        }
    }


    function validaCampos(config) {
        var mensagensErro = [];
        if (config.perfil) {
            console.log(config);
            if (config.perfil === "ASSIST" && (!config.evento || config.evento == "0")) {
                mensagensErro.push({ msg: $sce.trustAsHtml("Campo <b>evento</b> obrigatório.") });
            }
        } else {
            mensagensErro.push({ msg: $sce.trustAsHtml("Campo <b>perfil</b> obrigatório.<br>") });
        }
        if (!config.login) {
            mensagensErro.push({ msg: $sce.trustAsHtml("Campo <b>login</b> obrigatório.<br>") });
        }
        if (!config.senha) {
            mensagensErro.push({ msg: $sce.trustAsHtml("Campo <b>senha</b> obrigatório.<br>") });
        }

        return mensagensErro;

    }

}