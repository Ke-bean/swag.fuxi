const request = require("supertest");
const { app, server } = require("../src/index");

describe("/blogs", () => {
    beforeEach(()=> { server });
    afterEach(()=> { server.close(); })
    describe("GET/", () => {
        it("should return all blogs", async () => {
            const res = await request(server).get("/blogs");
            expect(res.status).toBe(200);
        });
    });
    describe("GET/:id", ()=>{
        it("should return a blog if valid id is passed", ()=>{
            
        })
    })
});
