def 
d3.json(`/beerinfo`).get(function(beers){
    console.log(beers[0].name)
    var table = d3.select("#table");
//     Object.entries(beers).forEach(([key, value]) => {
//     var row = table.append("tr")
//     // row.append("td").text(`${key}`)
//     // row.append("td").text(`${value}`)

//     });
    var allinfo =[]
    var allinfo;
    var row;
    var name = []
    var ibu = []
    var color = []
    var abv = []
    var attenuation_level = []
    var tagline = []
    var food_pairings = []

    for(var i =0; i <beers.length;i++){
        var info = beers;
        allinfo = [info[0].name, info[0].ibu, info[0].color, info[0].abv,
            info[0].attenuation_level, info[0].tagline, info[0].food_pairings]
        name = info[0].name
        ibu = info[0].ibu
        color = info[0].color
        abv = info[0].abv
        attenuation_level = info[0].attenuation_level
        tagline = info[0].tagline
        food_pairings = info[0].food_pairings
    }
    
    for(var k =0; k < name.length; k ++){
        var n = name[k]
        var i = ibu[k]
        var c = color[k]
        var a = abv[k]
        var atten = attenuation_level[k]
        var t = tagline[k]
        var f = food_pairings[k]
        table.append("tr")
        table.append("td").text(n)
        table.append("td").text(i)
        table.append("td").text(c)
        table.append("td").text(a)
        table.append("td").text(atten)
        table.append("td").text(t)
        table.append("td").text(f)
        table.append("tr")
    }  
});

