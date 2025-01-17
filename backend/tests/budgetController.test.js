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
        db.query.mockResolvedValueOnce({
            rows:[]
        });
        const response=await request(app).get("/budget/1").set("Authorization","Bearer "+token);
       


        expect(response.status).toBe(404);
    });


    it("should return 500 cause server error",async()=>{
        db.query.mockRejectedValueOnce(new Error('Database query failed'));
        const response=await request(app).get("/budget/1").set("Authorization","Bearer "+token);

        expect(response.body.message).toBe("Database query failed");

        expect(response.status).toBe(500);

    })
});


describe("check postBudget request",()=>{
    it("should be 202 with message of create a budget",async()=>{

        const response=await request(app).post("/budget/1").send({amount:200}).set("Authorization","Bearer "+token);
        
        expect(response.body.message).toBe("Budget added to user");

        expect(response.status).toBe(202);
    });


    it("should be 400 cause there is no amount in the body request",async()=>{
        const response=await request(app).post("/budget/1").set("Authorization","Bearer "+token);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing request body");
    });


    it("should be 400 cause amount in the body request is not a number",async()=>{
        const response=await request(app).post("/budget/1").send({amount:"200"}).set("Authorization","Bearer "+token);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Budget must be a valid positive number");
    })

    it("should be 400 cause token is invalid",async()=>{
        const response=await request(app).post("/budget/1").send({amount:200}).set("Authorization","Bearer 123");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid token");
    });


    it("should be 500 cause server error",async()=>{

        db.query.mockRejectedValueOnce(new Error("Database query failed"));
        const response=await request(app).post("/budget/1").send({amount:200}).set("Authorization","Bearer "+token);


        expect(response.body.message).toBe("Database query failed");

    });
});



describe("check deleteBudget request ",()=>{
    it("should be 200 with",async()=>{
        db.query.mockResolvedValueOnce({
            rows:[{id:1
                ,amount:200}
            ]
        });

        const response= await request(app).delete("/budget/1").set("Authorization","Bearer "+token);


        expect(response.status).toBe(200);


    });


    it("should be 400 cause token is invlid",async()=>{
     
        const response= await request(app).delete("/budget/1").set("Authorization","Bearer 123");


        expect(response.status).toBe(400);


    });

    
    it("should be 500 with cause server error",async()=>{
     
        db.query.mockRejectedValueOnce(new Error("Database query failed"))
        const response= await request(app).delete("/budget/1").set("Authorization","Bearer "+token);


        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Database query failed");


    });
})