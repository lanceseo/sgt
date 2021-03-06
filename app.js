/* v5 - Angular with Firebase (AngularFire) + additional functionalities
> top/low grade highlighting, sorting, course autocomplete */

/***** Student Grade Table core operation app *****/
var app = angular.module('sgtapp',['firebase']);

// Data controller
app.controller('dataController', ['firebaseOper', 'gradeAvg', '$scope', function(firebaseOper, gradeAvg, $scope){
	var self = this;
	this.sArray = [];
	this.gAverage = 0;
	this.sOrderBy = null;
	this.newID = function() {
        if (self.sArray.length > 0) {
            return self.sArray[self.sArray.length-1].id+1;
        } else {
            return 1;
        }
    };
	this.getData = function() {
		self.sArray = firebaseOper.getData();
		self.markMaxMin();
		console.log("self.sArray: ", self.sArray);
		self.gAverage = gradeAvg.calcAvg(self.sArray);
	};
	this.addData = function(sname, scourse, sgrade) {		
		var newStudent = {};
		newStudent.id = self.newID();
		newStudent.name = sname;
		newStudent.course = scourse;
		newStudent.grade = parseInt(sgrade);
		firebaseOper.addData(newStudent);
		self.getData();
		self.clearInputs();
	};
	this.deleteData = function(sid) {
		for (var i=0; i<self.sArray.length; i++) {
			if (self.sArray[i].id === parseInt(sid)) {
				firebaseOper.removeData(i);
				self.getData();
				return;
			} else if (i === self.sArray.length-1) {
				console.log('ID not found');
			}
		}
	};

	this.markMaxMin = function() {
		var gradeArray = self.sArray.map(function(obj){
			return obj.grade;
		});		
		var maxVal = Math.max.apply(null, gradeArray); //Find max grade
		var minVal = Math.min.apply(null, gradeArray); //Find min grade		
		for (var i=0; i<self.sArray.length; i++) { //Loop through the object to add max/min property
			if(self.sArray[i].grade === maxVal) {
				self.sArray[i].max = true;
			} else if (self.sArray[i].grade === minVal) {
				self.sArray[i].min = true;
			}
		}
	};

	this.orderData = function(orderName) {
		self.sOrderBy = orderName;
	};

	this.clearInputs = function() {
		$scope.sname = null;
		$scope.scourse = null;
		$scope.sgrade = null;
	};
	this.clearPage = function() {
		$("tbody").empty();
	};
}]);

// CRUD for Firebase
app.service('firebaseOper', ['$firebaseArray', function($firebaseArray) {
	var self = this;
	var Ref = new Firebase("https://ls-sgt.firebaseio.com/sgt1");
	this.dbArray = $firebaseArray(Ref);
	this.getData = function() {
		console.log('retrieved');
		return self.dbArray;
	};
	this.addData = function(sArray) {
		self.dbArray.$add(sArray);
		console.log('added');
	};
	this.removeData = function(sid) {
		self.dbArray.$remove(sid);
		console.log('removed');
	}
}]);

// Grade average calculator
app.service('gradeAvg', function() {
    this.calcAvg = function(sArray) {
	    var gradeTotal = null;
	    for (var i=0; i<sArray.length; i++) {
	        gradeTotal += parseInt(sArray[i].grade);
	    }
	    return parseInt((gradeTotal / sArray.length));
	};
});


// Input validation
/*app.service('inputCheck', function() {
	var self = this;
	this.expName = /^[\p{L}\s'.-]+$/;
	this.expCourse = /^[A-Za-z0-9\s-]+$/;

	this.checkName = function(input) {
		console.log(self.expName.test(input));
		return self.expName.test(input);
	};
	this.checkCourse = function(input) {
		return self.expCourse.test(input);
	};
	this.checkGrade = function(input) {
		if (parseInt(input) >= 0 && parseInt(input) <= 100) {
			return true;
		}
		return false;
	};
});*/

// CRUD operation using browser's Local Storage
/*app.service('storageOper', function() {
	var locStorage = localStorage;
	this.getStorage = function() {
		console.log(JSON.parse(locStorage.getItem('sData')));
		return JSON.parse(locStorage.getItem('sData'));
	};
	this.setStorage = function(sArray) {
		locStorage.setItem('sData', JSON.stringify(sArray));
		console.log('localStorage Set');
	};
	this.removeStorage = function() {
		locStorage.removeItem('sData');
		console.log('localStorage wiped');
	};
});*/



