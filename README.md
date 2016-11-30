# f16-resourceful-franice
## Attributes:
#### Table name: Animals
* id
* name
* animal
* type
* color
* gender
* age

#### Table name: users
* id
* fname
* lname
* email
* encrypted_password
* address
* phone
* city
* state

## Schema:
#### Table name: Animals
CREATE TABLE "Animals" (id INTEGER PRIMARY KEY, name VARCHAR(64) NOT NULL,
animal VARCHAR(20) NOT NULL,
type VARCHAR NOT NULL,
color VARCHAR(20) NOT NULL,
gender VARCHAR(10) NOT NULL,
age INTEGER);

#### Table name: users
CREATE TABLE "users" (id INTEGER PRIMARY KEY,
fname VARCHAR NOT NULL,
lname VARCHAR NOT NULL,
email VARCHAR NOT NULL,
encrypted_password VARCHAR NOT NULL,
address VAR CHAR,
phone VARCHAR,
city VARCHAR,
state VARCHAR(2) NOT NULL);

## REST
### Table name: Animals
#### Retrieve
GET /animals/*ID*
#### List
GET /animals
#### Create
POST /animals
#### Put
PUT /animals/*ID*
#### Delete
DELETE /animals/*ID*

### Table name: users
#### Retrieve
GET /users
#### Create
POST /users
#### Login
POST /sessions
#### Logout
POST /logout
