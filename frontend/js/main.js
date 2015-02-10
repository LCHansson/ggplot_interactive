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
        //console.log(options);
        //console.log($("#ggdata").data("foo"));

        var isExpanded = false;
        var items = datasets;

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

Tangle.classes.TDropdown = {

    initialize: function (element, options, tangle, variable) {
        element.addEvent("click", function (event) {
            var keys = Object.keys(window.ggplot_docs[options.set]),
                position = keys.indexOf(tangle.getValue(variable));
            //console.log("keys: " + keys + ", options.set: " + options.set +
            //", position: " + position + ", variable: " + variable);
            var nextpos = position + 1 > keys.length - 1? position + 1 - keys.length : position + 1;
            tangle.setValue(variable, keys[nextpos]);
        });
    }
}



function setUpTangle () {

    var element = document.getElementById("gg_data");

    var tangle = new Tangle(element, {
        initialize: function () {
            this.ggdata = "diamonds";
            //console.log(this.ggdata);
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

    var element = document.getElementById("gg_geom");

    var tangle = new Tangle(element, {
        initialize: function () {
            this.gggeom = Object.keys(window.ggplot_docs.geom)[3];
            //console.log(this.gggeom);
        },
        update: function () {
            var geom = this.gggeom;
            var aesthetics = window.ggplot_docs.aesth
            console.log(geom);
        }
    });

    //var elements = document.getElementsByClassName("gggeom");
    //for (el in elements) {
    //    var tangle = new Tangle(el, {
    //        initialize: function () {
    //            this.geom = Object.keys(window.ggplot_docs.geom)[0];
    //            console.log("Set initial geom to " + Object.keys(window.ggplot_docs.geom)[0]);
    //        },
    //        update: function() {
    //
    //        }
    //    })
    //}
}

/* Send plot code to API */
$(function() {
    $.ajax({
        type: "GET",
        url: "./data/ggplot_docs.json",
        dataType: "json",
        success: function (response) {
            window.ggplot_docs = response;
            window.ggplot_docs.datasets = { "diamonds": null, "mtcars": null, "iris": null };
            //console.log("Loaded data; firing up Tangle");
            setUpTangle();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    $("#plotbutton").on("click", function(e) {
        // Build ggplot command
        var plotcode = $("#ggplotCode").text()
                //+
                //", aes(x=" +
                //    $("#ggx").val() +
                //    ")) + geom_density()"
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
