/**
 * Created by love on 09/02/15.
 */


function addDialog(options) {

}

function setupggDOM (data) {
    // Set up data
    var interactive_elements = $(".interactive");


    /* DATASET */
    // Loop through all elements and assign them with reasonable properties and onClick behaviour
    $(".data").data("allowed_datasets", Object.getOwnPropertyNames(data.datasets));
    console.log($(".data").data("allowed_datasets"));

    // Cycle through datasets
    // TODO: Maybe replace with selection menu later?
    $(".data").click(function() {
        console.log("You have clicked a data set name.");
        var current_data = $(this).text(),
            data_pos = $(this).data("allowed_datasets").indexOf(current_data),
            next_pos = data_pos + 1 > $(this).data("allowed_datasets").length - 1
                ? data_pos + 1 - $(this).data("allowed_datasets").length
                : data_pos + 1,
            next_data = $(this).data("allowed_datasets")[next_pos];

        $(this).text(next_data);

        // TODO:
        // - cycleAllAesUsingThisData();
        // - or: invalidatePlotButtonAndUnderlineFaultyElements();
    });


    /* PARAMETERS */
    $(".parameter").click(function() {
        console.log("You have clicked an aes parameter.");
        // Get scope
        var parent = $(this).parents(".scope");
        if (parent.attr('class') != "scope") {
            console.log("Something appears to be wrong with the DOM; was really expecting the parent of this element to be a '<span class=\"scope\">'...");
            return;
        };
        var scope = parent.attr('id');

        if (scope == "canvas") {
            var active_geoms = $(".geom .element-name").text(),
                allowed_aes = data.geom[active_geoms].aesthetics;
            // TODO:
            // - allowed_aes = active_geoms.forEach(function(x) { return data.geom[x].aesthetics; });
        } else {
            //    TODO:
            //    - getLocallyScopedElement();
            //    - getAllowedAes();
        }

        //console.log("attr('data-type'): " + $(this).attr('data-type'));

        var current_aesthetic = $(this).text(),
            name_pos = allowed_aes.indexOf(current_aesthetic),
            next_pos = name_pos + 1 > allowed_aes.length - 1
                ? name_pos + 1 - allowed_aes.length
                : name_pos + 1,
            next_name = allowed_aes[next_pos];

        console.log("Active geoms: " + active_geoms + "\n\tAllowed aesthetics: " + allowed_aes + "\n\tCurrent aesthetic: " + current_aesthetic+ "\n\tNext name: " + next_name);

        $(this).text(next_name);

        // TODO:
        // - modifyAesArgument();

        //current_name = $(this).text(),
        //name_pos = data_names.indexOf(current_name),
        //next_pos = name_pos + 1 > data_names.length - 1
        //    ? name_pos + 1 - data_names.length
        //    : name_pos + 1,
        //next_name = data_names[next_pos];

        //console.log("You have clicked an aes attribute that is a variable name.\n\tCurrent dataset: " + active_dataset + "\n\tAvailable names: " + data_names + "\n\tCurrent name: " + current_name  + "\n\tNext name: " + next_name);
        //$(this).text(next_name);
        //console.log("Active geoms: " + active_geoms + "\n\tAllowed aesthetics: " + allowed_aes);
        //}
        //}

    });


    /* ARGUMENTS */
    $(".argument").click(function() {
        // Get scope
        var parent = $(this).parents(".scope");
        if (parent.attr('class') != "scope") { return; };
        var scope = parent.attr('id');

        // If parent is aes, make aes modifications.
        if ( $(this).parent().attr('class') == 'aes') {
            // Scope is global ('canvas')
            if (scope == "canvas") {
                if ($(this).attr('data-type') == "varname") {
                    // getDataset();
                    var active_dataset = $(this).parents(".scope").find(".data").text(),
                        data_names = data.datasets[active_dataset],
                        current_name = $(this).text(),
                        name_pos = data_names.indexOf(current_name),
                        next_pos = name_pos + 1 > data_names.length - 1
                            ? name_pos + 1 - data_names.length
                            : name_pos + 1,
                        next_name = data_names[next_pos];

                    console.log("You have clicked an aes argument that is a variable name.\n\tCurrent dataset: " + active_dataset + "\n\tAvailable names: " + data_names + "\n\tCurrent name: " + current_name + "\n\tNext name: " + next_name);
                    $(this).text(next_name);
                }
            }
            // Scope is local (geom or stat)
            else {
                console.log("You have clicked an aes argument with local scope.");
            }
        }

        // Parent is not aes, but element
        else {
            // Global scope
            if (scope == "canvas") {
                console.log("You have clicked an element argument with global scope.");
            }
            // Local scope
            else {
                console.log("You have clicked an element argument with localscope.");
            }
        }
    });

    /* ELEMENT */
    $(".element-name").click(function() {
        console.log("You have clicked an element");
    })
}


/* Init */
$(function() {
    $.ajax({
        type: "GET",
        url: "./data/ggplot_docs.json",
        dataType: "json",
        success: function (response) {
            window.ggplot_docs = response;
            //console.log("Loaded data; firing up Tangle");
            setupggDOM(window.ggplot_docs);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    $("#plotbutton").on("click", function(e) {
        // Build ggplot command
        var plotcode = $("#ggplotCode").text().replace(/[\n\t ]+/g, "");
        console.log(plotcode);

        e.preventDefault();
        $("#plotdiv").html("<code>Loading...</code>");

        var code = "parse(text = \"library(ggplot2);" + plotcode + "\");";
        console.log("Executing code: '" + code + "'");
        window.code = code;

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
    $("#plotbutton").trigger("click");
});
