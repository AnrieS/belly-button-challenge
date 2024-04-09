// Setting up the url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Promise pending
const dataPromise = d3.json(url)
console.log("Data Promise", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data){
    console.log(data);

    //Creating the barchart
    function createBarChart(sample) {
        // Select the top 10 OTUs for the selected sample
        let sampleData = data.samples.find(s => s.id === sample);
        let otuIds = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let sampleValues = sampleData.sample_values.slice(0, 10).reverse();
        let otuLabels = sampleData.otu_labels.slice(0, 10).reverse();

        // Create the trace for the bar chart
        let trace = {
            x: sampleValues,
            y: otuIds,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs"
        };

        // Plot the bar chart
        Plotly.newPlot("bar", [trace], layout);
    }

    // Creating the bubblechart
    function createBubbleChart(sample){
        let sampleData = data.samples.find(sampleItem => sampleItem.id === sample);

        const traceDataBubble = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
            }
        
        };

        // // Creating the layout for the bubble data
        let bubble_layout = {
            title: "OTU Bubble Chart",
            xaxis: {title: "OTU Id"},
            yaxis: {title: "Sample Value"}
        };

         // Pltting the bubble chart
        Plotly.newPlot("bubble", [traceDataBubble], bubble_layout);
    };


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

    function displayMetadata(sample) {
        let metadata = data.metadata.find(m => m.id == sample);
        let metadataPanel = d3.select("#sample-metadata");

        // Clear existing metadata
        metadataPanel.html("");

        // Append each key-value pair to the panel
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    }
    // Populate the dropdown menu with IDs
    const dropdownMenu = d3.select("#selDataset");
    data.names.forEach(sampleID => {
        dropdownMenu.append("option").text(sampleID).attr("value", sampleID);
    });

    // Handle dropdown change
    function optionChanged(sample) {
        console.log("Selected sample:", sample);
        createBarChart(sample);
        createBubbleChart(sample);
        displayMetadata(sample);
        createGaugeChart(sample);
    }

    // Initial rendering
    let initialSample = data.names[0];
    createBarChart(initialSample);
    createBubbleChart(initialSample);
    displayMetadata(initialSample);
    createGaugeChart(initialSample);

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



