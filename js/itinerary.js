console.log("itinerary.js loaded");

const root = document.getElementById("itinerary-root");
const id = location.hash.slice(1);
if (!id) {
	root.textContent = "No trip selected.";
	throw new Error("No itinerary ID");
}

fetch(`data/${id}.json`)
	.then((res) => {
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return res.json();
	})
	.then((data) => {
		document.title = data.header.title + " - Itinerary";

		// Header
		const hdr = document.createElement("header");
		hdr.innerHTML = `<h1>${data.header.title}</h1>
                     <h3>${data.header.subtitle}</h3>`;
		document.body.insertBefore(hdr, root);

		// Nav
		const nav = document.createElement("nav");
		nav.innerHTML = data.navLinks
			.map((ln) => `<a href="${ln.href}">${ln.text}</a>`)
			.join("");
		document.body.insertBefore(nav, root);

		// Container
		const cont = document.createElement("div");
		cont.className = "container";
		root.appendChild(cont);

		// Summary Table
		const sumSec = document.createElement("div");
		sumSec.className = "section";
		sumSec.innerHTML = `<h2>Trip Summary</h2>
      <table class="styled-table">
        <thead>
          <tr>${data.summaryTable.headers
						.map((h) => `<th>${h}</th>`)
						.join("")}</tr>
        </thead>
        <tbody>
          ${data.summaryTable.rows
						.map(
							(row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`
						)
						.join("")}
        </tbody>
      </table>
	  <iframe src="${data.mapEmbedUrl}"
			allow="fullscreen"
			allowfullscreen
			loading="lazy"
		></iframe>
	  `;

		cont.appendChild(sumSec);

		// Sections
		data.sections.forEach((sec) => {
			const s = document.createElement("div");
			s.className = "section";
			s.id = sec.id;
			s.innerHTML = `<h2>${sec.heading}</h2>
        <div class="carousel">
          ${sec.carousel
						.map(
							(f) =>
								`<figure><img src="${f.img}" alt="${f.caption}" loading="lazy" /><figcaption>${f.caption}</figcaption></figure>`
						)
						.join("")}
        </div>
        ${
					sec.paragraphs
						? sec.paragraphs.map((p) => `<p>${p}</p>`).join("")
						: ""
				}
        ${
					sec.listItems
						? `<ul>${sec.listItems.map((li) => `<li>${li}</li>`).join("")}</ul>`
						: ""
				}
        ${
					sec.callouts
						? sec.callouts
								.map(
									(c) => `<div class="callout ${c.type}">
            <strong>${c.title}</strong>
            <ul>${c.items.map((it) => `<li>${it}</li>`).join("")}</ul>
          </div>`
								)
								.join("")
						: ""
				}`;
			cont.appendChild(s);
		});

		// Driving Schedule
		const drv = document.createElement("div");
		drv.className = "section";
		drv.id = "driving";
		drv.innerHTML = `<h2>🚗 Driving Schedule</h2>
      <table class="styled-table">
        <thead>
          <tr>${data.drivingSchedule.headers
						.map((h) => `<th>${h}</th>`)
						.join("")}</tr>
        </thead>
        <tbody>
          ${data.drivingSchedule.rows
						.map(
							(row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`
						)
						.join("")}
        </tbody>
      </table>
      <div id="schedule-lightbox" class="lightbox">
        <figure>
          <img src="${data.lightbox.lightboxImg}" alt="" />
          <figcaption>
            ${data.lightbox.lightboxCaption}
            <a href="#" style="margin-left:1em;color:white">× Close</a>
          </figcaption>
        </figure>
      </div>
      <div class="note">
        <figure>
          <a href="#schedule-lightbox" id="zoom-trigger">
            <img src="${data.lightbox.triggerImg}" alt="" />
          </a>
          <figcaption>${data.lightbox.triggerCaption}</figcaption>
        </figure>
      </div>`;
		cont.appendChild(drv);

		// Lightbox behavior
		(function initLightbox() {
			const lightbox = document.getElementById("schedule-lightbox");
			const trigger = document.getElementById("zoom-trigger");
			trigger.addEventListener("click", (e) => {
				e.preventDefault();
				lightbox.classList.add("open");
			});
			lightbox.addEventListener("click", (e) => {
				if (!e.target.closest("figure")) {
					lightbox.classList.remove("open");
				}
			});
			document.addEventListener("keydown", (e) => {
				if (
					(e.key === "Escape" || e.key === " ") &&
					lightbox.classList.contains("open")
				) {
					lightbox.classList.remove("open");
				}
			});
		})();
	})
	.catch((err) => {
		console.error("Error loading itinerary:", err);
		root.textContent = "Failed to load itinerary.";
	});
