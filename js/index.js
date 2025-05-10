console.log("index.js loaded");

fetch("data/itineraries.json")
	.then((res) => {
		console.log("Fetch response:", res);
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} fetching itineraries.json`);
		}
		return res.json();
	})
	.then((trips) => {
		console.log("Parsed JSON:", trips);
		if (!Array.isArray(trips) || trips.length === 0) {
			console.warn("No trips found in JSON!");
		}
		const ul = document.getElementById("trip-list");
		trips.forEach((trip) => {
			console.log("trip:", trip);
			const li = document.createElement("li");
			li.innerHTML = `
        <a href="itinerary.html#${trip.id}">
          ${trip.title}
        </a>
        <small>(${trip.dates})</small>
      `;
			ul.appendChild(li);
		});
	})
	.catch((err) => {
		console.error("Error loading itineraries:", err);
		document.getElementById("trip-list").textContent = "Failed to load trips.";
	});
