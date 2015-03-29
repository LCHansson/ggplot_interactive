/**
 * Created by love on 09/02/15.
 */


function addDialog(event, data, caller) {
    var $dialog = $('#element-selector'),
        //$dialog_content = $("#element-selector-content")
        x = event.pageX,
        y = event.pageY;

    // Clear of previous HTML
    $dialog.empty();

    //console.log([x, y]);

    data.forEach(function(el) {
        $dialog.append('<span class="callback-element">' + el + '</span><br/>');
        //$dialog.append("Test");
    });

    $(".callback-element").click(function(e) {
        $(caller).text($(this).text());
        //console.log(this);
    })

    // Show modal
    if(!$($dialog).is(':visible'))
    {
        $($dialog).show(100);
        //$($dialog_content).delay(150).show(400);
    }

    // Positioning
    $dialog.css("left", x).css("top", y);
    //$dialog_content.css("left", x).css("top", y);

}

$("#element-selector").click( function () {
    // Close the modal
    if($("#element-selector").is(':visible'))
    {
        $("#element-selector").delay(200).hide(100);
        //$("#element-selector-content").hide(200);
    }
});

$(document).mouseup(function (e)
{
    var container = $("#element-selector");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.delay(200).hide();
    }
});

function setupggDOM (data) {
    // Set up data
    var interactive_elements = $(".interactive");


    /* DATASET */
    // Loop through all elements and assign them with reasonable properties and onClick behaviour
    $(".data").data("allowed_datasets", Object.getOwnPropertyNames(data.datasets));
    console.log($(".data").data("allowed_datasets"));

    // Cycle through datasets
    // TODO: Maybe replace with selection menu later?
    $(".data").click(function(event) {
        console.log("Clicked a data set name.");
        var allowed_datasets = $(this).data("allowed_datasets");
        //var current_data = $(this).text(),
        //    data_pos = allowed_datasets.indexOf(current_data),
        //    next_pos = data_pos + 1 > allowed_datasets.length - 1
        //        ? data_pos + 1 - allowed_datasets.length
        //        : data_pos + 1,
        //    next_data = allowed_datasets[next_pos];

        //$(this).text(next_data);
        addDialog(event, allowed_datasets, this);

        // TODO:
        // - cycleAllAesUsingThisData();
        // - or: invalidatePlotButtonAndUnderlineFaultyElements();
    });


    /* PARAMETERS */
    $(".parameter").click(function(event) {
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

        //var name_pos = allowed_aes.indexOf(current_aesthetic);

            //current_aesthetic = $(this).text(),
            //next_pos = name_pos + 1 > allowed_aes.length - 1
            //    ? name_pos + 1 - allowed_aes.length
            //    : name_pos + 1,
            //next_name = allowed_aes[next_pos];

        console.log("Clicked an aes parameter.\n\tActive geoms: " + active_geoms + "\n\tAllowed aesthetics: " + allowed_aes);
        //+ "\n\tCurrent aesthetic: " + current_aesthetic+ "\n\tNext name: " + next_name);

        //$(this).text(next_name);
        addDialog(event, allowed_aes, this);

        // modifyAesArgument();
        //var valid_arguments = getValidAesArguments(current_aesthetic);
        //updateAesArgument(valid_arguments);


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
    $(".argument").click(function(event) {
        // Get scope
        var parent = $(this).parents(".scope");
        if (parent.attr('class') != "scope") { return; };

        var scope = parent.attr('id'),
            parent_class = $(this).parent().attr('class');

        //console.log("Parent class: " + parent_class)

        // If parent is aes, make aes modifications.
        if ( parent_class == 'aes-parameter') {
            // Scope is global ('canvas')
            if (scope == "canvas") {
                if ($(this).attr('data-type') == "varname") {
                    // getDataset();
                    var active_dataset = $(this).parents(".scope").find(".data").text(),
                        data_names = data.datasets[active_dataset];
                        //current_name = $(this).text(),
                        //name_pos = data_names.indexOf(current_name),
                        //next_pos = name_pos + 1 > data_names.length - 1
                        //    ? name_pos + 1 - data_names.length
                        //    : name_pos + 1,
                        //next_name = data_names[next_pos];

                    console.log("Clicked an aes argument that is a variable name.\n\tCurrent dataset: " + active_dataset + "\n\tAvailable names: " + data_names);
                    //+ "\n\tCurrent name: " + current_name + "\n\tNext name: " + next_name);
                    //$(this).text(next_name);
                    addDialog(event, data_names, this);
                }
            }
            // Scope is local (geom or stat)
            else {
                console.log("Clicked an aes argument with local scope.");
            }
        }

        // Parent is not aes, but element
        else {
            // Global scope
            if (scope == "canvas") {
                console.log("Clicked an element argument with global scope.");
            }
            // Local scope
            else {
                console.log("Clicked an element argument with local scope.");
            }
        }
    });

    /* ELEMENT */
    $(".element-name").click(function() {
        console.log("Clicked an element");
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
