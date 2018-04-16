var http = require('http');
var server = http.createServer();
var fs = require('fs');



var gebauede;
fs.readFile(__dirname+"/staedte.json", function(err,data){
 gebauede = JSON.parse(data);
for(var i=0; i<name.country.population;i++){
    console.log("Name: "+country.population[i].name);
    console.log("Country: "+name.population[i].country);
    console.log("Population: "[i].population);
    console.log("-----------------------------");

}


});
