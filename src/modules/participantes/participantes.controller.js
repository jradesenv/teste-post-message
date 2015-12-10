angular.module('sc.modules')
    .controller('participantesCtrl', participantesCtrl)
    .filter('highlight', highlight);

function highlight($sce) {
    console.log($sce);

    return function(text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="highlighted">$1</span>')
        return $sce.trustAsHtml(text)
    }
};

function participantesCtrl($scope, $ionicModal, $location, $stateParams, SessionService, $ionicHistory, $localStorage, AssembleiaService, ConfigService, $ionicPopup) {
    var vm = $scope;
    vm.usuario = SessionService.getSession();

    vm.assembleia = AssembleiaService.getAssembleiasAtivas($stateParams.id_assembleia);

    vm.voltar = function() {
         window.history.back();
    };

    vm.logout = function() {
        $ionicPopup.confirm({
            title: 'Logout',
            template: 'Você deseja sair do aplicativo?',
            okType: 'button-balanced'
        }).then(function(res) {
            if (res) {
                SessionService.logout();
                $location.url('/login');
            } else {
                return false;
            }
        });
    }



    $scope.openModal = function(participanteSelecionado) {

        $ionicModal.fromTemplateUrl('modules/participantes/modal-assinatura.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {

            $scope.modal = modal;
            $scope.modal.show();


            var canvas = document.getElementById('assinaturaCanvas');
            var signaturePad = new SignaturePad(canvas);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;


            $scope.salvarAssinatura = function(participanteSelecionado) {
                var sigImg = signaturePad.toDataURL();
                participanteSelecionado.assinatura = sigImg;
                console.log(participanteSelecionado);
                AssembleiaService.updateAssembleia(vm.assembleia);
                $scope.closeModal();
            };
            //$scope.associate = participanteSelecionado;
            $scope.closeModal = function() {
                $scope.modal.remove();
            };

        });




    };

    $scope.selectAssociate = function(participante) {
        if (participante.nome !== '' && participante.nome !== undefined) {
            var associateName = participante.nome.split(" ");
            participante.primeiroNome = associateName[0];
            $scope.participante = participante;
        }
        $scope.participanteSelecionado = participante;
    };

    $scope.resizeInfo = function(arg) {
        var resizeInfo = document.querySelector(".header-evento");
        if (arg) {
            resizeInfo.classList.add("box-hide");
        } else {
            resizeInfo.classList.remove("box-hide");
        }
    };
};