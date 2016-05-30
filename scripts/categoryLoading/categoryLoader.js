//This file is for loading categories from a serialized Xml file into the app

//Private Variables
var _xmlCatagoryFilePath = __dirname + "/config/categories.xml";
var _categoryDiv = document.getElementById("categoryGroupDiv");
var _categoryContent = document.createElement("DIV");

//Main
InitCategories();
_categoryDiv.appendChild(_categoryContent);
RefreshCategoryView();

//Public Methods

function RefreshCategoryView()
{  
    var categoryCollections = []; //dictionary keyed on categoryName
    var categoryKeys = []; //keys to above dictionary
    
    for(var i = 0; i < LayerCollection.length; i++)
    {
        var layer = LayerCollection[i];
        
        for(var j = 0; j < layer.ChildCount(); j++)
        {
            var rect = layer.GetRectangle(j);
            
            if(!(rect instanceof NamedRectangle)) continue;
            
            if(categoryCollections[rect.Category] == undefined)
            {
                categoryCollections[rect.Category] = [rect];
                categoryKeys.push(rect.Category);
            }       
            else
                categoryCollections[rect.Category].push(rect);
        }
    }   
    
    BuildCategoryList(categoryCollections, categoryKeys);
}

function BuildCategoryList(categoryCollections, categoryKeys)
{
    _categoryDiv = document.getElementById("categoryGroupDiv");
    var newCategoryContentDiv = document.createElement("DIV");
    
    for(var i = 0; i < categoryKeys.length; i++)
    {
        var group = categoryCollections[categoryKeys[i]];
        var currDiv = document.createElement("DIV");
        var categorySpan = document.createElement("SPAN");
        categorySpan.innerHTML = group[0].Category;
        categorySpan.className = "categoryTitle";
        currDiv.appendChild(categorySpan);
        
        for(var j = 0; j < group.length; j++)
        {
            var rect = group[j];
            
            var rectSpan = document.createElement("SPAN");
            rectSpan.innerHTML = rect.Name;
            rectSpan.className = "categoryChildRect";
            
            currDiv.appendChild(rectSpan);           
        }
        
        newCategoryContentDiv.appendChild(currDiv);
    }
    
    if(_categoryDiv.children.length > 0)    
        _categoryDiv.replaceChild(newCategoryContentDiv, _categoryDiv.children[0]);   
    else
        _categoryDiv.appendChild(newCategoryContentDiv);
}


//Private Methods
function InitCategories()
{
    LoadXmlCategories();
    InitCategoryComboBox();
}

function LoadXmlCategories()
{
    _categoryCollection = [];
    
    var xmlCatagoryString = fs.readFileSync(_xmlCatagoryFilePath, 'utf8');
     
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlCatagoryString,"text/xml");
    
    var categories = xmlDoc.getElementsByTagName("categories");
    for(var i = 0; i < categories[0].children.length; i++)
    {
        _categoryCollection.push(categories[0].children[i].innerHTML);
    }
}

function InitCategoryComboBox()
{
    var cateComboBox = document.getElementById("categoryComboBox");
    var additionCateComboBox = document.getElementById("additionCategoryComboBox");
    
    for(var i = 0; i < _categoryCollection.length; i++)
    {
        //create one for the selected rect category
        var option = document.createElement("OPTION");
        option.value = _categoryCollection[i];
        option.innerHTML = _categoryCollection[i];   
        cateComboBox.appendChild(option);
        
        //create one for the addition control
        var option = document.createElement("OPTION");
        option.value = _categoryCollection[i];
        option.innerHTML = _categoryCollection[i]; 
        additionCateComboBox.appendChild(option);
    }
}