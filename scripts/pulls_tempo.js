var m = {top: 50, right: 150, bottom: 100, left: 150},
	h = 500 - m.top - m.bottom,
	w = 1200 - m.left - m.right,
	barwidth = 5;


function pullsPorLinguagem() {
		var dataset = null;

		var lang = document.getElementById("lang").value;

		// Caso de contorno
		if (lang == "")
			return;

		d3.selectAll("svg > *").remove(); // Limpa plot anterior

		var arquivo =  "./github/repositories_stats.csv";

		d3.csv(arquivo, function(error, data) {

			if (error)
				return console.log(error);

			var repos_years = [];
			var total_repos = 0;

			// Totaliza número de projetos por ano
			for (var i = 0; i < data.length; i++) {
				// Retorna dados apenas para a linguagem desejada
				if (data[i]['language'] == lang) {
					year = data[i]['year'];
					num_repos = parseInt(data[i]['repositories']);
					num_issues = parseInt(data[i]['num_issues']);
					num_pulls = parseInt(data[i]['pull_requests']);
					total_repos += num_repos;

					repos_years.push({
						year: year,
						repos: num_repos,
						num_issues: num_issues,
						num_pulls: num_pulls,
						issues: (num_issues/num_repos),
						pulls: (num_pulls/num_repos)
					});
				}
			}

			// Ordena vetor pelo ano
			repos_years.sort(function(a, b) {
				if (a.year < b.year) return 1;
				if (a.year > b.year) return -1;
				else return 0;
			}).reverse();

			dataset = data;
			data = repos_years;

			// Eixos e escalas
			var xScale = d3.scale.ordinal().rangeRoundBands([0, w], 0.15);
			xScale.domain(data.map(function(x) { return x.year; }));

			var yhist = d3.scale.linear()
								.domain([0, d3.max(data, function(x) { return x.pulls; })])
								.range([h, 0]);

			var ycum = d3.scale.linear().domain([0, 1]).range([h, 0]);

			var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient('bottom');

			var yAxis = d3.svg.axis()
							.scale(yhist)
							.tickFormat(function(d){ return d; })
							.orient('left');

			// Caixa de informações
			var div = d3.select("body").append("div")
						.attr("class", "tooltip")
						.style("opacity", 0);

			// Plota svg
			var svg = d3.select("#chart").append("svg")
						.attr("width", w + m.left + m.right)
						.attr("height", h + m.top + m.bottom)
						.append("g")
						.attr("transform", "translate(" + m.left + "," + m.top + ")");

			var guide = d3.svg.line()
						.x(function(x) { return xScale(x.year) + (xScale.rangeBand() / 2); })
						.y(function(x) { return yhist(x.pulls) });

			var line = svg.append('path')
						.datum(data)
						.attr('d', guide(data))
						.attr('class', 'line');

			// Plota pontos sobre a linha
			svg.selectAll("dot")
				.data(data)
				.enter().append("circle")
				.attr("r", 4.5)
				.attr("class", "dot")
				.attr("cx", function(x) { return xScale(x.year) + (xScale.rangeBand() / 2); })
				.attr("cy", function(x) { return yhist(x.pulls); })
				.on("mouseover", function(x) {
								div.transition()
								.duration(200)
								.style("opacity", .9);

								div.html("<b>" + (lang) + ' - ' + (x.year)
										+ "</b><br/>"
										+ "Número de repositórios: " + x.repos.toLocaleString('pt-BR') + "<br/>"
										+ "Número de pull requests: " + x.num_pulls.toLocaleString('pt-BR') + "<br/>"
										+ "Pull requests por repositório: " + (x.pulls).toFixed(2))
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY + 10) + "px");
							})
				.on("mouseout", function(x) {
								div.transition()
								.duration(500)
								.style("opacity", 0);
							});

			// Plota eixos
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + h + ")")
				.call(xAxis)
				.selectAll("text")
					.attr("y", 6)
					.attr("x", 5)
					.attr("dy", "1em")
					.style("font-size", "20px");

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - (m.left / 2))
				.attr("x", 0 - (h / 2))
				.attr("dy", ".1em")
				.style("text-anchor", "middle")
				.style("font-size", "20px")
				.text("Nº de pull requests por repositório");
		});
	}
