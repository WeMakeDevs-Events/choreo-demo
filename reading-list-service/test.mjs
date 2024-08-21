// // Importing the required modules
// import chai from "chai";
// import chaiHttp from "chai-http";
// import app from "./app.mjs";

// // Setting up Chai to use the HTTP plugin
// chai.use(chaiHttp);
// const expect = chai.expect;

// // Describe block for Reading List API tests
// describe("Reading List API", () => {
//   // Before each test, clear the books table to ensure test isolation
//   beforeEach(async () => {
//     await db.execute("DELETE FROM books");
//   });

//   // After all tests, close the database connection pool
//   after(async () => {
//     await db.end();
//   });

//   // Test suite for POST /reading-list/books
//   describe("POST /reading-list/books", () => {
//     it("should add a book to the reading list", async () => {
//       const newBook = {
//         title: "Test Book",
//         author: "Test Author",
//         status: "to_read",
//       };
//       const res = await chai.request(app).post("/reading-list/books").send(newBook);

//       expect(res).to.have.status(201);
//       expect(res.body).to.have.property("uuid");
//       expect(res.body.title).to.equal(newBook.title);
//       expect(res.body.author).to.equal(newBook.author);
//     });

//     it("should return a 400 Bad Request when the status is invalid", async () => {
//       const invalidBook = {
//         title: "Invalid Book",
//         author: "Invalid Author",
//         status: "invalid_status",
//       };
//       const res = await chai.request(app).post("/reading-list/books").send(invalidBook);

//       expect(res).to.have.status(400);
//       expect(res.body.error).to.equal(
//         "Status is invalid. Accepted statuses: read | to_read | reading"
//       );
//     });

//     it("should return a 400 Bad Request when title, author, or status is empty", async () => {
//       const emptyFieldsBook = {};
//       const res = await chai.request(app).post("/reading-list/books").send(emptyFieldsBook);

//       expect(res).to.have.status(400);
//       expect(res.body.error).to.equal(
//         "Title, Status or Author is empty"
//       );
//     });
//   });

//   // Test suite for PUT /reading-list/books/:uuid
//   describe("PUT /reading-list/books/:uuid", () => {
//     it("should update the status of a book", async () => {
//       const newBook = {
//         title: "Test Book",
//         author: "Test Author",
//         status: "to_read",
//       };
//       const addRes = await chai.request(app).post("/reading-list/books").send(newBook);

//       const updatedStatus = "reading";
//       const updateRes = await chai.request(app).put(`/reading-list/books/${addRes.body.uuid}`).send({ status: updatedStatus });

//       expect(updateRes).to.have.status(200);
//       expect(updateRes.body.uuid).to.equal(addRes.body.uuid);
//       expect(updateRes.body.status).to.equal(updatedStatus);
//     });

//     it("should return a 404 Not Found when the UUID does not exist", async () => {
//       const nonExistentUuid = "non-existent-uuid";
//       const updatedStatus = "reading";
//       const res = await chai.request(app).put(`/reading-list/books/${nonExistentUuid}`).send({ status: updatedStatus });

//       expect(res).to.have.status(404);
//       expect(res.body.error).to.equal("UUID does not exist");
//     });

//     it("should return a 400 Bad Request when the status is invalid", async () => {
//       const newBook = {
//         title: "Test Book",
//         author: "Test Author",
//         status: "to_read",
//       };
//       const addRes = await chai.request(app).post("/reading-list/books").send(newBook);

//       const updatedStatus = "invalid_status";
//       const updateRes = await chai.request(app).put(`/reading-list/books/${addRes.body.uuid}`).send({ status: updatedStatus });

//       expect(updateRes).to.have.status(400);
//       expect(updateRes.body.error).to.equal(
//         "Status is invalid. Accepted statuses: read | to_read | reading"
//       );
//     });
//   });

//   // Test suite for GET /reading-list/books/:uuid
//   describe("GET /reading-list/books/:uuid", () => {
//     it("should return a book by UUID", async () => {
//       const newBook = {
//         title: "Test Book",
//         author: "Test Author",
//         status: "to_read",
//       };

//       const addRes = await chai.request(app).post("/reading-list/books").send(newBook);
//       const res = await chai.request(app).get(`/reading-list/books/${addRes.body.uuid}`);

//       expect(res).to.have.status(200);
//       expect(res.body.uuid).to.equal(addRes.body.uuid);
//       expect(res.body.title).to.equal(newBook.title);
//       expect(res.body.author).to.equal(newBook.author);
//     });

//     it("should return a 404 Not Found when the UUID does not exist", async () => {
//       const nonExistentUuid = "non-existent-uuid";
//       const res = await chai.request(app).get(`/reading-list/books/${nonExistentUuid}`);

//       expect(res).to.have.status(404);
//       expect(res.body.error).to.equal("UUID does not exist");
//     });
//   });

//   // Test suite for DELETE /reading-list/books/:uuid
//   describe("DELETE /reading-list/books/:uuid", () => {
//     it("should delete a book by UUID", async () => {
//       const newBook = {
//         title: "Test Book",
//         author: "Test Author",
//         status: "to_read",
//       };

//       const addRes = await chai.request(app).post("/reading-list/books").send(newBook);
//       const res = await chai.request(app).delete(`/reading-list/books/${addRes.body.uuid}`);

//       expect(res).to.have.status(200);
//       expect(res.body).to.have.property("uuid", addRes.body.uuid);

//       // Confirm deletion
//       const confirmRes = await chai.request(app).get(`/reading-list/books/${addRes.body.uuid}`);
//       expect(confirmRes).to.have.status(404);
//     });
//   });
// });
