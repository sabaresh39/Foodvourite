var app = angular.module('foodvouriteApp', []);
app.controller('mainCtrl', function($scope) {
    
	let categoryTabOffSet;

    $scope.responseData = {}
    $scope.selectedCategory = '';
    $scope.searchProduct = '';
    $scope.isCategoryTabReachedTop = false;

	$scope.init = (function(){
		const Http = new XMLHttpRequest();
		const url='http://temp.dash.zeta.in/food.php';
		Http.open("GET", url);
		Http.send();
		Http.onreadystatechange=(e)=>{
			$scope.responseData =  JSON.parse(( Http.responseText));
			$scope.selectCategory($scope.responseData.categories[0].name);
			for(let i=0;i<$scope.responseData.recipes.length; i++){
					$scope.responseData.recipes[i]['id'] = i+1;
			}
			$scope.$apply();
		}
	})();

	$scope.selectCategory = category => $scope.selectedCategory = category;

	$scope.isCategorySelected = category => (($scope.selectedCategory.toLowerCase()) == (category.toLowerCase()));

	$scope.searchProducts = (product) => {
		if($scope.searchProduct.length){
			return (product.name.toLowerCase().includes($scope.searchProduct.toLowerCase()));
		} else{
			return true;
		}
	};

	$scope.addToCart = (product)=>{
		let tmp = $scope.getCart();
		let productPresent = false; 
		if(tmp){
			for ([key, val] of Object.entries(tmp)) {
			  if(key == product.id){
			  	productPresent = true;
			  }
			}
		} else{
			tmp = {};
		}

		if(productPresent){
			tmp[product.id] = parseInt(tmp[product.id]) + 1;
		} else{
			tmp[product.id] = 1;
		}

		$scope.setCart(tmp); 
	};


	$scope.getCount = () => {
		let addedItems = $scope.getCart();
		let cartTotal = 0;
		for ([key, val] of Object.entries(addedItems)) {
			cartTotal += parseInt(addedItems[key])
		}
		return cartTotal;
	}

	setTimeout(() => {
		categoryTabOffSet = document.getElementById("categoryTab").offsetTop;
	}, 100)

	window.onscroll = function() {
		if (window.pageYOffset > categoryTabOffSet) {
		    document.getElementById("categoryTab").classList.add("fixed");
		  } else {
		    document.getElementById("categoryTab").classList.remove("fixed");
		  }
	};

	$scope.setCart = function(value) {
	  localStorage.setItem('cart', JSON.stringify(value));
	}

	$scope.getCart = function() {
	  return JSON.parse(localStorage.getItem('cart'));
	}


});