import sqlite3

class TicketsDB:
    def __init__(self):
        self.databasefile = "tickets.db"
        self.Collection = "tickets"
        self.databasekeys = ["id","name", "age", "guest", "random_token"]
        #Connect to database
        self.connection = sqlite3.connect(self.databasefile)
        self.cursor = self.connection.cursor()
        # self.database = self.LoadDatabase()
        #print (self.database)
        return

    def __del__(self):
        self.connection.close()

    def CreateTicketsTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL, age INTEGER NOT NULL, guest VARCHAR(255) NOT NULL, random_token INTEGER NOT NULL)")
        self.connection.commit()

    def getAllTickets(self):
        return self.database

    def createTicket(self, data):
        #Execute the query
        self.cursor.execute("INSERT INTO tickets(name, age, guest, random_token) VALUES (?,?,?,?)", [data[self.databasekeys[1]][0], int(data[self.databasekeys[2]][0]), data[self.databasekeys[3]][0], data[self.databasekeys[4]][0]])
        self.connection.commit()

    def LoadDatabase(self):
        #Make a json file
        self.database = []
        for row in self.cursor.execute("SELECT * FROM tickets"):
            rowDict ={}
            for i in range(len(row)):
                rowDict[self.databasekeys[i]]=row[i]
            self.database.append(rowDict)
