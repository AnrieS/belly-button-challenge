// Setting up the url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Promise pending
const dataPromise = d3.json(url)
console.log("Data Promise", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data){
    console.log(data);

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
    }

    // Initial rendering
    let initialSample = data.names[0];
    createBarChart(initialSample);
    createBubbleChart(initialSample);
    displayMetadata(initialSample);

    dropdownMenu.on("change", function(){
        let selectedSample = d3.select(this).property("value");
        optionChanged(selectedSample)
    })

    //Creating the barchart
    function createBarChart(sample) {

        // Sort the data and then select top 10 entries
        let sampleData = data.samples.find(sampleItem => sampleItem.id ===sample);
        console.log(sampleData);

        // Fetching the top 10 otu_ids
        let otuIds = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        console.log(otuIds);

        // Grabbing the values of the top10Data
        let sampleValues = sampleData.sample_values.slice(0,10).reverse();
        console.log(sampleValues);
        
        // Grabbing the labels from the top10Data
        let otulabels = sampleData.otu_labels.slice(0, 10).reverse();
        console.log(otulabels);

        // Creating the Trace data for the barchart
        let trace_data = {
            x: sampleValues,
            y: otuIds,
            text: otulabels,
            type: "bar",
            orientation: "h"
        };

        //layout of the barchart
        let bar_layout = {
            title: "Top 10 OTUs"
        }

        // Plotting the bar data
        Plotly.newPlot("bar", [trace_data], bar_layout);

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



