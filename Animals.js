
//------------------------USERS REGISTER---------------------------
var myURLRegister = "http://localhost:8080/users";
var InputBoxesNamesRegister = ["fname", "lname", "address", "city", "state", "phone", "email", "password", "confirm_password"];
var KeysRegister = ["fname", "lname", "address", "city", "state", "phone", "email", "password"];

//------------------------USERS LOGIN---------------------------
var myURLogin = "http://localhost:8080/sessions";
var InputBoxesNamesLogin = ["loginemail", "loginpassword"];
var KeysLogin = ["email", "password"];

//----------------------------------------------------ANIMALS--------------------------------------------------------------------
var myURLAnimals = "http://localhost:8080/animals";
var InputBoxesNames = ["name", "animal", "breed", "color", "gender", "age"];
var Keys = ["name", "animal", "type", "color", "gender", "age"];
var AnimalKeys = ["id","name", "animal", "type", "color", "gender", "age"];
var Headers = ["ID", "Name", "Type of Animal", "Breed", "Color", "Gender", "Age"];//To create headers of table

//--------------------POST-----------------------


//--------------------------------------GET--------------------------------
var Get = function(type, Update , ID=0)
{
  var RequestGet = new XMLHttpRequest();
  RequestGet.onreadystatechange = function()
  {
    if (RequestGet.readyState == XMLHttpRequest.DONE)
    {
      if (RequestGet.status == 200)
      {
        console.log("Get Items Success");
        if(type == "Animals" || Update == true)//Whether or not to update table
        {
          CreateTable(JSON.parse(RequestGet.responseText));
          ClearInputBoxes();
        }
        //For get of a single animal fill input boxes for update
        if(type == "Animal")
        {
          Fill_Input_Boxes(JSON.parse(RequestGet.responseText));
        }

        //console.log(RequestGetAll.responseText);
      }
      else
      {
        console.log("Get All Items Failed");
      }
    }
  };

  //Construct URL
  if(type == "Animals")
  {
    URL = myURLAnimals;
  }
  else if(type == "Animal")
  {
    URL = myURLAnimals + "/" + ID;
  }
  RequestGet.open("GET", URL);
  RequestGet.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestGet.withCredentials = true;
  RequestGet.send();
};


//------------------GET ANIMALS--------------------------

var GetAllBtn = document.getElementById("GetAllBtn");
GetAllBtn.onclick = function()
{
  Get("Animals", true);
};

//----------------------GET ONE ANIMAL------------------------

var FindBtn = document.getElementById("FindBtn");
FindBtn.onclick = function()
{
  if(ValidateInputId())
  {
    var ID = document.getElementById("id").value;
    Get("Animal", true, ID);
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


//Gets called when clicked on id buttons
var ConnectIDButtonsGet = function()
{
  ID = this.innerHTML;
  Get("Animal", false, ID);
  document.getElementById("id").value = ID;
}



//--------------------POST-----------------------

var POST = function(type)
{
  var RequestPost = new XMLHttpRequest();
  RequestPost.onreadystatechange = function()
  {
    if (RequestPost.readyState == XMLHttpRequest.DONE)
    {
      if (RequestPost.status == 200)//Login
      {
        ClearInputBoxesLogin();
        Get("Animals", true);
      }
      else if(RequestPost.status == 201)
      {
        if(type == "Animals")//Create Animal
        {
          ClearInputBoxes();
          Get("Animals", true);
        }
        else if (type == "Register")//Register
        {
            ClearInputBoxesRegister();
            Get("Animals", true);
        }
        //console.log(RequestPost.responseText);
      }
      else
      {
        console.log("POST Failed");
      }
    }
  };

  //ConstructPath and URL
  if(type == "Animals")
  {
    Path = ConstructPathPOST();
    URL = myURLAnimals;
  }
  else if (type == "Register")
  {
    Path = ConstructPathPOSTRegister();
    URL = myURLRegister;
  }
  else if (type == "Login")
  {
    Path = ConstructPathPOSTLogin();
    URL = myURLogin;
  }

  //Send Request
  RequestPost.open("POST", URL);
  RequestPost.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestPost.withCredentials = true;
  RequestPost.send(Path);
};

//------ANIMALS-------
var CreateBtn = document.getElementById("CreateBtn");
CreateBtn.onclick = function()
{
  if(ValidateInputAll())
  {
      POST("Animals");
  }
  else
  {
    console.log("Fill all the info in form");
  }
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

//-------------REGISTER--------------------------
var RegisterBtn = document.getElementById("RegisterBtn");
RegisterBtn.onclick = function()
{
  if(ValidateInputAllRegister())
  {
      POST("Register");
  }
  else
  {
    console.log("Register Input error");
  }
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

//------------------------------LOGIN---------------------------

var LoginBtn = document.getElementById("LoginBtn");
LoginBtn.onclick = function()
{
  if(ValidateInputAllLogin())
  {
      POST("Login");
  }
  else
  {
    console.log("Register Input error");
  }
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
        Get("Animals", true);
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
        Get("Animal",true, ID);//False to display single table
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
  Get("Animal", true, ID);
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

Get("Animals", true);
