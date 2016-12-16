var InputBoxesNames = ["name", "age", "guest"];
var DatabaseKeys = ["name", "age", "guest"];
var URL = "http://localhost:8080/tickets";
//Submit Button
var SubmitBtn = document.getElementById("SubmitBtn");
SubmitBtn.onclick = function()
{
  if(AreAllInputBoxesFilled())
  {
    POST();
  }

};

var AreAllInputBoxesFilled = function()
{
  for(var i = 0; i<InputBoxesNames.length;i++)
  {
    if(document.getElementById(InputBoxesNames[i]).value.trim() == "")
    {
      alert("Fill All Input Boxes");
      return false;
    }
    //Check if age field has a number on it
    else if (InputBoxesNames[i]=="age")
    {
      var Age = document.getElementById(InputBoxesNames[i]).value;
      for(var j=0; j < Age.length ; j++)
      {
        //if current characters is not a number by comparing ascii values
        if(Age[j].charCodeAt(0)<48 || Age[j].charCodeAt(0)>57)
        {
          alert("Age must be a number");
          return false;
        }
      }
    }
  }
  return true;
};

//-----------------------------CREATE TICKET--------------------------
var POST = function()
{
  var RequestPOST = new XMLHttpRequest();
  RequestPOST.onreadystatechange = function()
  {
    if(RequestPOST.readyState == XMLHttpRequest.DONE)
    {
      if(RequestPOST.status == 201)
      {
        console.log("Ticket Created")
        ClearInputBoxes();
        GET();
      }
      else if(RequestPOST.status == 403)
      {
        alert(RequestPOST.responseText);
      }
      else
      {
        alert(RequestPOST.responseText);
      }
    }
  }
  //Build Query
  var Query = ConstructQueryPOST();

  //SendRequest
  RequestPOST.open("POST", URL);
  RequestPOST.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestPOST.withCredentials = true;
  RequestPOST.send(Query);
};

var ConstructQueryPOST = function()
{
  var Query = "";
  var Val="";
  for(var i=0; i<InputBoxesNames.length;i++)
  {
    Val = encodeURIComponent(document.getElementById(InputBoxesNames[i]).value);
    Query= Query + DatabaseKeys[i] + "=" + Val;
    if(i < InputBoxesNames.length -1)
    {
      Query+="&";
    }
  }
  return Query;
};

var ClearInputBoxes = function()
{
  for(var i= 0; i<InputBoxesNames.length;i++)
  {
    document.getElementById(InputBoxesNames[i]).value = "";
  }
}

//--------------------------------------GET TICKETS------------------------------
var GET = function()
{
  var RequestGet = new XMLHttpRequest();
  RequestGet.onreadystatechange = function()
  {
    if(RequestGet.readyState == XMLHttpRequest.DONE)
    {
      if(RequestGet.status == 200)
      {
        DisplayTickets(JSON.parse(RequestGet.responseText));
        console.log("Get Tickets Success");
      }
      else
      {
        console.log("GET TICKETS FAILED");
      }
    }
  };
  //Send Request
  RequestGet.open("GET", URL);
  RequestGet.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  RequestGet.withCredentials = true;
  RequestGet.send();
};

var DisplayTickets = function(data)
{
  var DIV = document.getElementById("Tickets_Div");
  DIV.innerHTML = "";
  var Ticket = "";
  var DayOfWeek = new Date().getDay();
  for(var i=0; i<data.length ; i++)
  {
    Ticket = data[i]["name"] + " " + data[i]["guest"] + " " + data[i]["age"] + " " + data[i]["random_token"] + " ";
    if(data[i]["random_token"] == DayOfWeek)
    {
      //true makes golden ticket
      MakeGoldenTicket(data[i],DIV, true);
    }
    else
    {
      //False makes normal ticket
      MakeGoldenTicket(data[i],DIV, false);
    }
  }
};

var MakeGoldenTicket = function(data, DIV, golden)
{
  var Ticket = document.createElement("div");
  if(golden)
  {
    Ticket.className = "Golden_Ticket";
  }
  else
  {
    Ticket.className = "Normal_Ticket";
  }

  //Name
  var Item = document.createElement("text");
  Item.innerHTML = "Name: " + data["name"] + "<br>";
  Ticket.appendChild(Item);
  //Age
  var Item = document.createElement("text");
  Item.innerHTML = "Age: " + data["age"] + "<br>";
  Ticket.appendChild(Item);
  //Guest
  var Item = document.createElement("text");
  Item.innerHTML = "Guest: " + data["guest"] + "<br>";
  Ticket.appendChild(Item);

  DIV.appendChild(Ticket);
};

GET();
