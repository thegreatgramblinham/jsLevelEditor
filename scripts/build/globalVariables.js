//This file is to be used for all variables that are not file specific.
//Most will be initialized as undefined.

//Variables
var CurrentImageBrush = undefined; //Holds the current ImageBrush after a button is selected.
var SelectedRectangle = undefined; //Holds the currently selected rectangle.
var CanvasMode = UIMode.Add; //Holds the enum defining what happens when the canvas is clicked.
var LayerCollection = [] //Holds the collection of layers for use in the canvas and loader classes