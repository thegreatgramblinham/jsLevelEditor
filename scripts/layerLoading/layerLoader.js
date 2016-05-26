//Internal variables
var _layerDiv = document.getElementById("layerDiv");
var _layerContent = document.createElement("div");

//Main
_layerDiv.appendChild(_layerContent);
RefreshLayerControls();

function RefreshLayerControls()
{
    var contentDiv = document.createElement("div");
    var i;
    for(i=LayerCollection.length-1; i > -1; i--)
    {
        var currLayer = LayerCollection[i];
        var currDiv = document.createElement("div");
        var currButton = document.createElement("button");
        var nameSpan = document.createElement("span");
        nameSpan.innerHTML = currLayer.LayerIdx.toString();
        currButton.appendChild(nameSpan);
        currButton.className = "layerButton"
        currDiv.appendChild(currButton);
        if(currLayer.HasChildren())
        {
            BuildChildren(currLayer, currDiv);
        }

        contentDiv.appendChild(currDiv);
    }
    
    _layerDiv.replaceChild(contentDiv,_layerContent);
    _layerContent = contentDiv;
}

function BuildChildren(layer,currDiv)
{
    var i;
    var childTable = document.createElement("table");
    childTable.className = "layerChildTable";
    for(i=0; i<layer.ChildCount(); i++)
    {
        var rect = layer.GetRectangle(i);
        if(rect != undefined)
        {
            var childRow = document.createElement("tr");
            childRow.className="layerChildRow";
            var childData = document.createElement("td");
            childData.className="layerChildCell";
            var textSpan = document.createElement("span");
            textSpan.innerHTML = rect.Id;
            textSpan.id = "layerChild"+layer.LayerIdx.toString();
            textSpan.className="layerChildSpan";
            childData.appendChild(textSpan);
            childRow.appendChild(childData);
            childTable.appendChild(childRow);
        }
    }
    currDiv.appendChild(childTable);
}

function OnLayerAdded()
{
    RefreshLayerControls();   
}

function OnLayerChildAdded()
{
    RefreshLayerControls();
    
}
