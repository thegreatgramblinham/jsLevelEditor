//This file is for loading categories from a serialized Xml file into the app

//Private Variables
var _xmlCatagoryFilePath = "D:/Documents/personalRepos/jsLevelEditor/config/categories.xml";
var _xmlCatagoryXPath = "/Categories/Category";
var _categoryCollection = [];

//Main
InitCategories();

//Public Methods
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