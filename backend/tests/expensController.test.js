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

const db=pg.Client();
beforeEach(()=>{
    db.query.mockClear(); 
});

afterEach(()=>{
    db.query.mockClear(); 
})


const token=jwt.sign({id:1,name:"user1"},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:process.env.ACCESS_TOKEN_EXPIRES_TIME});
const dateOfExpense = new Date();
const formattedTimestampDateOfExpense = `${dateOfExpense.getFullYear()}-${(dateOfExpense.getMonth() + 1).toString().padStart(2, "0")}-${dateOfExpense.getDate().toString().padStart(2, "0")} ` +
                           `${dateOfExpense.getHours().toString().padStart(2, "0")}:${dateOfExpense.getMinutes().toString().padStart(2, "0")}`;

const dateOfCreation = new Date(2025, 0, 1, 12, 30);

const formattedTimestampDateOfCreation = `${dateOfCreation.getFullYear()}-${(dateOfCreation.getMonth() + 1).toString().padStart(2, "0")}-${dateOfCreation.getDate().toString().padStart(2, "0")} ` +
                           `${dateOfCreation.getHours().toString().padStart(2, "0")}:${dateOfCreation.getMinutes().toString().padStart(2, "0")}:${dateOfCreation.getSeconds().toString().padStart(2, "0")}`;



describe("check getAllExpenses request",()=>{

    it("should return 200 and return expenses",async()=>{

        db.query.mockResolvedValueOnce({
            rows:[{
                user_id:1
                ,amount:100
                ,date_of_expense:formattedTimestampDateOfExpense,
                category:"food",
                description:"ate food",
                date_of_creation:formattedTimestampDateOfCreation
            }]
        });


        const response=await request(app).get("/expense/1").set("Authorization","Beared "+token);

        expect(response.status).toBe(200);
        expect(response.body.user_id).toBe(1);
        expect(response.body.amount).toBe(100);
        expect(response.body.date_of_expense).toEqual(formattedTimestampDateOfExpense);
        expect(response.body.category).toBe("food");
        expect(response.body.description).toBe("ate food");
        expect(response.body.date_of_creation).toEqual(formattedTimestampDateOfCreation);
    });

    it("should return 400 cause: invalid token",async()=>{
        const response=await request(app).get("/expense/1").set("Authorization","Beared 123");
        expect(response.status).toBe(400);
    });

    it("should return 404 casue: not found expenses",async()=>{

        db.query.mockResolvedValueOnce({
            rows:[]
        });


        const response=await request(app).get("/expense/1").set("Authorization","Beared "+token);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("expenses not found");
    });

    it("should return 500 casue: error in the server",async()=>{

        db.query.mockRejectedValueOnce(new Error("Database query failed"));


        const response=await request(app).get("/expense/1").set("Authorization","Beared "+token);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Database query failed");
    });

});


describe("check postExpense request",()=>{
    it("should return 200 ",async()=>{
        
        db.query.mockResolvedValueOnce({
            rows:[]
        });

        const response=await request(app).post("/expense/1").send({
                amount:100
                ,date_of_expense:formattedTimestampDateOfExpense,
                category:"food",
                description:"ate food",
                date_of_creation:formattedTimestampDateOfCreation
        }).set("Authorization","Bearer "+token); 
        
        expect(response.status).toBe(200);
    });

    it("should return 400 cause: invalid token ",async()=>{
        const response=await request(app).post("/expense/1").set("Authorization","Bearer 123"); 
        
        expect(response.status).toBe(400);
    });

    it("should return 400 cause: missing fields in body request",async()=>{
        
    
        const response=await request(app).post("/expense/1").send({
                date_of_expense:formattedTimestampDateOfExpense,
                category:"food",
                description:"ate food",
                date_of_creation:formattedTimestampDateOfCreation
        }).set("Authorization","Bearer "+token); 
        
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("there is missing fields in request");
    });


    it("should return 500 : server error  ",async()=>{
        
        db.query.mockRejectedValueOnce(new Error("Database query failed"));

        const response=await request(app).post("/expense/1").send({
                amount:100
                ,date_of_expense:formattedTimestampDateOfExpense,
                category:"food",
                description:"ate food",
                date_of_creation:formattedTimestampDateOfCreation
        }).set("Authorization","Bearer "+token); 
        
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Database query failed");
    });

    
})


