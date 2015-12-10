angular.module('sc.services')

	.factory('menuService', MenuService);

function MenuService($rootScope, messageService, $state) {
	return {
		addItem: addItem,
		cleanItems: cleanItems,
		selectFirstItem: selectFirstItem,
		configHeader: configHeader
	}

	function addItem(title, rota, target){ //trocar controller por rota
		try{
			$rootScope.menuItems = $rootScope.menuItems || [];
			var item = {
				title: title,
				rota: rota,
				target: target
			};
			$rootScope.menuItems.push(item);
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function cleanItems(){
		try{
			$rootScope.menuItems = [];
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function selectFirstItem(){
		try{
			if($rootScope.menuItems.length > 0) {
				var firstItem = $rootScope.menuItems[0];
				$state.go(firstItem.rota);
			}
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
	function configHeader(userName, sicredi, imgUrl){
		try{
			//setar nome e imagem do usuario no menu		
		}catch(ex){
			messageService.showError(ex.message);
		}
	}
	
}