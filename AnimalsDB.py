import sqlite3

class Animals:
    def __init__(self):
        self.databasefile = "Animals.db"
        self.Collection = "Animals"
        #Connect to database
        self.connection = sqlite3.connect(self.databasefile)
        self.cursor = self.connection.cursor()
        self.database = self.LoadDatabase()
        return

    def __del__(self):
        self.connection.close()

    def getAnimals(self):
        return self.database

    def getAnimal(self, ID):
        myentry = {}
        for entry in self.database[self.Collection]:
            if entry[0] == int(ID):
                myentry[self.Collection] = entry
                return myentry

    def putAnimal(self, data):
        #Execute the query
        self.cursor.execute("INSERT INTO Animals(name, animal, type, color, gender, age) VALUES (?,?,?,?,?,?)", [data["name"][0], data["animal"][0], data["type"][0], data["color"][0], data["gender"][0], int(data["age"][0])])
        self.connection.commit()
        return

    def updateAnimal(self, ID, data):
        #Execute the query
        self.cursor.execute("UPDATE Animals SET name=(?), animal =(?), type=(?), color=(?), gender=(?), age=(?) WHERE id==(?)", [data["name"][0], data["animal"][0], data["type"][0], data["color"][0], data["gender"][0], int(data["age"][0]), int(ID)])
        self.connection.commit()
        return

    def deleteAnimal(self, ID):
        self.cursor.execute("DELETE FROM Animals WHERE id=(?)", [int(ID)])
        self.connection.commit()

    def LoadDatabase(self):
        #Make a json file
        database = {self.Collection: []}
        for row in self.cursor.execute("SELECT * FROM Animals"):
            rowList =[]
            for entry in row:
                rowList.append(entry)
            database[self.Collection].append(rowList)
        return database

    def FindItem(self, item):
        if item=="":
            return False
        for entry in self.database[self.Collection]:
            if entry[0] == int(item):
                return True
        return False
