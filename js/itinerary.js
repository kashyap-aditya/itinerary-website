// 1. Figure out which trip to show
const tripId = location.hash.slice(1);
if (!tripId) {
	document.getElementById("itinerary").textContent = "No trip selected.";
	throw new Error("no id");
}

// 2. Fetch its data
fetch(`data/${tripId}.json`)
	.then((r) => r.json())
	.then((data) => {
		document.title = data.title;
		const article = document.getElementById("itinerary");
		article.innerHTML = `<h1>${data.title}</h1>
                         <p><em>${new Date(
														data.date
													).toLocaleDateString()}</em></p>`;
		const tpl = document.getElementById("section-tpl");

		data.sections.forEach((sec) => {
			const clone = tpl.content.cloneNode(true);
			clone.querySelector(".heading").textContent = sec.heading;
			const ul = clone.querySelector(".items");
			sec.items.forEach((item) => {
				const li = document.createElement("li");
				li.textContent = item;
				ul.appendChild(li);
			});
			article.appendChild(clone);
		});
	})
	.catch((err) => {
		console.error(err);
		document.getElementById("itinerary").textContent =
			"Failed to load itinerary.";
	});
