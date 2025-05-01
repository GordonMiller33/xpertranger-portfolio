const app = angular.module('portfolioApp', ['ngSanitize']);

app.controller('MainController', function($scope, $http) {
	$scope.darkMode = true;
	$scope.toggleDarkMode = function() {
		$scope.darkMode = !$scope.darkMode;
	};

	/* $scope.brews = [
		{ id: 1, title: 'Demoralize', category: 'Action', summary: 'A new action to scare your foes into submission.', content: "<h2>Demoralize</h2><p>As an action, you attempt to convince a hostile creature within 60 feet of you that can hear you to give up on fighting. The target must make a Wisdom saving throw with a DC of 8 + your proficiency bonus + your Wisdom, Charisma, or Intelligence modifier (your choice). Targets with more than half of their total hit points have advantage on this saving throw. On a failure, the target takes 1d6 psychic damage which can't be reduced in any way.</p><p>If damage from this action would reduce a target to 0 hit points, they are instead reduced to 1 hit point and they must immediately choose one of the following courses of action:</p><ul><li><strong>Retreat.</strong> For the next 8 hours they must spend their turns trying to move as far away from you as they can. They also can't take reactions. For their action, they can use only the 	Dash action or try to escape from an effect that prevents them from moving. If there's nowhere for 	them to move or they've been unable to move for 1 minute, the <i>Retreat</i> effect ends and they must 	immediately choose a different course of action. When you haven't been in their line of sight for 	10 continuous minutes, the <i>Retreat</i> effect ends.	<li><strong>Surrender.</strong> The target drops anything its holding and becomes non-hostile towards 	you and creatures of your choice until it completes a long rest.	<li><strong>Falter.</strong> The target is stunned until the start of your next turn. Then, they 	become immune to this action for 1 hour.</ul><p>Creatures that are immune to the frightened condition are immune to this action.</p><p>This action's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).</p><section class='box'> 	<h5>Xpert Advice: Psychic Damage?</h5>	<p>The psychic damage from this action represents a creature losing its will to fight.</p></section>"},
		{ id: 2, title: 'Weaponsmith', category: 'Feat', summary: 'Craft and maintain weapons for your party.', content: "<h2>Weaponsmith</h2><p><em>General Feat (Prerequisite: Level 4+, Intelligence or Wisdom 13+)</em></p><p>You gain the following benefits:</p><ul><li><strong>Ability Score Increase.</strong> Increase your Strength, Dexterity, Wisdom, or Intelligence by 1.</li><li><strong>Tools of the Trade.</strong> You gain proficiency with Smith’s Tools or Woodcarver’s Tools. If you are already proficient with the chosen tools, you gain expertise with the chosen tools.</li><li><strong>Weapon Crafter.</strong> When you craft a weapon, you can halve the value of raw materials and the number of days required to make the item.</li><li><strong>Re-wrap Weapon.</strong> As part of a long rest, you can re-wrap the grips of a weapon if you have Smith’s Tools or Woodcarver’s Tools on hand. At the end of the long rest choose a weapon within 5 feet of you, it gains the following property for 24 hours:<ul><li><strong>Steady Grip.</strong> Once per turn, a creature can re-roll a natural 1 an attack roll with this weapon.</li></ul></li><li><strong>Sharpen Weapons.</strong> As part of a short or long rest, you can sharpen your party’s weapons if you have Smith’s Tools or Woodcarver’s Tools on hand. At the end of the rest choose up to three weapons within 5 feet of you, they gain the following property for 8 hours:<ul><li><strong>Sharpened.</strong> The next time this weapon deals damage, it deals an additional 1d4 damage. This effect can trigger a number of times equal to your proficiency bonus.</li></ul></li></ul>" },
		{ id: 3, title: 'Armorer', category: 'Feat', summary: 'Craft and maintain armor for your party.', content: "<h2>Armorer</h2><p><em>General Feat (Prerequisite: Level 4+, Intelligence or Wisdom 13+)</em></p><p>You gain the following benefits:</p><ul><li><strong>Ability Score Increase.</strong> Increase your Strength, Dexterity, Wisdom, or Intelligence by 1.</li><li><strong>Tools of the Trade.</strong> You gain proficiency with either Smith’s Tools or Leatherworker’s Tools. If you are already proficient with the chosen tools, you gain expertise with the chosen tools.</li><li><strong>Armor Crafter.</strong> When you craft a set of armor or a shield, you can halve the value of raw materials and the number of days required to make the item.</li><li><strong>Reinforce Armor.</strong> As part of a long rest, you can reinforce a set of armor if you have Smith’s Tools or Leatherworker’s Tools on hand. At the end of the long rest choose a set of armor that is within 5 feet of you, it gains the following property for 24 hours:<ul><li><strong>Reinforced.</strong> When a creature takes bludgeoning, piercing, or slashing damage while wearing this armor, they can reduce it by half of your proficiency bonus (rounded up).</li></ul></li><li><strong>Patch Armor.</strong> As part of a short or long rest, you can patch the damaged points of a few sets of armor or shields if you have Smith’s Tools or Leatherworker’s Tools on hand. At the end of the rest choose up to three sets of armor or shields within 5 feet of you, they gain the following property:<ul><li><strong>Patched Up.</strong> The next time a creature wearing this armor or wielding this shield takes damage, the damage is reduced by 1d4. This effect can trigger a number of times equal to your proficiency bonus.</li></ul></li></ul>" },
		{ id: 4, title: '
	]; */

	$scope.currentSort = 'title';
	$scope.reverseSort = false;

	$scope.setCurrentSort = function(sorter){
		if ($scope.currentSort === sorter) {
			$scope.reverseSort = !$scope.reverseSort;
		} else {
			$scope.currentSort = sorter;
			$scope.reverseSort = false;
		}
	}

	$scope.brews = [];
	$scope.categories = [];
	$scope.selectedGenre = '';
	$scope.selectedBrew = 0;
	$scope.newBrewTitle = "";
	$scope.newBrewCategory = "";
	$scope.newBrewContent = "";

	$scope.selectBrew = function(sid){
		$scope.selectedBrew = parseInt(sid);
	};
	
    $scope.getBrews = function() {
        const apiUrl = '/brews';
        
        console.log('Fetching brews from:', apiUrl);
        
        $http.get(apiUrl)
            .then(function(response) {
                console.log('API response:', response);
                if (response && response.data) {
                    $scope.brews = response.data;
                    console.log('Brews loaded:', $scope.brews.length, 'items');
                    
                    if ($scope.brews.length > 0) {
                        $scope.categories = [...new Set($scope.brews.map(brew => brew.category))];
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
    
    $scope.getBrews();
	
	$scope.nextId = $scope.brews.length+1;
	
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
			.then(function(response) {
				console.log('API response:', response);
				if (response && response.data) {
					console.log('Brew PUT successfully');
					$scope.nextId++;
					$scope.getBrews();
                } else {
                    console.error('Invalid response format:', response);
                }
            })
            .catch(function(error) {
                console.error('Error putting brew:', error);
            });
	}

});