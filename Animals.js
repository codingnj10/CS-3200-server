var myURL = "http://localhost:8080/animals";
var InputBoxesNames = ["name", "animal", "breed", "color", "gender", "age"];
var Keys = ["name", "animal", "type", "color", "gender", "age"];
var Headers = ["ID", "Name", "Type of Animal", "Breed", "Color", "Gender", "Age"];

//------------------GET ALL ITEMS--------------------------

var GetAllBtn = document.getElementById("GetAllBtn");
GetAllBtn.onclick = function()
{
  GetItems();
};

var GetItems = function()
{
  var RequestGetAll = new XMLHttpRequest();
  RequestGetAll.onreadystatechange = function()
  {
    if (RequestGetAll.readyState == XMLHttpRequest.DONE)
    {
      if (RequestGetAll.status == 200)
      {
        console.log("Get All Items Success");
        //console.log(RequestGetAll.responseText);
        CreateTableAll(JSON.parse(RequestGetAll.responseText));
        ClearInputBoxes();
      }
      else
      {
        console.log("Get All Items Failed");
      }
    }
  };

  //ConstructPath
  RequestGetAll.open("GET", myURL);//Set request type
  RequestGetAll.send();//Send Request
};

//--------------------POST-----------------------
var CreateBtn = document.getElementById("CreateBtn");
CreateBtn.onclick = function()
{
  if(ValidateInputAll())
  {
      POST();
  }
  else
  {
    console.log("Fill all the info in form");
  }
};

var POST = function()
{
  var RequestPost = new XMLHttpRequest();
  RequestPost.onreadystatechange = function()
  {
    if (RequestPost.readyState == XMLHttpRequest.DONE)
    {
      if(RequestPost.status == 201)
      {
        ClearInputBoxes();
        GetItems();
        //console.log(RequestPost.responseText);
      }
      else
      {
        console.log("POST Failed");
      }
    }
  };

  //Request Code
  var Path = ConstructPathPOST();
  //Send Request
  RequestPost.open("POST", myURL);
  RequestPost.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestPost.send(Path);
};

var ConstructPathPOST = function()
{
  var Path = "";
  var Val ="";
  for(i =0; i<Keys.length; i++)
  {
    Val = encodeURIComponent(document.getElementById(InputBoxesNames[i]).value);
    Path= Path + Keys[i]+ "=" + Val;
    //Add & for all entries before the last one
    if(i != Keys.length-1)
    {
      Path+="&";
    }
  }
  return Path;
};

//Check if all boxes have an input value
var ValidateInputAll = function()
{
  for(i =0; i<InputBoxesNames.length; i++)
  {
    if(document.getElementById(InputBoxesNames[i]).value == "")
    {
      return false;
    }
  }
  return true;
};

var ClearInputBoxes = function()
{
  for(i =0; i<InputBoxesNames.length; i++)
  {
      document.getElementById(InputBoxesNames[i]).value = "";
  }
  document.getElementById("id").value = "";
};

var ClearBtn = document.getElementById("ClearBtn");
ClearBtn.onclick = function()
{
  ClearInputBoxes();
};

//----------------------GET ONE ITEM------------------------

var FindBtn = document.getElementById("FindBtn");
FindBtn.onclick = function()
{
  if(ValidateInputId())
  {
    var ID = document.getElementById("id").value;
    GetItem(false, ID);
  }
  else
  {
    console.log("Invalid ID");
  }
};

var Fill_Input_Boxes = function(myJSON)
{
  myJSON = JSON.parse(myJSON);
  for(i=0;i<InputBoxesNames.length ; i++)
  {
      var Box = document.getElementById(InputBoxesNames[i]);
      Box.value = myJSON["Animals"][i+1];
  }
};

var GetItem = function(Update, ID)
{
  var RequestGet = new XMLHttpRequest();
  RequestGet.onreadystatechange = function()
  {
    if (RequestGet.readyState == XMLHttpRequest.DONE)
    {
      if (RequestGet.status == 200)
      {
        console.log("Get Item Success");
        //console.log(RequestGet.responseText);
        if(Update == false)
        {
            CreateTableSingle(JSON.parse(RequestGet.responseText));
        }
        Fill_Input_Boxes(RequestGet.responseText);
      }
      else
      {
        console.log("Get Item Failed");
        alert("Couldn't Find Item. \n ID Not Found");
      }
    }
  };

  RequestGet.open("GET", (myURL+"/"+ID));//Set request type
  RequestGet.send();//Send Request
};

//Gets called when clicked on id buttons
var ConnectIDButtonsGet = function()
{
  ID = this.innerHTML;
  GetItem(true, ID);
  document.getElementById("id").value = ID;
}

//-----------------------DELETE--------------------

var DeleteItem = function(ID)
{
  var RequestDel = new XMLHttpRequest();
  RequestDel.onreadystatechange = function()
  {
    if (RequestDel.readyState == XMLHttpRequest.DONE)
    {
      if (RequestDel.status == 204)
      {
        GetItems();
      }
      else
      {
        console.log("Delete Item Failed");
      }
    }
  };

  //ConstructPath
  RequestDel.open("DELETE", (myURL+"/"+ID));//Set request type
  RequestDel.send();//Send Request
};

//Gets called when clicked on Delete buttons
var ConnectIDButtonsDelete = function()
{
  ID = this.value;
  if(confirm("You want to delete?") == true)
  {
    DeleteItem(ID);
  }
};


//Construct a path using id input box
var ConstructPathGet_Delete = function()
{
  var Path = "";
  var Val = encodeURIComponent(document.getElementById("id").value);
  Path = "id="+Val;
  return Path;
};

//--------------------UPDATE----------------------

var UpdateItem = function(ID)
{
  var RequestPut = new XMLHttpRequest();
  RequestPut.onreadystatechange = function()
  {
    if (RequestPut.readyState == XMLHttpRequest.DONE)
    {
      if(RequestPut.status == 201)
      {
        //ClearInputBoxes();
        GetItem(false, ID);//False to display single table
        //console.log(RequestPut.responseText);
      }
      else
      {
        console.log("PUT Failed");
      }
    }
  };

  //Request Code
  var Path = ConstructPathPOST();
  //Send Request
  RequestPut.open("PUT", (myURL+"/"+ID));
  RequestPut.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestPut.send(Path);
};

var ConnectIDButtonsUpdate = function()
{
  ID = this.value;
  GetItem(false, ID);
  if(ValidateInputAll())
  {
    UpdateItem(ID);
  }
  console.log("Fill all input boxes");
};

//Check if id box has a valid input (not char or empty)
var ValidateInputId = function()
{
  ID=document.getElementById("id").value;
  if(ID == "")
  {
    return false;
  }
  else
  {
    for(i=0; i < ID.length;i++)
    {
      //if current characters is not a number by comparing ascii values
      if(ID[i].charCodeAt(0)<48 || ID[i].charCodeAt(0)>57)
      {
        return false;
      }
    }
  }
  return true;
};

var CreateTableHeaders = function(Table)
{
  var NewRow = document.createElement("tr");
  for(i=0; i<Headers.length; i++)
  {
    var Col = document.createElement("th");
    Col.innerHTML = Headers[i];
    NewRow.appendChild(Col);
  }
  Table.appendChild(NewRow);
};

var CreateTableAll = function(data)
{
  var Table = document.getElementById("Data");
  Table.innerHTML = "";
  CreateTableHeaders(Table);
  for (key in data)
  {//get into collecection
    for(i=0; i<data[key].length ; i++)
    {//get into collection main array
      var NewRow = document.createElement("tr");
      for(j=0; j<data[key][i].length; j++)
      {//get into each of the entriesvar Col = document.createElement("td");
        var Col = document.createElement("td");
        if(j==0) //Make a button for ID
        {
          //Find Button
          var But = document.createElement("button");
          id = data[key][i][j];
          //Connect Button to function
          But.onclick = ConnectIDButtonsGet;
          But.innerHTML=data[key][i][j];
          Col.appendChild(But);
          //DeleteBtn
          var DelBut = document.createElement("button");
          DelBut.value = id;
          DelBut.onclick = ConnectIDButtonsDelete;
          DelBut.innerHTML = "Delete";
          Col.appendChild(DelBut);
          //UpdateBtn
          var UpdBut = document.createElement("button");
          UpdBut.value = id;
          UpdBut.onclick = ConnectIDButtonsUpdate;
          UpdBut.innerHTML = "Update";
          Col.appendChild(UpdBut);
        }
        else
        {
          Col.innerHTML = data[key][i][j];
        }
        NewRow.appendChild(Col);
      }
      Table.appendChild(NewRow);
    }
  }
};

var CreateTableSingle = function(data)
{
  var Table = document.getElementById("Data");
  Table.innerHTML = "";
  CreateTableHeaders(Table);
  var NewRow = document.createElement("tr");
  for (key in data)
  {//get into collecection
    for(i=0; i<data[key].length ; i++)
    {//get into collection single item entries
      var Col = document.createElement("td");
      if(i==0) //Make a button for ID
      {
        //ID button
        var But = document.createElement("button");
        id = data[key][i];
        //Connect Button to function
        But.onclick = ConnectIDButtonsGet;
        But.innerHTML=data[key][i];
        Col.appendChild(But);
        //DeleteBtn
        var DelBut = document.createElement("button");
        DelBut.value = id;
        DelBut.onclick = ConnectIDButtonsDelete;
        DelBut.innerHTML = "Delete";
        Col.appendChild(DelBut);
        //UpdateBtn
        var UpdBut = document.createElement("button");
        UpdBut.value = id;
        UpdBut.onclick = ConnectIDButtonsUpdate;
        UpdBut.innerHTML = "Update";
        Col.appendChild(UpdBut);
        NewRow.appendChild(Col);
      }
      else
      {
        Col.innerHTML = data[key][i];
      }
      NewRow.appendChild(Col);
    }
  }
  Table.appendChild(NewRow);
};

GetItems();
