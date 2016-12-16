import json
import random
from urllib.parse import urlparse, parse_qs
from http.server import BaseHTTPRequestHandler, HTTPServer
from TicketsDB import *
from http import cookies

class myServer(BaseHTTPRequestHandler):
    #------------------------------GET------------------------------------
    def do_GET(self):
        # #Connect to DB
        dbTickets=TicketsDB()
        #Get Item
        if self.path.startswith("/tickets"):
            dbTickets.LoadDatabase()
            StringDatabase = json.dumps(dbTickets.getAllTickets())
            self.Load_Cookie()
            self.send200()
            self.wfile.write(bytes(StringDatabase, "utf-8"))
        else:
            self.NotFound()
        return

#-----------------------------------------------POST-------------------------------
    def do_POST(self):
        #Connect to database
        dbTickets=TicketsDB()

        #-------------------------------------CREATE TICKET-------------------------------
        if self.path.startswith("/tickets"):
            if not self.Load_Cookie():
                #Find lenght of content in header
                Lenght = int(self.headers['Content-Length'])

                #Reading from url
                data = self.rfile.read(int(Lenght)).decode("utf-8")#gets path as string
                Parsed_Data = parse_qs(data)#Converts data to dictionary "Key and values(lists)"

                #Create random Token
                Parsed_Data["random_token"] = [random.randint(0,6)]
                try:
                    #Create ticket
                    dbTickets.createTicket(Parsed_Data)
                    self.PutOompaOnCookie()
                except Exception as e:
                    print(e)
                    self.sendNotCreated()
                    return
                self.sendCreated()
            else:
                self.sendForbidden()
        else:
            self.NotFound()
        return

#--------------------------------------COOKIES------------------------------
    def Load_Cookie(self):
        #Headers are dictionaries
        if "Cookie" in self.headers:
            #if cookie was on header grab its contents
            self.Cookie = cookies.SimpleCookie(self.headers['Cookie'])
            return True
        else:
            #no cookie was found so create a new one
            self.Cookie = cookies.SimpleCookie()
            return False

    def PutOompaOnCookie(self):
        self.Cookie["oompa"] = "loompa"

    def Send_Cookie(self):
        for morsel in self.Cookie.values():
            self.send_header('Set-Cookie', morsel.OutputString())
        return

    def send200(self):
        self.send_response(200)
        self.send_header('Content-type','json/application')
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])

        self.end_headers()#points end of header

    def sendCreated(self):
        self.send_response(201)
        self.send_header('Content-type','text/plain')
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.end_headers()#points end of header
        self.wfile.write(bytes("Ticket Created Succesfully", "utf-8"))

    def NotFound(self):
        self.send_response(404)
        self.send_header('Content-type','text/html')
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header
        self.wfile.write(bytes("<p> It seems that this resource has been lost in the chocolae pipes. An oompa lompa will be dispatched proptly to recover the artifact. </p>", "utf-8"))
        return

    def sendForbidden(self):
        self.send_response(403)
        self.send_header('Content-type','text/plain')
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header
        self.wfile.write(bytes("The Oompa Loompas have already recieved your ticket. Please try again tomorrow.", "utf-8"))
        return

    def sendNotCreated(self):
        self.send_response(422)
        self.send_header('Content-type','text/plain')
        self.Send_Cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.end_headers()#points end of header
        self.wfile.write(bytes("Check Your Inputs", "utf-8"))

def run():
    dbTickets = TicketsDB()
    dbTickets.CreateTicketsTable()
    dbTickets = None
    listen = ('127.0.0.1', 8080)
    server = HTTPServer(listen,myServer)
    print ("listening.......")
    server.serve_forever()

run()
