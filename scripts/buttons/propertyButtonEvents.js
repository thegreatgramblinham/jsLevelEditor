//This file is for events related to the property controls along the bottom bar.

//Private Variables
var _xBox = document.getElementById("rectXBox");
var _yBox = document.getElementById("rectYBox");

function OnSelectedRectangleChanged()
{
    _xBox.value = SelectedRectangle.XLocation;
    _yBox.value = SelectedRectangle.YLocation;
}

_xBox.oninput = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.XLocation = _xBox.value;
    }
}

_yBox.oninput = function(e)
{
    if(SelectedRectangle != undefined)
    {
        SelectedRectangle.YLocation = _yBox.value;
    }
}
