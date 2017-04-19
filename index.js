var https = require('https');

function getJSON(page, callback) {

	var options = {
		host: "backend-challenge-fall-2017.herokuapp.com",
		path: "/orders.json",
		method: "GET"
	};

	if (page != 0) {
		options.path = "/orders.json?page=" + page;
	}

	var body = "";

	var request = https.request(options, function(response) {

		response.on('data', function(chunk) {
			body += chunk.toString('utf8');
		});

		response.on('end', function(chunk) {
			var json = JSON.parse(body);
			
			var availableCookies = parseInt(json.available_cookies);
			var orders = json.orders;

			var unfulfilled = [];

			for (var i = 0; i < orders.length; i++) {
				let order = orders[i].products;
				order.canFulfill = true;

				if (order[0].Cookie <= availableCookies) {
					availableCookies -= order[0].Cookie;
				} else if (order[1].Cookie <= availableCookies) {
					availableCookies -= order[1].Cookie;
				} else {
					order.canFulfill = false;
				}
			}

			for (var i = 0; i < orders.length; i++) {
				let order = orders[i].products;
				if (!order.canFulfill) {
					unfulfilled += orders[i].id;
				}
			} 

			var message = {
				"remaining_cookies": availableCookies,
				"unfulfilled_orders": unfulfilled
			};

			JSON.stringify(message);
			callback(message);
		});

	});

	request.end();

}

getJSON(0, function(data) {
	console.log(data);
});

