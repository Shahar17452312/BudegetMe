import pg from "pg";
import request from "supertest";
import app from "../server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("pg", () => {
  const mClient = {
    query: jest.fn(),
    connect: jest.fn().mockResolvedValue(),
  };

  return { Client: jest.fn(() => mClient) };
});

var db=pg.Client();
beforeEach(() => {
 
  db.query.mockClear(); 
});

afterEach(() => {
  db.query.mockClear(); 
}
);




describe("Register", () => {


  it("should return token!", async () => {

    // mock של מצב שבו אין משתמש קיים
    db.query.mockResolvedValueOnce({
      rows: [] // אין משתמשים
    });

    // mock של הוספת משתמש חדש
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1 }] // משתמש חדש נרשם
    });

    // שלח בקשה לשרת
    const response = await request(app).post("/auth/register").send({
      name: "newUser",
      email: "user@gmail.com",
      password: "userpassword",
      date_of_creation: new Date().toISOString()
    });

    // בדוק שהסטטוס הוא 200
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(typeof(response.body.accessToken)).toBe("string");
    expect(response.body.refreshToken).toBeDefined();
    expect(typeof(response.body.refreshToken)).toBe("string");

    // בדוק שהקריאות ל-DB התבצעו כמצופה
    expect(db.query).toHaveBeenCalledTimes(2); // קריאה אחת לבדוק אם יש משתמש, אחת להוספה
  });

  it("should return status 400 (missing fields)", async () => {

    // שלח בקשה ללא שדות דרושים
    const response = await request(app).post("/auth/register").send({
      email: "user@gmail.com",
      password: "userpassword",
      date_of_creation: new Date().toISOString()
    });

    // בדוק שהסטטוס הוא 400
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing fields");

  });

  it("should return status 400 (user already registered)", async () => {
   

    // דימוי של יוזר קיים במערכת
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        name: "newUser",
        email: "user@gmail.com",
        password:await bcrypt.hash("userpassword",10),
        date_of_creation: new Date().toISOString()
      }]
    });

    // שלח בקשה עם נתוני משתמש שכבר קיים
    const response = await request(app).post("/auth/register").send({
      name: "newUser",
      email: "user@gmail.com",
      password: "userpassword",
      date_of_creation: new Date().toISOString()
    });

    // בדוק שהסטטוס הוא 400 ושההודעה היא על כך שהמשתמש כבר קיים
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("user is already registered");

    // בדוק שהקריאות ל-DB התבצעו כמצופה
    expect(db.query).toHaveBeenCalledTimes(1); // קריאה אחת בלבד לבדוק אם יש משתמש
  });

});


describe("Login",()=>{


  var date=new Date().toISOString();
  it("Login a user needs to return 200",async()=>{
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        name: "newUser",
        email: "user@gmail.com",
        password: await bcrypt.hash("userpassword",10),
        date_of_creation: date
      }]
    });

    const response=await request(app).post("/auth/login").send({
        name: "newUser",
        password: "userpassword",
    });

    expect(response.status).toBe(202);
    expect(response.body.message).toBe("Loged in");
    expect(typeof(response.body.refreshToken)).toBe("string");
    expect(typeof(response.body.accessToken)).toBe("string");
    expect(db.query).toHaveBeenCalledTimes(1);
  });


  it("try login with no missing fields (no name)",async()=>{
    const response=await request(app).post("/auth/login").send({
        password: "userpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing fields");
  });


  


  it("try login with no missing fields (no password)",async()=>{
    const response=await request(app).post("/auth/login").send({
        name:"newUser"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing fields");
  });




  it("try login with wrong password",async()=>{
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        name: "newUserrrrr",
        email: "user@gmail.com",
        password: await bcrypt.hash("userpassword",10),
        date_of_creation: date
      }]
    });

    const response=await request(app).post("/auth/login").send({
      name: "newUser",
      password: "nouserpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("wrong username or passowrd");
  });




  it("try login with wrong name user in DB ",async()=>{
    db.query.mockResolvedValueOnce({
      rows:[]
    });

    const response=await request(app).post("/auth/login").send({
      name: "oldUser",
      password: "userpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("user not found");
  });
});


describe("refresh token",()=>{
  var refreshToken=jwt.sign({id:1,name:"user"},process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn: process.env.REFRESH_TOKEN_EXPIRES_TIME});
  it("should return 200 with new access token",async()=>{
    const response=await request(app).post("/auth/refresh-token").send({
      refreshToken:refreshToken
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();

    
  });

  it("should return 401 (no refresh token in request)",async()=>{
    const response=await request(app).post("/auth/refresh-token").send({
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No refresh token provided");
    
  });
});
