angular.module('sc.modules')
    .controller('assembleiaCtrl', assembleiaCtrl);

function assembleiaCtrl($scope, $ionicModal, $ionicPopup, $ionicLoading, $timeout, $location, $localStorage, AssembleiaService, SessionService, ConfigService) {
    var vm = $scope;
    vm.temAlgumaAssembleiaAtiva = false;

    vm.logout = logout;
    $scope.$on('$ionicView.enter', function () {
        vm.usuario = SessionService.getSession();
        initRaias();
    });

    vm.submeterAssembleia = function (indexRaia, indexAssembleia) {
        $ionicLoading.show({
            template: 'Submentendo evento... <ion-spinner icon="spiral"></ion-spinner>'
        });
        $timeout(function () {
            vm.raias[indexRaia].assembleias.splice(indexAssembleia, 1);
            AssembleiaService.updateRaias(vm.raias);
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Sincronização',
                template: 'Dados do evento submetidos com sucesso!',
                okType: 'button-balanced'
            })
        }, 3000);
    }

    vm.sincronizarAssembleia = function (config) {
        $ionicLoading.show({
            template: 'Sincronizando evento... <ion-spinner icon="spiral"></ion-spinner>'
        });
        $scope.closeModal();
        $timeout(function () {
            AssembleiaService.sincronizar(function (pessoas) {
                //ConfigService.setAdministradoresDevice(res.data.listAdministradores);
                //var assembleiaExistente = false;
                // angular.forEach(vm.raias, function (raia) {
                //     for (var i = 0; i < raia.assembleias.length; i++) {
                //         if (raia.assembleias[i].id == res.data.id) {
                //             assembleiaExistente = true;
                //         }
                //     }
                // });
                // if (assembleiaExistente) {
                //     $ionicPopup.alert({
                //         title: 'Aviso',
                //         template: 'Evento já sincronizado.'
                //     });
                // } else {
                    //vm.raias[0].assembleias.push(res.data);
                    vm.raias[0].assembleias.push(pessoas);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Sincronização',
                        template: 'Dados do evento baixados com sucesso!',
                        okType: 'button-balanced'
                    })
                //}
                vm.temAlgumaAssembleiaAtiva = true;
                $localStorage.raias = JSON.stringify(vm.raias);
            });
        }, 3000);
    }


    function logout() {
        $ionicPopup.confirm({
            title: 'Logout',
            template: 'Você deseja sair do aplicativo?',
            okType: 'button-balanced'
        }).then(function(res){
            if(res) {
                SessionService.logout();
                $location.url('/login');
            } else {
                return false;
            }
        });
    }

    function setRaiaAssembleia(raiaIndex, assembleiaIndex) {
        //destino
        if (raiaIndex == 0) {
            AssembleiaService.setAssembleiaAtiva(vm.raias[raiaIndex].assembleias[assembleiaIndex]);
        } else {
            AssembleiaService.deactiveAssembleia(vm.raias[raiaIndex].assembleias[assembleiaIndex]);
        }
        vm.raias[raiaIndex + 1].assembleias.push(vm.raias[raiaIndex].assembleias[assembleiaIndex]);
        //remover da origem
        vm.raias[raiaIndex].assembleias.splice(assembleiaIndex, 1);
        console.log(vm.raias);
        updateRaias(vm.raias);

    }

    function updateRaias() {
        AssembleiaService.updateRaias(vm.raias);
    }

    function initRaias() {

        var raias = AssembleiaService.getRaias();

        if (raias.length < 1) {
            raias = [
                {
                    id_raia: 0,
                    status: 'Sincronizados',
                    assembleias: []
                },
                {
                    id_raia: 1,
                    status: 'Em andamento',
                    assembleias: []
                },
                {
                    id_raia: 2,
                    status: 'Encerrado',
                    assembleias: []
                }
            ];
            vm.temAlgumaAssembleiaAtiva = false;
            vm.raias = raias;
            AssembleiaService.updateRaias(raias);
        } else {
            for (var i = 0; i < raias.length; i++) {
                console.log(raias)
                for (var j = 0; j < raias[i].assembleias.length; j++) {
                    if (raias[i].assembleias.length > 0) {
                        vm.temAlgumaAssembleiaAtiva = true;
                    }
                }
            }
        }

        vm.raias = raias;
    }


    vm.showPopup = function (status, raiaIndex, assembleiaIndex) {
        vm.data = {};
        if (status === 'start') {
            var infoObj = {
                titulo: 'Deseja iniciar o evento?',
                subtitulo: 'Insira a chave privada, por favor.',
                txtBotao: '<b>Iniciar</b>',
                txtBotaoTipo: 'button-balanced'
            };
        } else {
            var infoObj = {
                titulo: 'Deseja encerrar o evento?',
                subtitulo: 'Insira a chave privada, por favor.',
                txtBotao: '<b>Encerrar</b>',
                txtBotaoTipo: 'button-assertive'
            };
        }

        var popup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.chave">',
            title: infoObj.titulo,
            subTitle: infoObj.subtitulo,
            scope: $scope,
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: infoObj.txtBotao,
                    type: infoObj.txtBotaoTipo,
                    onTap: function (e) {
                        if (!$scope.data.chave) {
                            e.preventDefault();
                            alert("Dados inválidos!");
                        } else {
                            setRaiaAssembleia(raiaIndex, assembleiaIndex);
                            return $scope.data.chave;
                        }
                    }
                }
            ]
        });
    };


    $ionicModal.fromTemplateUrl('modules/assembleia/modal-sincronizacao.html', {
        id: 'sincronizacao',
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    }

    $scope.closeModal = function () {
        $scope.modal.hide();
    }

};