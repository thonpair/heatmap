fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => {
        const baseTemperature = data.baseTemperature
        const colors = [
            "#3393ff", //blue
            "#ffffff", //white
            "#d2ff4f", //yellow
            "#ffaa4f", //orange
            "#ff4a4a" //red
        ]
        d3.select('#app')
            .append('h1')
            .text("Monthly Global Land-Surface Temperature")
            .attr('id', 'title')

        d3.select('#app')
            .append('h2')
            .text("Base Temperature : " + baseTemperature + "°C")
            .attr('id', 'description')

            let tooltip = d3
            .select('#app')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        const yearsUnique = []
        data.monthlyVariance.map(item => {
            if (yearsUnique.indexOf(item.year) === -1) {
                yearsUnique.push(item.year)
            }
        })
        const years = yearsUnique.map(year => {
            return new Date(Date.UTC(year, 0, 1, 0, 0, 0))
        })

        const months = []
        for (let i=0; i< 12; i++){
            months.push(new Date(Date.UTC(1970,i)))
        }

        const cellWidth = 5;
        const cellHeight = 30;
        const width = years.length * cellWidth;
        const height = 13 * cellHeight;
        const marginWidth = 100;
        const marginHeight = 12 * 5;

        let svgContainer = d3
            .select('#app')
            .append('svg')
            .attr('width', width + marginWidth)
            .attr('height', height + marginHeight)
            .attr('class', "svgContainer");


        const xScale = d3.scaleTime()
            .domain([d3.min(years), d3.max(years)])
            .range([0, width])

        let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%Y'));

        svgContainer
            .append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', `translate(${marginWidth},423)`)

        const yScale = d3.scaleTime()
        .domain([d3.min(months), d3.max(months)])
        .range([0, height])


        const yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.timeFormat('%B'));

        svgContainer
            .append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', `translate(${marginWidth},33)`)

        d3.select('svg')
        .selectAll('rect')
        .data(data.monthlyVariance)
        .enter()
        .append('rect')
        .attr('x',d => marginWidth+ xScale(new Date(Date.UTC(d.year, 0, 1, 0, 0, 0))))
        .attr('y',(d => yScale(new Date(Date.UTC(1970, d.month, 1, 0, 0, 0)))))
        .attr('height',cellHeight)
        .attr('width', cellWidth)
        .attr('class','cell')
        .attr('data-month', d=> d.month -1 )
        .attr('data-year', d=> d.year)
        .attr('data-temp', d=> baseTemperature + d.variance)
        .attr('fill', d=> d.variance < -0.5
                        ? colors[0] 
                        : d.variance < 0
                            ? colors[1]
                            : d.variance < 0.5
                                ? colors[2]
                                : d.variance < 1
                                    ? colors[3]
                                    : colors[4]
                            
            )
            .on('mouseover', (d, i) => {
                tooltip
                    .html("Year : " + i.year + "<br/>" +
                        "month : " + i.month + "<br/>" +
                        "variance : " + i.variance + "<br/>" +
                        "temperature : " + eval(baseTemperature + i.variance) + "<br/>"
                    )
                    .attr('all', JSON.stringify(i))
                    .attr('data-year', i.year)
                    .style('left', d.clientX + 'px')
                    .style('top', height - 100 + 'px')
                    .style('transform', 'translate('+d.clientX+'px, '+d.clientY+'px)')
                    .style('opacity', 0.9);
            })
            .on('mouseout', function () {
                tooltip.style('opacity', 0);
            });










            const legend = d3.select("#app")
            .append('div')
            .attr('id', 'legend')
            .text('Legend : ')

            const svglegend = legend
            .append('svg')
            .attr("height", 25)
            .attr("width", 300)

            svglegend 
            .selectAll('rect')
            .data(colors)
            .enter()
            .append("rect")
            .attr("x", (d,i) => i*25)
            .attr("y", 0)
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", d =>d)
    
    })