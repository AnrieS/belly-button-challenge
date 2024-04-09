// Setting up the url

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
    

    function createGaugeChart(sample) {
        let sampleData = data.metadata.find(metadata => metadata.id == sample);
        let washingFrequency = sampleData.wfreq;
    
        // Create the gauge chart data
        let gaugeData = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: washingFrequency,
                title: { text: "Washing Frequency", font: { size: 24 } },
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "darkblue" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 1], color: "rgb(248, 243, 236)" },
                        { range: [1, 2], color: "rgb(244, 241, 229)" },
                        { range: [2, 3], color: "rgb(233, 230, 202)" },
                        { range: [3, 4], color: "rgb(229, 231, 179)" },
                        { range: [4, 5], color: "rgb(213, 228, 157)" },
                        { range: [5, 6], color: "rgb(183, 204, 146)" },
                        { range: [6, 7], color: "rgb(140, 191, 136)" },
                        { range: [7, 8], color: "rgb(138, 187, 143)" },
                        { range: [8, 9], color: "rgb(133, 180, 138)" }
                    ]
                }
            }
        ];
    
        // Set up the layout for the gauge chart
        let gaugeLayout = {
            width: 400,
            height: 300,
            margin: { t: 0, b: 0 }
        };
    
        // Plot the gauge chart
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    }
    
    console.log("Bonus file Hello World");
    // Initial rendering
    let initialSample = data.names[0];
    createGaugeChart(initialSample);

    data.names.forEach(sampleID => {
        dropdownMenu.append("option").text(sampleID).attr("value", sampleID);
    });

    function optionChanged(sample) {
        createGaugeChart(sample);
        console.log("selected Sample from bonus:", sample);
    }

    dropdownMenu.on("change", function(){
        let selectedSample = d3.select(this).property("value");
        optionChanged(selectedSample)
    })

    function metaData(demographicInfo) {
        let demoSelect = d3.select("#sample-metadata");

        demoSelect.html(
            `id: ${demographicInfo.id} <br> 
          ethnicity: ${demographicInfo.ethnicity} <br>
        gender: ${demographicInfo.gender} <br>
        age: ${demographicInfo.age} <br>
        location: ${demographicInfo.location} <br>
        bbtype: ${demographicInfo.bbtype} <br>
        wfreq: ${demographicInfo.wfreq}`
        );
    }
});
