import sqlite3

class Usersdb:
    def __init__(self):
        self.databasefile = "users.db"
        self.Collection = "users"
        self.databasekeys = ["id","fname", "lname", "email", "encrypted_password", "address", "phone", "city", "state"]
        #Connect to database
        self.connection = sqlite3.connect(self.databasefile)
        self.cursor = self.connection.cursor()
        self.database = self.LoadDatabase()
        #print (self.database)
        return

    def __del__(self):
        self.connection.close()

    def getUsers(self):
        return self.database

    #Get encrypted password linked to email account
    def getEncryptedPassword(self, email):
        for row in self.cursor.execute("SELECT encrypted_password FROM users WHERE email==(?)", [email]):
            return (row[0])


    def getUser(self, ID):
        myentry = {self.Collection: []}
        for entrydict in self.database[self.Collection]:
            if entrydict["id"] == int(ID):
                myentry[self.Collection].append(entrydict)
                return myentry
        #if the user is not found return none
        return None

    #Finds if user exists on database by finding email
    def FindByEmail(self, email):
        #SELECT recors that email match the email passed on
        for row in self.cursor.execute("SELECT * FROM users WHERE email==(?)", [email]):
            #if row has data in it, we found a duplicate
            if row != None:
                return True
        return False

    def FindIDbyEmail(self, email):
        for row in self.cursor.execute("SELECT id FROM users WHERE email==(?)", [email]):
            return (row[0])

    def createUser(self, data):
        try:
            #Find if email is a duplicate, if not insert it
            if(self.FindByEmail(data["email"][0])  == False):
            #Execute the query
                self.cursor.execute("INSERT INTO users(fname, lname, email, encrypted_password, address, phone, city, state) VALUES (?,?,?,?,?,?,?,?)", [data[self.databasekeys[1]][0], data[self.databasekeys[2]][0], data[self.databasekeys[3]][0], data[self.databasekeys[4]][0], data[self.databasekeys[5]][0], data[self.databasekeys[6]][0], data[self.databasekeys[7]][0], data[self.databasekeys[8]][0]])
                self.connection.commit()
                return True
            print("duplicated email")
            return False
        except Exception as e:
            print(e)
            return False

    def updateUser(self, ID, data):
        #Execute the query
        self.cursor.execute("UPDATE users SET fname=(?), lname =(?), email=(?), encrypted_password=(?), address=(?), phone=(?), city=(?), state=(?) WHERE id==(?)", [data[self.databasekeys[1]][0], data[self.databasekeys[2]][0], data[self.databasekeys[3]][0], data[self.databasekeys[4]][0], data[self.databasekeys[5]][0], data[self.databasekeys[6]][0], data[self.databasekeys[7]][0], data[self.databasekeys[8]][0], int(ID)])
        self.connection.commit()
        return

    def deleteUser(self, ID):
        self.cursor.execute("DELETE FROM users WHERE id=(?)", [int(ID)])
        self.connection.commit()

    def LoadDatabase(self):
        #Make a json file
        database = {self.Collection: []}
        for row in self.cursor.execute("SELECT * FROM users"):
            rowDict ={}
            for i in range(len(row)):
                rowDict[self.databasekeys[i]]=row[i]
            database[self.Collection].append(rowDict)
        return database

    def FindItem(self, item):
        if item=="":
            return False
        for entrydict in self.database[self.Collection]:
            if entrydict["id"] == int(item):
                return True
        return False
