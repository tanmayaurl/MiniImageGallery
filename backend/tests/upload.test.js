const request = require("supertest");
const app = require("../app");

describe("Upload endpoints", () => {
  test("uploads a valid png image", async () => {
    const tinyPng = Buffer.from([137, 80, 78, 71]); // valid PNG header

    const res = await request(app)
      .post("/upload")
      .attach("image", tinyPng, {
        filename: "test.png",
        contentType: "image/png",
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test("rejects large files", async () => {
    const bigBuffer = Buffer.alloc(3 * 1024 * 1024 + 50);

    const res = await request(app)
      .post("/upload")
      .attach("image", bigBuffer, {
        filename: "big.png",
        contentType: "image/png",
      });

    expect([400, 413]).toContain(res.statusCode);
  });

  test("rejects non-image", async () => {
    const res = await request(app)
      .post("/upload")
      .attach("image", Buffer.from("text file"), {
        filename: "file.txt",
        contentType: "text/plain",
      });

    expect([400, 415]).toContain(res.statusCode);
  });
});
