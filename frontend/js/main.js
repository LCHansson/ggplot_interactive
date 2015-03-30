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
    });

    $(".callback-element").click(function(e) {
        $(caller).text($(this).text());
    })

    // Show modal
    if(!$($dialog).is(':visible'))
    {
        $($dialog).show(100);
    }

    // Positioning
    $dialog.css("left", x).css("top", y);
}

function addArgument(event, context, caller) {

}

$("#element-selector").click( function () {
    // Close the modal
    if($("#element-selector").is(':visible'))
    {
        $("#element-selector").delay(200).hide(100);
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

        addDialog(event, allowed_datasets, this);

        // TODO:
        // - cycleAllAesUsingThisData();
        // - or: invalidatePlotButtonAndUnderlineFaultyElements();
    });


    /* PARAMETERS */
    function setParameterClicks() {
        $(".parameter").unbind("click");

        $(".parameter").click(function (event) {
            // Get scope
            var $scope = $(this).parents(".scope"),
                envir = $(this).parent().attr("class"),
                scope_id = $scope.attr('id');


            switch (envir) {
                case "aes":
                    if (scope_id == "canvas") {
                        var geom_name = $(".geom").text();
                        console.log("active geoms: " + geom_name);

                        var allowed_params = data.geom[geom_name].aesthetics;
                    } else {
                        //    TODO:
                        //    - getLocallyScopedElement();
                        //    - getAllowedAes();
                        var geom_name = $(this).siblings(".geom").text(),
                            allowed_params = data.geom[geom_name].args;

                        console.log("parent geom: " + geom_name);
                    }

                    console.log("Clicked an aes parameter.\n\tGeom name(s): " + geom_name + "\n\tAllowed aesthetics: " + allowed_params);

                    break;
                case "element":
                    var element_name = $(this).siblings(".element-name").text()
                        allowed_params = data.geom[element_name].args;

                    console.log(allowed_params);
                    break;
            }


            //$(this).text(next_name);
            addDialog(event, allowed_params, this);

            // modifyAesArgument();
            //var valid_arguments = getValidAesArguments(current_aesthetic);
            //updateAesArgument(valid_arguments);
        });
    }

    setParameterClicks();

    /* ARGUMENTS */
    function setArgumentClicks() {
        $(".argument").unbind("click");

        $(".argument").click(function (event) {
            // Get scope
            var parent = $(this).parents(".scope");
            if (parent.attr('class') != "scope") {
                return;
            }

            var scope = parent.attr('id'),
                parent_class = $(this).parent().attr('class');

            console.log("Parent class: " + parent_class);

            // If parent is aes, make aes modifications.
            if (parent_class == 'aes') {
                // Scope is global ('canvas')
                if (scope == "canvas") {
                    if ($(this).attr('data-type') == "varname") {
                        var active_dataset = $(this).parents(".scope").find(".data").text(),
                            data_names = data.datasets[active_dataset];

                        console.log("Clicked an aes argument that is a variable name.\n\tCurrent dataset: " + active_dataset + "\n\tAvailable names: " + data_names);
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
    }

    setArgumentClicks();

    /* ELEMENT */
    function setElementClicks() {
        $(".geom").unbind("click");

        $(".geom").click(function (event) {
            var allowed_geoms = Object.getOwnPropertyNames(data.geom);
            console.log(allowed_geoms);

            addDialog(event, allowed_geoms, this);
        });
    }

    setElementClicks();


    /* ADDERS */
    $(".add").click(function(event) {
        var scope = $(this).parents(".scope").attr("id"),
            $context = $(this).parent(),
            context_name = $context.attr("class");

        switch (context_name) {
            case "aes":
                var number_of_siblings = $(this).siblings().length,
                    before_insert = number_of_siblings > 1 ? ", " : "",
                    new_par = "x",
                    new_arg = "table";
                break;
            case "element":
                var number_of_siblings = $(this).siblings().length,
                    before_insert = number_of_siblings > 1 ? ", " : "",
                    new_par = "test",
                    new_arg = "test";
                break;
        }

        $(this).before(before_insert +
            '<span class="parameter modifiable interactive">' + new_par + '</span>\n' +
            '<span class="equals">=</span>\n' +
            '<span class="argument modifiable interactive" data-type="varname">' + new_arg + '</span>\n'
        )

        setParameterClicks();
        setArgumentClicks();

        console.log("Clicked add element.\n\tscope: " + scope + "\n\tcontext: " + context_name);
    });
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
        var plotcode = $("#ggplotCode").text()
            .replace(/[\n\t ]+/g, "")
            .replace(/[\u2026]/g, "");
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
