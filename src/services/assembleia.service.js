angular.module('sc.services')
	.factory('AssembleiaService', assembleiaService);

function assembleiaService($http, $ionicPlatform, $localStorage, $ionicLoading, ParticipanteService) {

	return {
		sincronizar: sincronizar,
		deactiveAssembleia: deactiveAssembleia,
		setAssembleiaAtiva: setAssembleiaAtiva,
		getAssembleiasAtivas: getAssembleiasAtivas,
		updateAssembleia: updateAssembleia,
		updateRaias: updateRaias,
		getRaias : getRaias
	}


	function sincronizar(successCallback, failCallback) {	
		var id = getRandomText(5);
		var evento = {
			"id": id,
			"titulo": "Evento " + id,
			"data": "24/01/2016",
			"hora": "16:00",
			"local": "Porto Alegre/RS",
			"listaParticipantes": []
		};
		$http.get("mock/pessoas.json", {}).then(function (res) {
			var lista = [];
			var pessoas = res.data;
			for(var i = 0, len = 100; i < len; i++){
				var pessoa = getRandomPessoa(pessoas);
				console.log(pessoa);
				lista.push(pessoa);
			}
			evento.listaParticipantes = lista;
			successCallback(evento);
		})
	}
	
	function getRandomPessoa(pessoas) {
		var randomIndex = Math.floor(Math.random() * (pessoas.length - 1) + 0);
		console.log("randomIndex: " + randomIndex);
		var randomPessoa = pessoas[randomIndex];
		randomPessoa.id = getRandomText(20);
		randomPessoa.cpf = getRandomText(2, true);
		return randomPessoa;
	}

	function getRandomText(max, onlyNumber) {
		var arrText= [];
		var possible = "0123456789";
		if(!onlyNumber) {
			possible =  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + possible;
		}
	
		for( var i=0; i < max; i++ )
			arrText.push(possible.charAt(Math.floor(Math.random() * possible.length)));
	
		return arrText.join("");
	}

	function deactiveAssembleia(assembleia) {
		var assembleias = getAssembleiasAtivas();		
		var index = -1;
		for (var i = assembleias.length - 1; i >= 0; i--) {
			if(assembleias[i].id === assembleia.id) {
				index = i;
				break;
			}
		}	
		if(index > -1) {
			assembleias.splice(index, 1);
			$localStorage.assembleiasAtivas = JSON.stringify(assembleias);
		}
		console.log("ativas: ", $localStorage.assembleiasAtivas);
	}

	function setAssembleiaAtiva(assembleia) {
		var assembleias = getAssembleiasAtivas();
		assembleias.push(assembleia);
		$localStorage.assembleiasAtivas = JSON.stringify(assembleias);
	}
	
	function updateAssembleia(assembleia) {
		var assembleias = JSON.parse($localStorage.assembleiasAtivas);
		var index = -1;
		for (var i = assembleias.length - 1; i >= 0; i--) {
			if(assembleias[i].id === assembleia.id) {
				index = i;
				break;
			}
		}
		if(index > -1){
			assembleias[index] = assembleia;
			$localStorage.assembleiasAtivas = JSON.stringify(assembleias);
		}
	}
	
	function getAssembleiasAtivas(id_assembleia){

		var assembleias = JSON.parse(($localStorage.assembleiasAtivas) ? $localStorage.assembleiasAtivas : "[]");
		console.log(id_assembleia);
		if(id_assembleia) {
			for (var i = assembleias.length - 1; i >= 0; i--) {
			if(assembleias[i].id === id_assembleia) {
					return assembleias[i];
				}
			}	
		} else {
			return assembleias;
		}
	}
	
	function updateRaias(raias){
		$localStorage.raias = JSON.stringify(raias);
	}
	
	function getRaias(){
		var raias = $localStorage.raias ? $localStorage.raias : "[]";
		return JSON.parse(raias);
	}

}