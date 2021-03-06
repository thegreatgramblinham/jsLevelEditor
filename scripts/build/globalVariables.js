//This file is to be used for all variables that are not file specific.
//Most will be initialized as undefined.

//Variables
var CurrentImageBrush = undefined; //Holds the current ImageBrush after a button is selected.
var SelectedRectangle = undefined; //Holds the currently selected rectangle.
var CanvasMode = UIMode.Add; //Holds the enum defining what happens when the canvas is clicked.
var CurrentLayer = undefined; //Holds the currently selected layer
var BrushSelection = BrushType.BasicRect; //Hold the state of ui brush selection.
var LayerCollection = []; //Holds the collection of layers for use in the canvas and loader classes.
var DefaultCategory = "None" //Holds the settable default category for new objects created.
var LevelWidth = 0; //Holds current level width.
var LevelHeight = 0; //Holds current level height.
var ImageCache = []; //Holds all currently loaded images. IMG Elements.
var FileChangeMade = false; //Bool to determine whether or not changes were made to a saved level file.
var LoadingLevel = false;