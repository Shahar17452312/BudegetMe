import request  from "supertest";
import pg from "pg";
import app from "../server.js";
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




describe("checking get budget",()=>{
    it("should be 200 and return amount of budget",async()=>{
        const token=jwt.sign({id:1,name:"user1"},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:process.env.ACCESS_TOKEN_EXPIRES_TIME});
        db.query.mockResolvedValueOnce({
            rows:[{id:1,
                amount:200
            }]
        });
        const response=await request(app).get("/budget/1").set("Authorization","Bearer "+token);
       


        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.amount).toBe(200);
    });

    it("should return 400 with error message",async()=>{
        const response=await request(app).get("/budget/1").set("Authorization","Brear 123");


        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();
    });


    it("should be 404 cause there is no data",async()=>{
        token;
        db.query.mockResolvedValueOnce({
            rows:[]
        });
        const response=await request(app).get("/budget/1").set("Authorization","Bearer "+token);
       


        expect(response.status).toBe(404);
    });


    it("should return 500 cause server error",async()=>{
        db.query.mockRejectedValueOnce(new Error('Database query failed'));
        const response=await request(app).get("/budget/1").set("Authorization","Bearer "+token);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Error during get budget amount");

    })
})