import json
from urllib.parse import urlparse, parse_qs
from http.server import BaseHTTPRequestHandler, HTTPServer
from AnimalsDB import *

class myServer(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "Content-type")
        self.end_headers()
        return

    def do_GET(self):
        #Connect to DB
        db=Animals()

        #Get Item
        if self.path.startswith("/animals/"):
            ID = self.getIDFromPath()
            #find if item is in the database
            if(db.FindItem(ID)):
                self.send200()
                #Get whole entry(LIST) from database
                entry = db.getAnimal(ID)

                #Convert json to string
                StringEntry = json.dumps(entry)
                self.wfile.write(bytes(StringEntry, "utf-8"))
            else:
                self.NotFound()

        #Get Collection
        elif self.path.startswith("/animals"):
            self.send200()
            #Get DB and Convert json to string
            StringDatabase = json.dumps(db.getAnimals())
            self.wfile.write(bytes(StringDatabase, "utf-8"))
        else:
            self.NotFound()
        return

    def do_POST(self):
        #Connect to database
        db=Animals()

        if self.path.startswith("/animals"):
            self.send201()

            #Find lenght of content in header
            Lenght = int(self.headers['Content-Length'])

            #Reading from url
            data = self.rfile.read(int(Lenght)).decode("utf-8")#gets path as string
            Parsed_Data = parse_qs(data)#Converts data to dictionary "Key and values(lists)"
            #Insert ito database
            db.putAnimal(Parsed_Data)
            self.wfile.write(bytes("Created", "utf-8"))
        else:
            self.NotFound()
        return

    def do_PUT(self):
        #Connect to database
        db=Animals()

        if self.path.startswith("/animals/"):
            ID = self.getIDFromPath()

            #find if item exists in database
            if(db.FindItem(ID)):
                self.send201()

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
            self.NotFound()
        return

    def do_DELETE(self):
        #Connect to database
        db=Animals()
        if self.path.startswith("/animals/"):
            ID = self.getIDFromPath()

            if(db.FindItem(ID)):
                self.send204()
                db.deleteAnimal(ID)
                self.wfile.write(bytes("Deleted", "utf-8"))
            else:
                self.NotFound()
        else:
            self.NotFound()

        return

    def getIDFromPath(self):
        item =  ""
        #find index of last /
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
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()#points end of header

    def send201(self):
        self.send_response(201)
        self.send_header('Content-type','text/plain')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()#points end of header

    def send204(self):
        self.send_response(204)
        self.send_header('Content-type','text/plain')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()#points end of header

    def NotFound(self):
        self.send_response(404)
        self.send_header('Content-type','text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()#points end of header
        self.wfile.write(bytes("<p> Not Found </p>", "utf-8"))
        return





def run():
    listen = ('127.0.0.1', 8080)
    server = HTTPServer(listen,myServer)
    print ("listening.......")
    server.serve_forever()

run()
