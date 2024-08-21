import chai from "chai";
import chaiHttp from "chai-http";
import app from "./app.mjs";
import sequelize from './db.mjs'; 
import Book from './bookModel.mjs'; 


chai.use(chaiHttp);
const expect = chai.expect;


describe("Reading List API", () => {
  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });
  after(async () => {
    await sequelize.close();
  });

  // Test suite for POST /reading-list/books
  describe("POST /reading-list/books", () => {
    it("should add a book to the reading list", async () => {
      const newBook = {
        title: "Test Book",
        author: "Test Author",
        status: "to_read",
      };
      const res = await chai.request(app).post("/reading-list/books").send(newBook);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("uuid");
      expect(res.body.title).to.equal(newBook.title);
      expect(res.body.author).to.equal(newBook.author);
    });

    it("should return a 400 Bad Request when the status is invalid", async () => {
      const invalidBook = {
        title: "Invalid Book",
        author: "Invalid Author",
        status: "invalid_status",
      };
      const res = await chai.request(app).post("/reading-list/books").send(invalidBook);

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal(
        "Status is invalid. Accepted statuses: read | to_read | reading"
      );
    });

    it("should return a 400 Bad Request when title, author, or status is empty", async () => {
      const emptyFieldsBook = {};
      const res = await chai.request(app).post("/reading-list/books").send(emptyFieldsBook);

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal(
        "Title, Status or Author is empty"
      );
    });
  });

  // Test suite for GET /reading-list/books
  describe("GET /reading-list/books", () => {
    it("should return all books", async () => {
      await Book.create({
        title: "Sample Book",
        author: "Sample Author",
        status: "to_read"
      });

      const res = await chai.request(app).get("/reading-list/books");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').that.is.not.empty;
    });
  });

  // Test suite for GET /reading-list/books/:uuid
  describe("GET /reading-list/books/:uuid", () => {
    it("should return a book by UUID", async () => {
      const book = await Book.create({
        title: "Unique Book",
        author: "Unique Author",
        status: "read"
      });

      const res = await chai.request(app).get(`/reading-list/books/${book.uuid}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("uuid", book.uuid);
    });

    it("should return a 404 Not Found when the UUID does not exist", async () => {
      const res = await chai.request(app).get(`/reading-list/books/non-existent-uuid`);
      expect(res).to.have.status(404);
      expect(res.body.error).to.equal("UUID does not exist");
    });
  });

  // Test suite for PUT /reading-list/books/:uuid
  describe("PUT /reading-list/books/:uuid", () => {
    it("should update a book's status by UUID", async () => {
      const book = await Book.create({
        title: "Update Book",
        author: "Update Author",
        status: "to_read"
      });

      const res = await chai.request(app).put(`/reading-list/books/${book.uuid}`).send({ status: "reading" });
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal("reading");
    });

    it("should return a 404 Not Found when the UUID does not exist for update", async () => {
      const res = await chai.request(app).put(`/reading-list/books/non-existent-uuid`).send({ status: "reading" });
      expect(res).to.have.status(404);
      expect(res.body.error).to.equal("UUID not found");
    });
  });

  // Test suite for DELETE /reading-list/books/:uuid
  describe("DELETE /reading-list/books/:uuid", () => {
    it("should delete a book by UUID", async () => {
      const book = await Book.create({
        title: "Delete Book",
        author: "Delete Author",
        status: "read"
      });

      const res = await chai.request(app).delete(`/reading-list/books/${book.uuid}`);
      expect(res).to.have.status(200);

      const confirmRes = await chai.request(app).get(`/reading-list/books/${book.uuid}`);
      expect(confirmRes).to.have.status(404);
    });
  });
});
