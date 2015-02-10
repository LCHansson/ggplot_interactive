
# This is the user-interface definition of a Shiny web application.
# You can find out more about building applications with Shiny here:
#
# http://shiny.rstudio.com
#

library("shiny")
library("shinythemes")
library("ggplot2")

fluidPage(
  title = HTML("En liten tutorial i ggplot2"),
  theme = shinytheme("readable"),
  
  fluidRow(column(
    offset = 2, width = 8,
    tags$h1(HTML("En liten tutorial i <code>ggplot2</code>"), class = "text-center")
  )),
  
  fluidRow(
    column(
      offset = 2, width = 2,
      selectInput("ggdata", HTML("<code>data</code>"),
                  c("mtcars", "diamonds"), selected = "diamonds")
    ),
    column(
      width = 2,
      uiOutput("ggxaxis")
    ),
    column(
      width = 2,
      uiOutput("ggyaxis")
    ),
    column(
      width = 2,
      uiOutput("geoms")
    )
  ),
  
  fluidRow(
    column(
      offset = 2, width = 2,
      uiOutput("aesthetics")
    ),
    column(
      width = 2,
      uiOutput("aes_params")
    ),
    column(
      width = 2
    ),
    column(
      width = 2
    )
  ),
  
  fluidRow(column(
    offset = 2, width = 8,
    wellPanel(htmlOutput("ggcall"))
  )),
  
  fluidRow(column(
    offset = 2, width = 8,
    plotOutput("ggoutput")
  ))
)
