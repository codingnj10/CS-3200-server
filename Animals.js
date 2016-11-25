
//------------------------USERS REGISTER---------------------------
var myURLRegister = "http://localhost:8080/users";
var InputBoxesNamesRegister = ["fname", "lname", "address", "city", "state", "phone", "email", "password", "confirm_password"];
var KeysRegister = ["fname", "lname", "address", "city", "state", "phone", "email", "password"];


//--------------------POST-----------------------
var RegisterBtn = document.getElementById("RegisterBtn");
RegisterBtn.onclick = function()
{
  if(ValidateInputAllRegister())
  {
      POSTRegister();
  }
  else
  {
    console.log("Register Input error");
  }
};

var POSTRegister = function()
{
  var RequestPostRegister = new XMLHttpRequest();
  RequestPostRegister.onreadystatechange = function()
  {
    if (RequestPostRegister.readyState == XMLHttpRequest.DONE)
    {
      if(RequestPostRegister.status == 201)
      {
        ClearInputBoxesRegister();
        GetAnimals();
        //console.log(RequestPost.responseText);
      }
      else
      {
        console.log("Register Failed");
      }
    }
  };

  //Request Code
  var Path = ConstructPathPOSTRegister();
  console.log(Path);
  //Send Request
  RequestPostRegister.open("POST", myURLRegister);
  RequestPostRegister.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestPostRegister.withCredentials = true;
  RequestPostRegister.send(Path);
};

var ConstructPathPOSTRegister = function()
{
  var Path = "";
  var Val ="";
  for(i =0; i<KeysRegister.length; i++)
  {
    Val = encodeURIComponent(document.getElementById(InputBoxesNamesRegister[i]).value);
    Path= Path + KeysRegister[i]+ "=" + Val;
    //Add & for all entries before the last one
    if(i != KeysRegister.length-1)
    {
      Path+="&";
    }
  }
  return Path;
};

//Check if all boxes have an input value
var ValidateInputAllRegister = function()
{
  for(i =0; i<InputBoxesNamesRegister.length; i++)
  {
    if(document.getElementById(InputBoxesNamesRegister[i]).value == "")
    {
      return false;
    }
  }
  //validate password confirm
  var psswrd = document.getElementById("password").value;
  var c_psswrd = document.getElementById("confirm_password").value;
  if(psswrd!=c_psswrd)
  {
    return false;
    console.log("Passwords do not match")
  }
  return true;
};

var ClearInputBoxesRegister = function()
{
  for(i =0; i<InputBoxesNamesRegister.length; i++)
  {
      document.getElementById(InputBoxesNamesRegister[i]).value = "";
  }
};

//------------------------USERS LOGIN---------------------------
var myURLogin = "http://localhost:8080/sessions";
var InputBoxesNamesLogin = ["loginemail", "loginpassword"];
var KeysLogin = ["email", "password"];


//--------------------POST-----------------------
var LoginBtn = document.getElementById("LoginBtn");
LoginBtn.onclick = function()
{
  if(ValidateInputAllLogin())
  {
      POSTLogin();
  }
  else
  {
    console.log("Register Input error");
  }
};

var POSTLogin = function()
{
  var RequestPostLogin = new XMLHttpRequest();
  RequestPostLogin.onreadystatechange = function()
  {
    if (RequestPostLogin.readyState == XMLHttpRequest.DONE)
    {
      if(RequestPostLogin.status == 200)
      {
        ClearInputBoxesLogin();
        GetAnimals();
        //console.log(RequestPost.responseText);
      }
      else
      {
        console.log("Register Failed");
      }
    }
  };

  //Request Code
  var Path = ConstructPathPOSTLogin();
  console.log(Path);
  //Send Request
  RequestPostLogin.open("POST", myURLogin);
  RequestPostLogin.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestPostLogin.withCredentials = true;
  RequestPostLogin.send(Path);
};

var ConstructPathPOSTLogin = function()
{
  var Path = "";
  var Val ="";
  for(i =0; i<KeysLogin.length; i++)
  {
    Val = encodeURIComponent(document.getElementById(InputBoxesNamesLogin[i]).value);
    Path= Path + KeysLogin[i]+ "=" + Val;
    //Add & for all entries before the last one
    if(i != KeysLogin.length-1)
    {
      Path+="&";
    }
  }
  return Path;
};

//Check if all boxes have an input value
var ValidateInputAllLogin = function()
{
  for(i =0; i<InputBoxesNamesLogin.length; i++)
  {
    if(document.getElementById(InputBoxesNamesLogin[i]).value == "")
    {
      return false;
    }
  }
  return true;
};

var ClearInputBoxesLogin = function()
{
  for(i =0; i<InputBoxesNamesLogin.length; i++)
  {
      document.getElementById(InputBoxesNamesLogin[i]).value = "";
  }
};

//----------------------------------------------------ANIMALS--------------------------------------------------------------------
var myURLAnimals = "http://localhost:8080/animals";
var InputBoxesNames = ["name", "animal", "breed", "color", "gender", "age"];
var Keys = ["name", "animal", "type", "color", "gender", "age"];
var AnimalKeys = ["id","name", "animal", "type", "color", "gender", "age"];
var Headers = ["ID", "Name", "Type of Animal", "Breed", "Color", "Gender", "Age"];//To create headers of table
//------------------GET ALL ITEMS--------------------------

var GetAllBtn = document.getElementById("GetAllBtn");
GetAllBtn.onclick = function()
{
  GetAnimals();
};

var GetAnimals = function()
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
        CreateTable(JSON.parse(RequestGetAll.responseText));
        ClearInputBoxes();
      }
      else
      {
        console.log("Get All Items Failed");
      }
    }
  };

  //ConstructPath
  RequestGetAll.open("GET", myURLAnimals);//Set request type
  RequestGetAll.withCredentials = true;
  RequestGetAll.send();//Send Request
};

//----------------------GET ONE ITEM------------------------

var FindBtn = document.getElementById("FindBtn");
FindBtn.onclick = function()
{
  if(ValidateInputId())
  {
    var ID = document.getElementById("id").value;
    GetAnimal(false, ID);
  }
  else
  {
    console.log("Invalid ID");
  }
};

var Fill_Input_Boxes = function(myJSON)
{
  // console.log(myJSON);
  for(i=0;i<InputBoxesNames.length ; i++)
  {
      var Box = document.getElementById(InputBoxesNames[i]);
      Box.value = myJSON["Animals"][0][Keys[i]];
  }
};

var GetAnimal = function(Update, ID)
{
  var RequestGet = new XMLHttpRequest();
  RequestGet.onreadystatechange = function()
  {
    if (RequestGet.readyState == XMLHttpRequest.DONE)
    {
      if (RequestGet.status == 200)
      {
        console.log("Get Item Success");
        console.log(RequestGet.responseText);
        if(Update == false)
        {
            CreateTable(JSON.parse(RequestGet.responseText));
        }
        Fill_Input_Boxes(JSON.parse(RequestGet.responseText));
      }
      else
      {
        console.log("Get Item Failed");
        alert("Couldn't Find Item. \n ID Not Found");
      }
    }
  };

  RequestGet.open("GET", (myURLAnimals+"/"+ID));//Set request type
  RequestGet.withCredentials = true;
  RequestGet.send();//Send Request
};

//Gets called when clicked on id buttons
var ConnectIDButtonsGet = function()
{
  ID = this.innerHTML;
  GetAnimal(true, ID);
  document.getElementById("id").value = ID;
}

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
        GetAnimals();
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
  RequestPost.open("POST", myURLAnimals);
  RequestPost.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestPost.withCredentials = true;
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
        GetAnimals();
      }
      else
      {
        console.log("Delete Item Failed");
      }
    }
  };

  //ConstructPath
  RequestDel.open("DELETE", (myURLAnimals+"/"+ID));//Set request type
  RequestDel.withCredentials = true;
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
        GetAnimal(false, ID);//False to display single table
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
  RequestPut.open("PUT", (myURLAnimals+"/"+ID));
  RequestPut.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestPut.withCredentials = true;
  RequestPut.send(Path);
};

var ConnectIDButtonsUpdate = function()
{
  ID = this.value;
  GetAnimal(false, ID);
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

//----------------------------------CREATE ANIMALS TABLE----------------------

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

var CreateTable = function(data)
{
  var Table = document.getElementById("Data");
  Table.innerHTML = "";
  CreateTableHeaders(Table);
  for (collection in data)
  {//get into collection main array
    for(i=0; i<data[collection].length ; i++)
    {//grab eacj entry in response
      var NewRow = document.createElement("tr");
      for(j=0; j<AnimalKeys.length; j++)
      {//get into each of the entriesvar Col = document.createElement("td");
        key = AnimalKeys[j];
        //console.log(data[collection][i])
        var Col = document.createElement("td");
        if(key=="id") //Make a button for ID
        {
          //Find Button
          var But = document.createElement("button");
          id = data[collection][i][key];
          //Connect Button to function
          But.onclick = ConnectIDButtonsGet;
          But.innerHTML=data[collection][i][key];
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
          Col.innerHTML = data[collection][i][key];
        }
        NewRow.appendChild(Col);
      }
      Table.appendChild(NewRow);
    }
  }
};

GetAnimals();
