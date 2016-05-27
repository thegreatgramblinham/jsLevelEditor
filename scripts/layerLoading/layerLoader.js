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
        currButton.id = currLayer.LayerIdx.toString();
        currButton.className = "layerButton";
        var nameSpan = document.createElement("span");
        nameSpan.innerHTML = "Layer "+ currLayer.LayerIdx.toString();
        currButton.appendChild(nameSpan);
        if(currLayer.IsSelected)
        {
           currButton.style.border = "2px solid fuchsia"
        }
                
        currButton.onclick = function()
        {
            OnCurrentLayerSelected(Number(this.id));
        };
        
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
            textSpan.innerHTML = rect.Name;
            textSpan.id = rect.Id;
            textSpan.className="layerChildSpan";
            
            if(SelectedRectangle != undefined && rect == SelectedRectangle)
            {
                textSpan.style.border = "1px solid fuchsia";
            }
            else
            {
                textSpan.style.border = "1px solid #283a40";
            }
            
            textSpan.onclick = function()
            {
                OnRectChildSelected(this.id);
            }
            
            textSpan.ondblclick = function()
            {
                OnRectChildEditMode(this);
            }
            
            childData.appendChild(textSpan);
            childRow.appendChild(childData);
            childTable.appendChild(childRow);
        }
    }
    currDiv.appendChild(childTable);
}
