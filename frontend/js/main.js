/**
 * Created by love on 09/02/15.
 */

//var getLoc = {};

/* Selectize */
//$(function() {
//    $('select').selectize(options);
//});

/* tangle */

Tangle.classes.ExpandingList = {
    initialize: function (element, options, tangle, variable) {
        var isExpanded = false;
        var items = options.items.split("/");

        var subelements = [];
        subelements.push(new Element("span", { text:"[ " }));
        items.each(function (item, index) {
            var itemElement = new Element("span", { "class":"ExpandingListItem", text:item });
            itemElement.onclick = function () { itemWasClicked(item); }
            subelements.push(itemElement);
            if (index < items.length - 1) {
                subelements.push(new Element("span", { text:", " }));
            }
        });
        subelements.push(new Element("span", { text:" ]" }));

        subelements.each(function (subelement) { subelement.inject(element, "bottom"); });

        function itemWasClicked (item) {
            isExpanded = !isExpanded;
            tangle.setValue(variable, item);
            update(element,item);  // update expanded, even if variable doesn't change
        }

        function update (element, value) {
            subelements.each(function (subelement) {
                var text = subelement.get("text");
                subelement.style.display = (isExpanded || text == value) ? "inline" : "none";
            });
        }
        this.update = update;
    }
};


function setUpTangle () {

    var element = document.getElementById("ggdataSelector");

    var tangle = new Tangle(element, {
        initialize: function () {
            this.ggdata = "diamonds";
        },
        update: function () {
            //var info = this.clothingInfoByType[this.ggdata];
            //this.clothingInstance = info.instance;
            //this.lowPrice = info.lowPrice;
            //this.highPrice = info.highPrice;
        }
        //clothingInfoByType: {
        //    hats: { instance:"hat", lowPrice:3, highPrice:20 },
        //    shirts: { instance:"shirt", lowPrice:9, highPrice:30 },
        //    pants: { instance:"pair of pants", lowPrice:30, highPrice:70 },
        //    shoes: { instance:"pair of shoes", lowPrice:40, highPrice:100 }
        //}
    });
}

window.addEvent('domready', function () {

    setUpTangle();
    //// Cookie example
    //var model = {
    //    initialize: function () {
    //        this.cookies = 3;
    //        this.caloriesPerCookie = 50;
    //        this.caloriesPerDay = 2100;
    //    },
    //    update: function () {
    //        this.calories = this.cookies * this.caloriesPerCookie;
    //        this.dailyPercent = (100 * this.calories / this.caloriesPerDay).toFixed(2);
    //    }
    //};
    //
    //var id = "cookieExample";
    //console.log(id);
    //var element = document.getElementById(id);
    //new Tangle(element,model);
    //
    //// ggplot example
    //var model = {
    //    initialize: function() {
    //        this.ggdata = "diamonds";
    //    },
    //    update: function() {
    //        this.dataset = this.ggdata;
    //    }
    //}
    //
    //var id = "ggdataToggle";
    //var element = document.getElementById(id);
    //new Tangle(element, model);

});

/* Send plot code to API */
$(function() {
    $("#plotbutton").on("click", function(e) {
        // Build ggplot command
        var plotcode = "ggplot(" +
            $("#ggdata").val() +
                ", aes(x=" +
                    $("#ggx").val() +
                    ")) + geom_density()"
            ;
        console.log(plotcode);

        e.preventDefault();
        $("#plotdiv").html("<code>Loading...</code>");

        var code = "parse(text = \"library(ggplot2);" + plotcode + "\");";
        console.log("Executing code: '" + code + "'");

        var response = $.ajax({
            type: "POST",
            url: "https://public.opencpu.org/ocpu/library/base/R/eval",
            data: {
                "expr": code
            },
            success: function(data, status, xhr) {
                var graphloc = xhr.getResponseHeader('Location') + "graphics/1/png";
                var tblloc = xhr.getResponseHeader('Location') + "stdout/text";
                console.log(tblloc);
                var img = $("<img />").attr('src', graphloc)
                    //var tbl = $("<")
                    .load(function() {
                        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                            alert('broken image!');
                        } else {
                            $("#plotdiv").html(img);
                        }
                    });
            },
            fail: function() {
                $("#plotdiv").html("<code>Error: Could not load image. <br/> TODO: fetch headers from request for debugging.</code>");
            }
        });
    });

    // Activate plot on page load
    // $("#plotbutton").trigger("click");
});
