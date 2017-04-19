// Import required mpdules
var https = require('https');
var fs = require('fs');

// One function that does everything. Takes in a page number and callback function to retrieve the data
function processOrder(page, callback) {

	// Options to call API
	var options = {
		host: "backend-challenge-fall-2017.herokuapp.com",
		path: "/orders.json",
		method: "GET"
	};

	// Specify which page number to access in the API (only 2 in this scenario)
	if (page != 0) {
		options.path = "/orders.json?page=" + page;
	}

	var body = "";

	// Request https
	var request = https.request(options, function(response) {

		// Add the data to body
		response.on('data', function(chunk) {
			body += chunk.toString('utf8');
		});

		response.on('end', function(chunk) {
			// Convert to JSON
			var json = JSON.parse(body);
			
			// Get the available cookies as an integer and the array of orders
			var availableCookies = parseInt(json.available_cookies);
			var orders = json.orders;

			// Initiate empty array for future unfulfilled orders
			var unfulfilled = [];

			// Set a new property of each order -> canFulfill to false to keep track of which orders were fulfilled
			for (var i = 0; i < orders.length; i++) {
				orders[i].canFulfill = false;
			} 

			// Index to keep track of the while loop so it doesnt exceed the number of orders
			var index = 0;
			while (availableCookies > 0 && index < orders.length) {

				// Initialize the most # of cookies and the index to its order to keep track of which order had the most orders
				var mostCookies = 0;
				var indexMostCookies = 0;

				// Each for loop will find the most cookie orders that HAVE NOT been fulfilled yet
				for (var i = 0; i < orders.length; i++) {
					let order = orders[i].products;

					// Check order 0 and order 1
					if (order[0].title == 'Cookie' && order[0].amount <= availableCookies && !orders[i].canFulfill) {
						if (parseInt(order[0].amount) > mostCookies) {
							mostCookies = parseInt(order[0].amount);
							indexMostCookies = i;
						}
					} else if (order[1].title == 'Cookie' && order[1].amount <= availableCookies && !orders[i].canFulfill) {
						if (parseInt(order[1].amount) > mostCookies) {
							mostCookies = parseInt(order[1].amount);
							indexMostCookies = i;
						}
					} 
				}

				// Subtract from the available cookies, set the fulfilled order to true, incremment index
				availableCookies -= mostCookies;
				orders[indexMostCookies].canFulfill = true;
				index++;

			}

			// For loop to append all the unfulfilled orders to the array
			for (var i = 0; i < orders.length; i++) {
				if (!orders[i].canFulfill) {
					unfulfilled += orders[i].id;
				}
			} 

			// Array.join method not working, so decided to create own string for array to look like output
			unfulfilledMessage = "[";
			for (var i = 0; i < unfulfilled.length; i++) {
				unfulfilledMessage += unfulfilled[i] + "";

				if (i < unfulfilled.length - 1) {
					unfulfilledMessage += ", "
				}
			}
			unfulfilledMessage += "]";

			// Result
			var message = {
				"remaining_cookies": availableCookies,
				"unfulfilled_orders": unfulfilledMessage
			};

			// Convert to JSON and callback
			message = JSON.stringify(message);
			callback(message);

		});

	});

	request.end();

}

// Sample test - simple console.log result
processOrder(0, function(data) {
	console.log(data);
});

