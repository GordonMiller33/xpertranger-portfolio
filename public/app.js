const app = angular.module('portfolioApp', ['ngSanitize']);

app.controller('MainController', function($scope, $http) {

	/*simple dark mode handling*/
	$scope.darkMode = true;
	$scope.toggleDarkMode = function() {
		$scope.darkMode = !$scope.darkMode;
	};

	/* defines columns of the nav table */
	$scope.columns = [
		{ relatedProperty: "title", displayName: "Title", small: false}, 
		{ relatedProperty: "category", displayName: "Category", small: false},
		{ relatedProperty: "edition", displayName: "Edition", small: true}
	];


	$scope.filters = [
		{ relatedProperty: "category", displayName: "Category", options: []},
		{ relatedProperty: "edition", displayName: "Edition", options: []}
	];

	$scope.currentSort = 'title'; 	//Holds whichever field is currently being used to sort the navigation table in alphabetical order
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
                    $scope.allBrews.sort((a,b) => a.title.localeCompare(b.title));
                    
                    $scope.brews = [...$scope.allBrews];

                    $scope.brews.sort(function(a, b) {
					  	return a.title.localeCompare(b.title);
					});
					if (newBrew) { $scope.selectedBrew = $scope.nextId }
					else { $scope.selectedBrew = $scope.brews[0].id; }
                   

                    $scope.ids = [...new Set($scope.brews.map(brew => brew.id))];
                    $scope.nextId = parseInt(Math.max(...$scope.ids))+1;

                    if ($scope.brews.length > 0) {
                    	for(let i = 0; i < $scope.filters.length; i++){
                    		let temp = [...new Set($scope.brews.map(brew => brew[$scope.filters[i].relatedProperty]))]
                    		for(let j = 0; j < temp.length; j++){
                    			$scope.filters[i].options.push({ name: temp[j], state: 0 })
                    		}
                    		console.log($scope.filters[i].displayName, "options: ", $scope.filters[i].options );
                    	}

                        // $scope.categories = [...new Set($scope.brews.map(brew => brew.category))];
                        // for (let i = 0; i < $scope.categories.length; i++){
						// 	$scope.filters.push({name: $scope.categories[i], state: 0});
						// }
                        // console.log('Categories:', $scope.categories);
                        // $scope.editions = [...new Set($scope.brews.map(brew => brew.edition))];
                        // for (let i = 0; i < $scope.editions.length; i++){
						// 	$scope.filters.push({name: $scope.editions[i], state: 0});
						// }
                        // console.log('Editions:', $scope.editions);
                        // console.log('Filters:', $scope.filters);
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
	$scope.activeFilters = [];

	// rotates through filter state on click: 0=inactive -> 1=enabled -> 2=disbled -> 0
	$scope.cycleFilterState = function(filterType, filter) {
		typeIndex = $scope.filters.indexOf($scope.filters.find((item) => item.relatedProperty === filterType));
		optionIndex = $scope.filters[typeIndex].options.indexOf($scope.filters[typeIndex].options.find((item) => item.name === filter));

		console.log("typeIndex", typeIndex);
		console.log("optionIndex", optionIndex);

		console.log("$scope.filters[typeIndex].options[optionIndex]:", $scope.filters[typeIndex].options[optionIndex]);

		switch($scope.filters[typeIndex].options[optionIndex].state){
			case 0:
				$scope.filters[typeIndex].options[optionIndex].state++;
				$scope.numIncludedFilters++;
				$scope.numActiveFilters++;
				$scope.activeFilters.push({ 
					name: $scope.filters[typeIndex].options[optionIndex].name, 
					type: $scope.filters[typeIndex].relatedProperty, 
					state: $scope.filters[typeIndex].options[optionIndex].state
				});
				break;
			case 1:
				$scope.filters[typeIndex].options[optionIndex].state++;
				$scope.numIncludedFilters--;
				$scope.activeFilters[$scope.activeFilters.indexOf($scope.activeFilters.find((item) => item.name === filter))].state = $scope.filters[typeIndex].options[optionIndex].state;
				break;
			case 2:
				$scope.filters[typeIndex].options[optionIndex].state = 0;
				$scope.numActiveFilters--;
				$scope.activeFilters.splice($scope.activeFilters.indexOf($scope.activeFilters.find((item) => item.name === filter)),1);
				break;
		}

		console.log("Active Filters:", $scope.activeFilters);
		$scope.applyFilters();
	}

	/* deactivates an active filter */
	$scope.deactivateFilter = function(filterType, filter) {
		typeIndex = $scope.filters.indexOf($scope.filters.find((item) => item.relatedProperty === filterType));
		optionIndex = $scope.filters[typeIndex].options.indexOf($scope.filters[typeIndex].options.find((item) => item.name === filter));

		if( $scope.filters[typeIndex].options[optionIndex].state === 1){
			$scope.filters[typeIndex].options[optionIndex].state = 0;
			$scope.activeFilters.splice($scope.activeFilters.indexOf($scope.activeFilters.find((item) => item.name === filter)),1);
			$scope.numIncludedFilters--;
			$scope.numActiveFilters--;
		} else { 
			$scope.filters[typeIndex].options[optionIndex].state = 0;
			$scope.activeFilters.splice($scope.activeFilters.indexOf($scope.activeFilters.find((item) => item.name === filter)),1);
			$scope.numActiveFilters--;
		}
		$scope.applyFilters();
	}

	/* filters through brews using the currently active filters */
	$scope.applyFilters = function() {
		$scope.brews = [...$scope.allBrews];

		if($scope.activeFilters.length > 0){
	        for(let i = 0; i < $scope.activeFilters.length; i++){
	        	$scope.brews = $scope.brews.filter(brew => {
	        		if($scope.activeFilters[i].state === 1){
	        			if (brew[$scope.activeFilters[i].type] === $scope.activeFilters[i].name){ return true; }
		        		else { return false; }
	        		} 
	        		if($scope.activeFilters[i].state === 2){
	        			if (brew[$scope.activeFilters[i].type] === $scope.activeFilters[i].name){ return false; }
		        		else { return true; }
	        		}

	        	});
	        }
	    }
	    $scope.activeFilters.sort((a, b) => a.name.localeCompare(b.name));
	    if($scope.brews.length > 0){ 
		    $scope.selectBrew($scope.brews[0].id); 
		}
	}

	/* hides the filters window and applys all active filters */
	$scope.closeFilterWindow = function() {
		console.log("Closing filter window");
		$scope.applyFilters();
		$scope.hideFilterWindow();
	};

});