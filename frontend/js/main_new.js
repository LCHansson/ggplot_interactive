/*
* TODO:
* - Download a JS reference, jQuery docs and Tangle.js docs to Dash
*
* */


/*
* span types:
* - element [scope]
* -- canvas
* -- element
* - data
* - element-param
* -- parameter [data-type]
* -- equals
* -- argument [allowed-data-types]
* -- equals
* - aes
* -- aes-param
* --- parameter
* --- equals
* --- argument
* -- equals
* */

/*
* dependency types:
*
* - data -> scope
*
*
* */

function defineClickEvents() {
    console.log("definining click events for element");
    // add
    if ($(this).hasClass("add")) {
        //el.gg_add = function() {
        //    null;
        //};

        $(this).click(function() {
            console.log("clicked add element");
        });
    }

    if ($(this).hasClass("modifiable")) {
        $(this).click(function() {
            console.log("clicked modifiable element");
        });
    }

    if ($(this).hasClass("remove")) {
        $(this).click(function() {
            console.log("clicked remove element");
        });
    }
}


function defineModifyEvents(el) {
    var element_classes = el.classList;

    if (element_classes.contains("data")) {
        var scope = getScope(el, "data");
        getAvailableDatasets(scope);

        toggleDataset(el);
    }

    if (element_classes.contains("parameter")) {
        var scope = getScope(el, "parameter")
        getAvailableParams(scope);

        toggleParam(el);
    }

    if (element_classes.contains("argument")) {
        var scope = getScope(el, "argument");
        getAvailableArguments(scope);

        toggleArgument(el);
    }
}

function setupggDOM(data) {
    /* init */
    // getElements();
    var $interactive_elements = $(".interactive");

    $interactive_elements.each(function() { defineClickEvents() });
    // end getElements();

    /* init()
    *
    * getElements();
    *
    * defineClickEvents();
    * - add
    * - modify
    * - remove
    *
    * defineModifyEvents();
    * - data
    * - parameter
    * - argument
    *
    * defineAddEvents();
    * - element
    * - element-param
    * - aes
    * - aes-param
    *
    * defineRemoveEvents();
    * - element
    * - element-param
    * - aes
    * - aes-param
    *
    * */

}



/* INIT */
$(document).ready(function() {
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
});