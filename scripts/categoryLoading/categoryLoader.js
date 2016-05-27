//This file is for loading categories from a serialized Xml file into the app

//Private Variables
var _xmlCatagoryFilePath = __dirname + "/config/categories.xml";
var _xmlCatagoryXPath = "/Categories/Category";
var _categoryCollection = [];

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
    
    for(var i = 0; i < LayerCollection.length; i++)
    {
        var layer = LayerCollection[i];
        
        for(var j = 0; j < layer.ChildCount(); j++)
        {
            var rect = layer.GetRectangle(j);
            
            if(!(rect instanceof NamedRectangle)) continue;
            
            if(categoryCollections[rect.Category] == undefined)
                categoryCollections[rect.Category] = [rect];
            else
                categoryCollections[rect.Category].push(rect);
        }
    }   
}

function BuildCategoryList(categoryCollections)
{
    var newCategoryContentDiv = document.createElement("DIV");
    
    //todo construct here
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
     
    parser = new DOMParser();
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
    
    for(var i = 0; i < _categoryCollection.length; i++)
    {
        var option = document.createElement("OPTION");
        option.value = _categoryCollection[i];
        option.innerHTML = _categoryCollection[i];
        
        cateComboBox.appendChild(option);
    }
}