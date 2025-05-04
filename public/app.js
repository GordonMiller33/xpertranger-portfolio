const app = angular.module('portfolioApp', ['ngSanitize']);

app.controller('MainController', function($scope, $http) {

	/*simple dark mode handling*/
	$scope.darkMode = true;
	$scope.toggleDarkMode = function() {
		$scope.darkMode = !$scope.darkMode;
	};

	/* defines columns of the nav table */
	$scope.columns = [
		{ relatedProperty: "title", displayName: "Title"}, 
		{ relatedProperty: "category", displayName: "Category"}
	];

	$scope.currentSort = 'title'; 	//The field that is current beingused to sort the navigation table in alphabetical order
	$scope.reverseSort = false;		//A flag that is true when the nav table is bein gsorted in reverse order

	//Sorts the nav table by whatever field is passed as a param
	$scope.sortBy = function(category){
		console.log("Sorting by", category);
		if ($scope.currentSort === category) {
			$scope.reverseSort = !$scope.reverseSort;
		} else {
			$scope.currentSort = category;
			$scope.reverseSort = false;
		}
	}

	/* determines which charcter is used to represent the sort direction */
	$scope.getSortChar = function(category) {
		if ($scope.currentSort === category) {
			if($scope.reverseSort){ return '↑'; }
			else{ return '↓'; }
		} 
	}

	/* flag that is true when: the filters window is not displayed*/
	$scope.filtersHidden = true;

	/* displays the "filters" window */
	$scope.showFilterWindow = function() {
		console.log("Opening filter window");
		$scope.filtersHidden = false;
	}

	/* hides the "filters" window */
	$scope.hideFilterWindow = function() {
		console.log("Hiding filter window");
		$scope.filtersHidden = true;
	}


	$scope.searchText = "";

	$scope.searchByTitleFilter = function(item) {
		return item.title.toLowerCase().includes($scope.searchText.toLowerCase());
	}

	$scope.brews = [];
	$scope.allBrews = [];
	$scope.categories = [];
	$scope.filters = [];

	//sets a brew to the be the currently selected brew based on id
	$scope.selectBrew = function(sid){
		$scope.selectedBrew = parseInt(sid);
	};


	/* gets all brews from mongoDB and intializes varibles*/
	/* newBrew is a flag that is true when: this was called in response to a new brew being added*/
    $scope.getBrews = function(newBrew) {
        const apiUrl = '/brews';
        
        console.log('Fetching brews from:', apiUrl);
        
        $http.get(apiUrl)
            .then(function(response) {
                console.log('API response:', response);
                if (response && response.data) {
                    $scope.allBrews = response.data;
                    console.log('Brews loaded:', $scope.allBrews.length, 'items');
                    
                    $scope.brews = [...$scope.allBrews];

                    $scope.brews.sort(function(a, b) {
					  	return a.title.localeCompare(b.title);
					});
					if (newBrew) { $scope.selectedBrew = $scope.nextId }
					else { $scope.selectedBrew = $scope.brews[0].id; }
                   

                    $scope.ids = [...new Set($scope.brews.map(brew => brew.id))];
                    $scope.nextId = parseInt(Math.max(...$scope.ids))+1;

                    if ($scope.brews.length > 0) {
                        $scope.categories = [...new Set($scope.brews.map(brew => brew.category))];
                        for (let i = 0; i < $scope.categories.length; i++){
							$scope.filters.push({name: $scope.categories[i], state: 0});
						}
                        console.log('Categories:', $scope.categories);
                    } else {
                        console.warn('No brews found in the database');
                    }
                } else {
                    console.error('Invalid response format:', response);
                }
            })
            .catch(function(error) {
                console.error('Error fetching brews:', error);
            });
    };
    
    $scope.getBrews(false);
	
	$scope.addBrew = function() {
		const apiUrl = '/brews';
		
		$scope.newBrew = {
			id: $scope.nextId,
			title: $scope.newBrewTitle,
			category: $scope.newBrewCategory,
			summary: $scope.newBrewContent,
			content: $scope.newBrewContent,
		};
		
		console.log('Putting brew into brews:', $scope.newBrew);
		
		$http.put(apiUrl, $scope.newBrew)
			.then(async function(response) {
				console.log('API response:', response);
				if (response && response.data) {
					console.log('Brew PUT successfully');
					await $scope.getBrews(true);
					$scope.nextId++;
                } else {
                    console.error('Invalid response format:', response);
                }
            })
            .catch(function(error) {
                console.error('Error putting brew:', error);
            });
	}

	$scope.numIncludedFilters = 0; 	// The number of filters in the "included" state
	$scope.numActiveFilters = 0;	// The number of filters NOT in the "default" state

	// rotates through filter state on click: 0=inactive -> 1=enabled -> 2=disbled -> 0
	$scope.cycleFilterType = function(filter) {
		index = $scope.filters.indexOf($scope.filters.find((item) => item.name === filter));

		console.log("$scope.filters[index]:", $scope.filters[index])

		switch($scope.filters[index].state){
			case 0:
				$scope.filters[index].state++;
				$scope.numIncludedFilters++;
				$scope.numActiveFilters++;
				break;
			case 1:
				$scope.filters[index].state++;
				$scope.numIncludedFilters--;
				break;
			case 2:
				$scope.filters[index].state = 0;
				$scope.numActiveFilters--;
				break;
		}

		console.log("numIncludedFilters:", $scope.numIncludedFilters);
		$scope.applyFilters();
	}

	/* deactivates an active filter */
	$scope.deactivateFilter = function(filter) {
		index = $scope.filters.indexOf($scope.filters.find((item) => item.name === filter));

		if( $scope.filters[index].state === 1){
			$scope.filters[index].state = 0;
			$scope.numIncludedFilters--;
			$scope.numActiveFilters--;
		} else { 
			$scope.filters[index].state = 0;
			$scope.numActiveFilters--;
		}

		$scope.applyFilters();
	}

	/* filters through brews using the curently active filters */
	$scope.applyFilters = function() {
		$scope.brews = [...$scope.allBrews];
		if($scope.numActiveFilters > 0){
			if ($scope.numIncludedFilters > 0){
		        $scope.brews = $scope.brews.filter(function(brew) {
		        	return $scope.filters.find((item) => item.name === brew.category).state === 1;
		        });
	        }
	        $scope.brews = $scope.brews.filter(function(brew) {
	        	return $scope.filters.find((item) => item.name === brew.category).state != 2;
	        });
	    }
	    if($scope.brews.length > 0){ $scope.selectBrew($scope.brews[0].id); }
	    
	};

	/* hides the filters window and applys all active filters */
	$scope.closeFilterWindow = function() {
		console.log("Closing filter window");
		$scope.applyFilters();
		$scope.hideFilterWindow();
	};

});