window.onload = function() {
	// Global Variables
	const html = document.getElementsByTagName("html")[0];
	const API = 'https://restcountries.eu/rest/v2/';
	let countries = [];
	// Toggle Theme
	const themeButton = document.getElementById("toggleTheme");
	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
	const currentTheme = localStorage.getItem("theme");

	init();

	function init() {
		// Check current theme and apply
		if (currentTheme === "dark") {
			html.classList.toggle("dark-theme");
			themeButton.innerText = "Light Mode";
		} else if (currentTheme === "light") {
			html.classList.toggle("light-theme");
			themeButton.innerText = "Dark Mode";
		}
		// Get All Countries
		fetch(`${API}all`, {
			headers: {'Content-Type': 'application/x-www-form-urlencoded'
			},})
			.then(response => response.json())
			.then( data => {
				countries = data;
				constructCountryComponent(countries);
			})
			.catch(err => console.log(err));
	}
	// construct country component
	function constructCountryComponent(data) {
		const countriesWrapper = document.getElementById('countries');
		let countriesGrid = document.getElementById('countriesGrid');
		// check to see if country card div exists
		// if so delete element
		if(countriesGrid) {
			countriesGrid.remove();
		}
		countriesGrid = document.createElement('div');
		countriesGrid.setAttribute('id', 'countriesGrid');
		countriesGrid.setAttribute('class', 'countries-grid');
		data.map((country,index) => {
			const countryDiv = document.createElement('div');
			countryDiv.setAttribute('class','country-card');
			countryDiv.setAttribute('data-id', country.name);
			if (index > 4) {
				countryDiv.setAttribute('data-aos', "fade-down");
				countryDiv.setAttribute('data-aos-easing', "linear");
				countryDiv.setAttribute('data-aos-duration', "1000");
			}
			// Flag
			let flag = document.createElement('img');
			flag.setAttribute('src', country.flag);
			flag.setAttribute('alt', country.name);
			// Country Content Div
			const contentDiv = document.createElement('div');
			contentDiv.setAttribute('class', 'content');
			// Country Name
			const title = document.createElement('h3');
			title.innerText = country.name;
			contentDiv.appendChild(title);
			// Country Population
			const population = document.createElement("p");
			population.innerHTML = `<strong>Population: </strong>${country.population}` ;
			contentDiv.appendChild(population);
			// Country Region
			const region = document.createElement('p');
			region.innerHTML = `<strong>Country: </strong>${country.region}`;
			contentDiv.appendChild(region);
				// Country Capital
			const capital = document.createElement('p');
			capital.innerHTML = `<strong>Capital: </strong>${country.capital}` ;
			contentDiv.appendChild(capital);

			// Append Children to Parent
			countryDiv.appendChild(flag);
			countryDiv.appendChild(contentDiv);
			countriesGrid.appendChild(countryDiv);
		})

		countriesWrapper.appendChild(countriesGrid);
	}


	// Search Input Change Handler
	const searchInput = document.getElementById('searchInput');
	searchInput.addEventListener('input', function (event) {
        if(event.target.value && event.target.value !== "") {
        	const searchTerm = event.target.value.toLowerCase();
        	const filteredData = countries.filter(country => country.name.toLowerCase().includes(searchTerm));
        	if(filteredData) {
        		constructCountryComponent(filteredData);
	        }
        } else {
	        constructCountryComponent(countries);
        }
	})
	// Region Filter Change Handler
	const filter = document.getElementsByClassName('select-items')[0];
	filter.addEventListener('click', function(event){
		if(event.target.innerText && event.target.innerText !== "Reset") {
			const filter = event.target.innerText.toLowerCase();
			const filteredData = countries.filter(country => country.region.toLowerCase() === filter);
			if(filteredData) {
				constructCountryComponent(filteredData);
			}
		} else {
			constructCountryComponent(countries);
		}
	})

	// get country details
	const gridItem = document.getElementById('countries');
	gridItem.addEventListener('click',function(event) {
		if(event.target && event.target.hasAttribute('data-id')) {
			const currentTarget = event.target.getAttribute('data-id');
			const countryDetails = countries.find(country => country.name === currentTarget);
			if(countryDetails) {
				const countryDetailsDiv = document.getElementById('countryDetails');
				countryDetailsDiv.setAttribute('class', 'country-details');

				//country container
				const countryContainer = document.createElement('div');
				countryContainer.setAttribute('class', 'country-container');

				// Back Button
				const backButton = document.createElement('button');
				backButton.innerHTML = `<i class="fas fa-arrow-left"></i>  Back`;
				backButton.setAttribute('class', 'back-btn');
				backButton.addEventListener('click', function(event) {
					html.classList.remove('video-details-open');
					countryDetailsDiv.classList.remove('country-details');
					countryDetailsDiv.innerHTML = " ";
				})
				countryContainer.appendChild(backButton);
				// Country Details wrapper
				const countryDetailsWrapperDiv = document.createElement('div');
				countryDetailsWrapperDiv.setAttribute('class','video-details-wrapper');

				// Country Flag
				const flag = document.createElement('img');
				flag.setAttribute('src', countryDetails.flag);

				// Country Details
				const contentDiv = document.createElement('div');
				contentDiv.setAttribute('class', 'content');
				// Title
				const title = document.createElement('h2');
				title.innerText = countryDetails.name;

				// Border Countries
				const borders = document.createElement('div');
				borders.setAttribute('class', 'borders');
				// border title
				const bordersTitle = document.createElement('span');
				bordersTitle.innerHTML = '<strong>Border Countries: </strong>'
				borders.appendChild(bordersTitle);
				countryDetails["borders"].map(border => {
					 const borderDiv = document.createElement('div');
					 borderDiv.innerText = border
					 borderDiv.setAttribute('class', 'border');
					 borders.appendChild(borderDiv);
				})

				//Country Info
				const countryInfoDiv = document.createElement('div');
				countryInfoDiv.setAttribute('class', 'country-info');

				//Country LHS
				const infoLHS = document.createElement('div');
				infoLHS.setAttribute('class', 'info-lhs');
				// Native Name
				const nativeName = document.createElement('span');
				nativeName.innerHTML = `<strong>Native Name : </strong> ${countryDetails.nativeName}`;
				// Population
				const population = document.createElement('span');
				population.innerHTML = `<strong>Population : </strong> ${countryDetails.population}`
				// Region
				const region = document.createElement('span');
				region.innerHTML = `<strong>Region : </strong> ${countryDetails.region}`
				// Sub Region
				const subRegion = document.createElement('span');
				subRegion.innerHTML = `<strong>Sub Region : </strong> ${countryDetails.subregion}`
				// Capital
				const capital = document.createElement('span');
				capital.innerHTML = `<strong>Capital : </strong> ${countryDetails.capital}`



                 infoLHS.appendChild(nativeName);
				 infoLHS.appendChild(population);
				 infoLHS.appendChild(region);
				 infoLHS.appendChild(subRegion);
				 infoLHS.appendChild(capital);
				//Country RHS
				const infoRHS = document.createElement('div');
				infoRHS.setAttribute('class', 'info-rhs');
				// Domain
				const domain = document.createElement('span');
				domain.innerHTML = `<strong>Top Level Domain : </strong> ${countryDetails.topLevelDomain[0]}`;
				// currency
				const currency = document.createElement('span');
				currency.innerHTML = `<strong>Currencies : </strong> ${countryDetails.currencies[0].name}`
				// Languages
				const languages = document.createElement('span');
				languages.innerHTML = `<strong>Languages : </strong> ${countryDetails.languages[0].name}`

				infoRHS.appendChild(domain);
				infoRHS.appendChild(currency);
				infoRHS.appendChild(languages);

				countryInfoDiv.appendChild(infoLHS);
				countryInfoDiv.appendChild(infoRHS);


				//add Title and other content to Content Div
				contentDiv.appendChild(title);
				contentDiv.appendChild(countryInfoDiv);
				contentDiv.appendChild(borders);



				countryDetailsWrapperDiv.appendChild(flag);
				countryDetailsWrapperDiv.appendChild(contentDiv);
				countryContainer.appendChild(countryDetailsWrapperDiv);
				countryDetailsDiv.appendChild(countryContainer);
				html.classList.toggle('video-details-open');
			}

		}
	})

	// Toggle Themes Button handler
	themeButton.addEventListener('click', function() {
		// Then toggle (add/remove) the .dark-theme class to the body
		let theme = "";
		if (prefersDarkScheme.matches) {
			html.classList.toggle("light-theme");
			theme = html.classList.contains("light-theme")
				? "light"
				: "dark";
		} else {
			html.classList.toggle("dark-theme");
			theme = html.classList.contains("dark-theme")
				? "dark"
				: "light";
		}

		if(html.classList.contains('dark-theme')) {
			themeButton.innerText = "Light Mode";
		} else {
			themeButton.innerText = "Dark Mode";
		}

		localStorage.setItem("theme", theme);
	})
};