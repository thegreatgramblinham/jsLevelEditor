//This file is for button events related to the image selection sidebar.

//Private Constants
var SELECTED_BRUSH_PADDING = "2px";

//Private Variables
var _currentlySelectedButton = undefined;

//Public Methods
function ImageButtonOnClick(imageIndex, button)
{
    SwitchToImageBrush(imageIndex);
    SetButtonAsSelected(button);
    
    if(CanvasMode == UIMode.Modify)
    {
        SwitchToAdd();
    }
}

//Main
SwitchToAdd();
SwitchToBasicRectBrush();

//Mode Button Events
addModeButton.onclick = SwitchToAdd;
modfiyModeButton.onclick = SwitchToModify;
basicRectButton.onclick = SwitchToBasicRectBrush;


//Private Methods
function SwitchToAdd(e)
{
    CanvasMode = UIMode.Add;
    console.log("Switched to image ADD mode.");
    document.getElementById("addModeButton").style.backgroundColor = "fuchsia";
    document.getElementById("modfiyModeButton").style.backgroundColor = "#567179";
}

function SwitchToModify(e)
{
    CanvasMode = UIMode.Modify;
    console.log("Switched to image MODIFY mode.");
    document.getElementById("addModeButton").style.backgroundColor = "#567179";
    document.getElementById("modfiyModeButton").style.backgroundColor = "fuchsia";
}

function SwitchToBasicRectBrush(e)
{
    SetButtonAsSelected(basicRectButton);
    BrushSelection = BrushType.BasicRect;
    
    document.getElementById("rectWidthBox").disabled = false;
    document.getElementById("rectHeightBox").disabled = false;
    
    if(CanvasMode == UIMode.Modify)
    {
        SwitchToAdd();
    }
    
    console.log("Set non-image brush to: BasicRect");
}

function SwitchToImageBrush(imageIndex)
{
    CurrentImageBrush = new ImageBrush(ImageCache[imageIndex].src);
    BrushSelection = BrushType.Image;
    
    document.getElementById("rectWidthBox").disabled = true;
    document.getElementById("rectHeightBox").disabled = true;
    
    console.log("Set image brush to: "+ImageCache[imageIndex].src);   
}

function SetButtonAsSelected(button)
{
    ResetOldBrushSelection();
    
    button.style.border = SELECTED_BRUSH_PADDING + " solid fuchsia";
    button.style.padding = "0px";
    _currentlySelectedButton = button;
}

function ResetOldBrushSelection()
{
    if(_currentlySelectedButton != undefined)
    {
        _currentlySelectedButton.style.border = "";
        _currentlySelectedButton.style.padding = SELECTED_BRUSH_PADDING;
    }
}