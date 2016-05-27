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
    InitCategoryComboBox
}

function LoadXmlCategories()
{
    _categoryCollection = [];
    
    var xmlCatagoryString = fs.readFileSync(_xmlCatagoryFilePath, 'utf8');
     
    parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlCatagoryString,"text/xml");
    
    //var xmlDoc = xml2js.parseFromString(xmlCatagoryString, function(err, result) {console.log(err);});
    
    var categories = xmlDoc.getElementsByTagName("category");
    for(var i = 0; i < categories.length; i++)
    {
        _categoryCollection.push(categories[i].childNodes[0].nodeValue.toString());
    }
    
    return xmlDoc;
}

function InitCategoryComboBox()
{
    
}