async function buildPlot() {
    console.log("Hello world");

    const data = await d3.json("my_weather_data.json");

    console.table(data);

    const dateParser = d3.timeParse("%Y-%m-%d");

    const xAccessor = (d) => dateParser(d.date);

    const yAccessor = (d) => d.temperatureMin;

    const zAccessor = (d) => d.temperatureHigh;
    // for encapsulating access to dataset.




    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")



    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);



    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,0]);

    const zScaler = d3.scaleLinear()
        .domain(d3.extent(data,zAccessor))
        .range([dimension.boundedHeight,0]);
    // scaler for temperature high.


    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);



    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));



    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("fill","none")
        .attr("stroke","black")


    //-----------Task 1---------------------

    var lineGenerator_TH = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => zScaler(zAccessor(d)));
    // x-axis for time
    // y-axis for temperatureHigh

    bounded.append("path")
        .attr("d",lineGenerator_TH(data))
        .attr("fill","none")
        .attr("stroke","red")
    // output the result.

    var axis_y_scale = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([dimension.height, 0]);

    var y_axis = d3.axisLeft()
        .scale(axis_y_scale);

    svg.append("g")
        .attr("transform", "translate(0, 10)")
        .call(y_axis);

    var axis_x_scale = d3.scaleLinear()
        .domain([0, dimension.width])
        .range([ 0, dimension.width]);

    // Add scales to axis
    var x_axis = d3.axisBottom()
        .scale(axis_x_scale);

    var xAxisTranslate = dimension.height-20;

    //Append group and insert axis
    svg.append("g")
        .attr("transform", "translate(0, " + xAxisTranslate  +")")
        .call(x_axis)

}



buildPlot();