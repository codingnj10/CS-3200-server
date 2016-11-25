import json
from Session_Store import *
from urllib.parse import urlparse, parse_qs
from http.server import BaseHTTPRequestHandler, HTTPServer
from AnimalsDB import *
from UsersDB import *
from http import cookies
from passlib.hash import bcrypt

mySessions = SessionStore()

class myServer(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "Content-type")
        self.end_headers()
        return

    #------------------------------GET------------------------------------
    def do_GET(self):
        # #Connect to DB
        dbanimals=Animals()
        dbusers = Usersdb()
        #Animals DB
        #Get Item
        if self.path.startswith("/animals/"):
            if self.LoadSession(dbusers):
                ID = self.getIDFromPath()
                #find if item is in the database
                if(dbanimals.FindItem(ID)):
                    self.send200()
                    #Get whole entry(LIST) from database
                    entry = dbanimals.getAnimal(ID)

                    #Convert json to string
                    StringEntry = json.dumps(entry)
                    self.wfile.write(bytes(StringEntry, "utf-8"))
                else:
                    self.NotFound()
            else:
                self.NotAuthorized()

        #Get Collection
        elif self.path.startswith("/animals"):
            #if session was loaded succesfully, send database info
            if self.LoadSession(dbusers):
                self.send200()
                #Get DB and Convert json to string
                StringDatabase = json.dumps(dbanimals.getAnimals())
                self.wfile.write(bytes(StringDatabase, "utf-8"))
            else:
                self.NotAuthorized()
        else:
            self.NotFound()
        return



#-----------------------------------------------POST-------------------------------
    def do_POST(self):
        #Connect to database
        db=Animals()
        dbusers = Usersdb()

        #-------------------------------------CREATE USER-------------------------------
        if self.path.startswith("/users"):
            #Find lenght of content in header
            Lenght = int(self.headers['Content-Length'])

            #Reading from url
            data = self.rfile.read(int(Lenght)).decode("utf-8")#gets path as string
            Parsed_Data = parse_qs(data)#Converts data to dictionary "Key and values(lists)"

            #EncryptPassword
            epassword = self.EncryptPassword(Parsed_Data["password"][0])
            #Create entry in parsed data key="encrypted_password"
            Parsed_Data["encrypted_password"] = [epassword]
            # print(Parsed_Data)

            #Load_Cookie
            self.Load_Cookie()
            if dbusers.createUser(Parsed_Data):
                #Find the id of newly created entry
                new_entry_id = dbusers.FindIDbyEmail(Parsed_Data["email"][0])


                #Create a session and store its session id in cookie
                self.PutID_In_Cookie_Session(new_entry_id)
                self.sendCreated()
                #self.Load_Cookie()
            else:
                self.sendNotCreated()

        #----------------------------------LOGIN--------------------------
        elif self.path.startswith("/sessions"):
            #Load_Cookie
            self.Load_Cookie()
            #Get data from form
            Lenght = int(self.headers['Content-Length'])
            data = self.rfile.read(int(Lenght)).decode("utf-8")#gets path as string
            Parsed_Data = parse_qs(data)#Converts data to dictionary "Key and values(lists)"

            #Find if email is in database
            if dbusers.FindByEmail(Parsed_Data["email"][0]):
                #Find if password inputed matches the one id database
                epsswrd = dbusers.getEncryptedPassword(Parsed_Data["email"][0])
                if self.VeryfyPassword(Parsed_Data["password"][0], epsswrd):
                    #Find the id of user
                    new_entry_id = dbusers.FindIDbyEmail(Parsed_Data["email"][0])

                    #Create a new session and put id on cookie
                    self.PutID_In_Cookie_Session(new_entry_id)
                    self.send200()
                else:
                    self.NotAuthorized()
            else:
                self.NotAuthorized()

        #----------------------------------CREATE ANIMAL--------------------------
        elif self.path.startswith("/animals"):
            if self.LoadSession(dbusers):
                self.sendCreated()

                #Find lenght of content in header
                Lenght = int(self.headers['Content-Length'])

                #Reading from url
                data = self.rfile.read(int(Lenght)).decode("utf-8")#gets path as string
                Parsed_Data = parse_qs(data)#Converts data to dictionary "Key and values(lists)"
                #Insert ito database
                db.putAnimal(Parsed_Data)
                self.wfile.write(bytes("Created", "utf-8"))
            else:
                self.NotAuthorized()

        else:
            self.NotFound()
        return

#--------------------------------------COOKIES------------------------------
    #Makes an empty cookie
    def Create_Cookie(self):
        self.Cookie = cookies.SimpleCookie()
        return

    def Load_Cookie(self):
        #Headers are dictionaries
        #print(self.headers)
        if "Cookie" in self.headers:
            #if cookie was on header grab its contents
            self.Cookie = cookies.SimpleCookie(self.headers['Cookie'])
            return True
        else:
            #no cookie was found so create a new one
            self.Create_Cookie()
            return False
        #True if cookie was loaded, false if not

    def PutNewSessionIDInCookie(self, dbid):
        #Create Session ID and store both returned ID's in tuple
        SSIDs = mySessions.create_session()
        mySessions.Put_User_ID_On_Session(SSIDs[0], dbid)
        #Put SSID and signature into cookie
        self.Cookie["SSID"] = SSIDs[0]
        self.Cookie["Second_SSID"] = SSIDs[1]
        return

    def PutID_In_Cookie_Session(self,dbid):
        mySessions.Put_User_ID_On_Session(self.Cookie["SSID"].value, dbid)

    def Send_Cookie(self):
        for morsel in self.Cookie.values():
            self.send_header('Set-Cookie', morsel.OutputString())
        print("Cookie",self.Cookie)
        return

    def getDataFromSessionIDCookie(self):
        #Gets session if double Session ID's are bypassed
        return mySessions.getSession(self.Cookie["SSID"].value, self.Cookie["Second_SSID"].value)


#------------------------------------SESSIONS---------------------------------------
    #Return True if load was a success, otherwise false
    def LoadSession(self, dbusers):
        #If cookie is found try and log them in using cookie's info
        if self.Load_Cookie():
            #gets ID from SSID stored in cookie
            #print("Load Cookie Successful")
            ID = self.getDataFromSessionIDCookie()
            #print(ID)
            #Couldn't find a matching session in SessionStores
            if ID == None:
                pass
            else:
                #Find Record in Database by using id
                UserRecord = dbusers.getUser(ID)
                #if user was not found in database do not log them in
                if UserRecord == None:
                    pass
                else:
                    return True
        #If something goes wrong while loading session
        #Create a new empty session
        self.CreateEmptySession()
        return False

    def CreateEmptySession(self):
        #Create a new empty session
        SSIDs = mySessions.create_session()
        #StoreSessionID in Cookie
        self.Cookie["SSID"] = SSIDs[0]
        self.Cookie["Second_SSID"] = SSIDs[1]
        return

#-----------------------------------HASH PASSWORD------------------------------------
    def EncryptPassword(self, password):
        h = bcrypt.encrypt(password)
        return h

    def VeryfyPassword(self, password, encryp_password):
        #checks if password imputed matches the encrypted password
        return bcrypt.verify(password, encryp_password)

#------------------------------------------------------PUT---------------------------------

    def do_PUT(self):
        #Connect to database
        db=Animals()
        dbusers = Usersdb()

        if self.path.startswith("/animals/"):
            if self.LoadSession(dbusers):
                ID = self.getIDFromPath()

                #find if item exists in database
                if(db.FindItem(ID)):
                    self.sendCreated()

                    #Find lenght of content in header
                    Lenght = int(self.headers['Content-Length'])

                    #Reading from url
                    data = self.rfile.read(int(Lenght)).decode("utf-8")#gets path as string
                    Parsed_Data = parse_qs(data)#Converts data to dictionary "Key and values(lists)"

                    #Update database
                    db.updateAnimal(ID, Parsed_Data)

                    self.wfile.write(bytes("Updated", "utf-8"))
                else:
                    self.NotFound()
            else:
                self.NotAuthorized()
        else:
            self.NotFound()
        return

    def do_DELETE(self):
        #Connect to database
        db=Animals()
        dbusers = Usersdb()
        if self.path.startswith("/animals/"):
            if self.LoadSession(dbusers):
                ID = self.getIDFromPath()

                if(db.FindItem(ID)):
                    self.sendNoContent()
                    db.deleteAnimal(ID)
                    self.wfile.write(bytes("Deleted", "utf-8"))
                else:
                    self.NotFound()
            else:
                self.NotAuthorized()
        else:
            self.NotFound()
        return

    #------------------------------------AUTHENTICATE------------------------------------



    #-----------------------------------GET ID FROM PATH-------------------------------------

    def getIDFromPath(self):
        item =  ""
        #find index of last t
        index = len(self.path)-1
        while index >=0:
            if self.path[index] == '/':
                break
            index-=1
        #Grabs everything after / and before ?
        index+=1
        while (index <len(self.path) and self.path[index] != "?"):
            item+=self.path[index]
            index+=1
        return item

    def send200(self):
        self.send_response(200)
        self.send_header('Content-type','json/application')
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header

    def sendCreated(self):
        self.send_response(201)
        self.send_header('Content-type','text/plain')
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header
        self.wfile.write(bytes("Registration Succesful", "utf-8"))

    def sendAccepted(self):
        self.send_response(202)
        self.send_header('Content-type','text/plain')
        self.Send_Cookie()        #No Content
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header
        self.wfile.write(bytes("Login Succesful", "utf-8"))

    def sendNoContent(self):
        self.send_response(204)
        self.send_header('Content-type','text/plain')
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header


    def sendNotCreated(self):
        self.send_response(422)
        self.send_header('Content-type','text/plain')
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header
        self.wfile.write(bytes("Duplicated email", "utf-8"))

    def NotFound(self):
        self.send_response(404)
        self.send_header('Content-type','text/html')
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header
        self.wfile.write(bytes("<p> Not Found </p>", "utf-8"))
        return

    def NotAuthorized(self):
        self.send_response(401)
        self.send_header('Content-type','text/plain')
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header
        self.wfile.write(bytes("Email or Password Didn't Match", "utf-8"))
        return





def run():
    listen = ('127.0.0.1', 8080)
    server = HTTPServer(listen,myServer)
    print ("listening.......")
    server.serve_forever()

run()
