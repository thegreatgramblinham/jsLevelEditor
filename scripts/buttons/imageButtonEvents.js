//This file is for button events related to the image selection sidebar.

//Private Constants
var SELECTED_BRUSH_PADDING = "2px"

//Private Variables
var _currentlySelectedButton = undefined

//Public Methods
function ImageButtonOnClick(imageIndex, button)
{
    CurrentImageBrush = new ImageBrush(ImageCache[imageIndex].src);
    console.log("Set image brush to: "+ImageCache[imageIndex].src);
    
    SetButtonAsSelected(button);
}

//Main
SwitchToAdd();

//Mode Button Events
addModeButton.onclick = SwitchToAdd;
modfiyModeButton.onclick = SwitchToModify;

basicRectButton.onclick = function(e)
{
    SetButtonAsSelected(basicRectButton);
    console.log("Set non-image brush to: BasicRect");
}


//Private Methods
function SwitchToAdd(e)
{
    CanvasMode = UIMode.Add;
    console.log("Switched to image ADD mode.");
    document.getElementById("addModeButton").style.backgroundColor = "red";
    document.getElementById("modfiyModeButton").style.backgroundColor = "darkgrey";
}

function SwitchToModify(e)
{
    CanvasMode = UIMode.Modify;
    console.log("Switched to image MODIFY mode.");
    document.getElementById("addModeButton").style.backgroundColor = "darkgrey";
    document.getElementById("modfiyModeButton").style.backgroundColor = "red";
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