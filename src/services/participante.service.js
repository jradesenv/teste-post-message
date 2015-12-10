angular.module('sc.services')
	.factory('ParticipanteService', ParticipanteService);

function ParticipanteService($ionicPlatform) {

	return {
		getParticipantes: getParticipantes,
		insertParticipantes: insertParticipantes,
		updateParticipantes: updateParticipantes,
		getPorcentagemAssinaturasNoEvento: getPorcentagemAssinaturasNoEvento
	}


	function getParticipantes(callback) {


		$ionicPlatform.ready(function () {
			if (window.cordova) {
				var participantes;
				db.transaction(function (tx) {
					tx.executeSql("SELECT * FROM tb_participantes", [], function (tx, res) {
						participantes = res.rows;
					})
				}, function (err) {
					console.log(err);
					console.log("Não foi possivel completar a query no sqllite.");
					return null;
				}, function () {
					console.log('Transaction ok.');
					
					callback(participantes);
				});
			}
		});
	}

	function getPorcentagemAssinaturasNoEvento(callback) {
		if (window.cordova) {
			$ionicPlatform.ready(function () {
				var totalAssinaturas = 0;
				var assinaturasColetadas = 0;
				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM tb_participantes', [], function (tx, res) {
						console.log("Quantidade de rows na table tb_participantes " + res.rows.length);
						totalAssinaturas = res.rows.length;
					});
					tx.executeSql('SELECT * FROM tb_participantes WHERE assinatura != (?)', [''], function (tx, res) {
						console.log("Quantidade coletada de assinaturas " + res.rows.length);
						assinaturasColetadas = res.rows.length;
					});
				}, function (err) {
					console.log(err);
				}, function () {
					var porcentagemColetada = Math.round((assinaturasColetadas * 100) / totalAssinaturas).toFixed(2);
					callback(porcentagemColetada);
				});
			});
		}
	}


	function updateParticipantes(participante, callback) {
		if (window.cordova) {
			$ionicPlatform.ready(function () {
				db.transaction(function (tx) {
					tx.executeSql('UPDATE tb_participantes SET assinatura = (?) WHERE id = (?)', [participante.assinatura, participante.id], function (tx, res) {
						console.log("Participante " + participante.nome + " alterado com sucesso.");
						console.log("Assinatura atualzada: " + participante.assinatura);
						callback();
					});
				});
			});
		}
	}

	function insertParticipantes(participantes, sucessCallback) {
		if (window.cordova) {
			$ionicPlatform.ready(function () {
				db.transaction(function (tx) {
					for (var i = 0; i < participantes.length; i++) {
						tx.executeSql("INSERT INTO tb_participantes (nome,endereco,cpf ) VALUES (?,?,?)", [participantes[i].nome, participantes[i].endereco, participantes[i].cpf], function (tx, res) {
							console.log("último id inserido de participante: " + res.insertId);
						})
					}
				}, function () {
					console.log("Não foi possivel completar a query no sqllite.");
					return null;
				}, function () {
					console.log('Transaction ok.');
					sucessCallback();
				});
			});
		}
	}

}