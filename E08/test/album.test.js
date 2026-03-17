import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import Album from "../models/Album.js";
import User from "../models/User.js";
import testData from "./data.json";

let agent;
let testUserId;

beforeAll(async () => {
  await User.deleteMany({});

  const testUser = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "user"
  });

  testUserId = testUser._id;

  agent = request.agent(app);

  const loginResponse = await agent.post("/api/login").send({
    email: "test@example.com",
    password: "password123"
  });

  expect(loginResponse.status).toBe(200);
});

beforeEach(async () => {
  await Album.deleteMany({});

  const albumsWithOwner = testData.map((album) => ({
    ...album,
    owner: testUserId
  }));

  await Album.insertMany(albumsWithOwner);
});

describe("GET /api/albums", () => {
  it("should return all albums from test database", async () => {
    const res = await request(app).get("/api/albums");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(testData.length);
    expect(res.body.metadata.total).toBe(testData.length);
  });
});

describe("POST /api/albums", () => {
  it("should add a new album successfully", async () => {
    const newAlbum = {
      title: "Hybrid Theory",
      artist: "Linkin Park",
      year: 2000,
      genre: "Rock",
      tracks: 12
    };

    const response = await agent.post("/api/albums").send(newAlbum);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newAlbum.title);
    expect(response.body.artist).toBe(newAlbum.artist);
    expect(response.body.year).toBe(newAlbum.year);
    expect(response.body.genre).toBe(newAlbum.genre);
    expect(response.body.tracks).toBe(newAlbum.tracks);

    const albumsAtEnd = await Album.find({});
    expect(albumsAtEnd).toHaveLength(testData.length + 1);

    const addedAlbum = albumsAtEnd.find(
      (album) => album.title === "Hybrid Theory"
    );
    expect(addedAlbum).toBeDefined();
  });
});

describe("DELETE /api/albums/:id", () => {
  it("should delete an existing album", async () => {
    const albumsAtStart = await Album.find({});
    const albumToDelete = albumsAtStart[0];

    const response = await agent.delete(`/api/albums/${albumToDelete._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Album deleted");

    const albumsAtEnd = await Album.find({});
    expect(albumsAtEnd).toHaveLength(testData.length - 1);

    const ids = albumsAtEnd.map((album) => album._id.toString());
    expect(ids).not.toContain(albumToDelete._id.toString());
  });

  it("should return 404 when trying to delete a non-existent album", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const response = await agent.delete(`/api/albums/${nonExistingId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Album not found");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});