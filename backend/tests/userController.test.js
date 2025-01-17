import request from "supertest";
import app from "../server.js";
import pg from "pg";
import jwt from "jsonwebtoken";

jest.mock("pg",()=>{
    const myClient={
        connect:jest.fn(),
        query:jest.fn()
    };
    return {Client:jest.fn(()=>myClient)};
});

var db=pg.Client();
beforeEach(() => {
 
  db.query.mockClear(); 
});

afterEach(() => {
  db.query.mockClear(); 
}
);

const token=jwt.sign({id:1,name:"user1"},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:process.env.ACCESS_TOKEN_EXPIRES_TIME});

describe("check getUser request",()=>{
  it("should return 200 and return user details",async()=>{
    db.query.mockResolvedValueOnce({
      rows:[{name:"user1",
        email:"user1@gmail.com",
        date_of_creation:"some date"
      }]
    });
   const response=await request(app).get("/user/1").set("Authorization","Bearer "+token);

    expect(response.status).toBe(200);
    expect(response.body.name).toBeDefined();
    expect(response.body.email).toBeDefined();
    expect(response.body.date_of_creation).toBeDefined();
  });

  it("should be 400 cause: incalid token",async()=>{
    const response=await request(app).get("/user/1").set("Authorization","Bearer 123");

    expect(response.status).toBe(400);

  });

  it("should be 404: not found such user",async()=>{
    db.query.mockResolvedValueOnce({
      rows:[]
    });
   const response=await request(app).get("/user/1").set("Authorization","Bearer "+token);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("there is no such user");
    
  });

  it("should return 500 cause: server error",async()=>{
    db.query.mockRejectedValueOnce(new Error("Database query failed"));
    const response=await request(app).get("/user/1").set("Authorization","Bearer "+token);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error during get user data");
  })


});