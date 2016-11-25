import os, base64

class SessionStore:
    def __init__(self):
        self.sessionData = {}

    def create_session(self):
        newSessionID = self.generate_New_Session_ID()
        #Make inside dictionary of session
        Second_SSID = self.generate_New_Session_ID()
        self.sessionData[newSessionID]= {"Second_SSID":Second_SSID}
        #Give back Both SSID's
        return newSessionID, Second_SSID

    def Put_User_ID_On_Session(self, SSID, user_id):
        self.sessionData[SSID]["user_id"]= user_id
        #print(self.sessionData)

    def getSession(self, SSID, Second_SSID):
        try:
            #Check if SSID is in sessionData
            if SSID in self.sessionData:
                #Check if Second SSID provided matches the on stored in sessionData
                if self.sessionData[SSID]["Second_SSID"] == Second_SSID:
                    #If double check is passed return id record id for that session
                    return self.sessionData[SSID]["user_id"]
            return None
        except Exception as e:
            #if no id is found in session(key error)
            print(e)
            return None

    def generate_New_Session_ID(self):
        r = os.urandom(32)
        #retunr a string for newSessionID
        return base64.b64encode(r).decode("utf-8")
