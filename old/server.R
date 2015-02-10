
# This is the server logic for a Shiny web application.
# You can find out more about building applications with Shiny here:
#
# http://shiny.rstudio.com
#

library("shiny")
library("dplyr")

shinyServer(function(input, output) {
  
  ## UI DEFINITIONS ----
  datavars <- reactive({
    vars <- eval(parse(text = sprintf("names(%s)", input$ggdata)))
    vars
  })
  
  output$ggxaxis <- renderUI({
    inputvars <- datavars()
    
    selectInput("ggxvar", HTML("<code>xaxis</code>"),
                inputvars, selected = inputvars[1])
  })
  
  output$ggyaxis <- renderUI({
    inputvars <- c("-" = FALSE, datavars()[!datavars() %in% input$ggxvar])
    
    selectInput("ggyvar", HTML("<code>yaxis</code>"),
                inputvars, selected = inputvars[1])
  })
  
  output$geoms <- renderUI({
    geoms <- switch(
      input$ggyvar,
      "FALSE" = c("geom_bar", "geom_histogram", "geom_density"),
      c("geom_point", "geom_bar", "geom_hex", "geom_bin2d")
    )
    
    selectInput("gggeom", HTML("<code>geom</code>"),
                choices = geoms,
                selected = geoms[1],
                multiple = TRUE)
  })
  
  output$aesthetics <- renderUI({
    selectInput("ggaes", "aesthetics",
                c("fill", "color", "alpha", "linetype", "size", 
                  "label", "angle", "family", "fontface", "hjust",
                  "lineheight", "size", "vjust"),
                multiple = TRUE)
  })
  
  output$aes_params <- renderUI({
    # if (length(ggaes) == 0) return()
    fields <- lapply(input$ggaes, function(a) {
      # a <- input$ggaes
      textInput(paste0("aes_", a), a)
    })
    
    tagList(fields)
  })
  
  ## render code ----
  aes_str <- reactive({
    axis_calls <- sapply(c('x', 'y'), function(a) {
      if (input[[paste0("gg", a, "var")]] == FALSE) {
        return(FALSE)
      }
      
      sprintf("%s = %s", a, input[[paste0("gg", a, "var")]])
    })
    
    aes_calls <- sapply(input$ggaes, function(a) {
      if (input[[paste0("aes_", a)]] == "") {
        print("aes param empty.")
        return(FALSE)
      }
      
      sprintf("%s = %s", a, input[[paste0("aes_", a)]])
    })
    
    aes_vec <- sapply(c(axis_calls, aes_calls), function(call) {
      if (call == FALSE | call == "FALSE" | length(call) == 0) return(NULL)
      call
    }) %>% unlist()
    # browser()
    return(paste(aes_vec, collapse = ", "))
  })
  
  ggcode <- reactive({
    data_call <- input$ggdata
    aes_call <- aes_str()
    canvas_call <- sprintf("ggplot(%s, aes(%s))", data_call, aes_call)
    
    geom_call <- input$gggeom %>% sapply(function(geom) { sprintf("%s()", geom) } ) %>% paste(collapse = " + ")
    cat("geom_call:", geom_call, "\n")
    if (geom_call == "") geom_call <- NULL
    plot_call <- paste(c(canvas_call, geom_call), collapse = " + ")
    
    cat("plot_call:", plot_call, "\n")
    
    plot_call
  })
  
  output$ggcall <- renderUI({
    ggcall <- ggcode()
    ggcall <- gsub("\\+ ", "\\+<br/>&nbsp;&nbsp;&nbsp;", ggcall)
    
    tags$code(HTML(ggcall))
  })
  
  ## Plot
  output$ggoutput <- renderPlot({
    p <- tryCatch(eval(parse(text = ggcode())), error = function(e) return(NULL))
    
    # invisible(tryCatch(print(p, vp = stdout), error = function(e) p <<- NULL))
    
    p
  })
  
})
