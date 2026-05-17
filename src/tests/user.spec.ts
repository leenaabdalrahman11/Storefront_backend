/// <reference types="jasmine" />

import { User, UserStore } from "../models/user";
import Client from "../database";

const store = new UserStore();

describe("User Model", () => {
  beforeAll(async () => {
    const conn = await Client.connect();

    await conn.query("DELETE FROM order_products");
    await conn.query("DELETE FROM orders");
    await conn.query("DELETE FROM users");

    await conn.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await conn.query("ALTER SEQUENCE orders_id_seq RESTART WITH 1");
    await conn.query("ALTER SEQUENCE order_products_id_seq RESTART WITH 1");

    conn.release();

    await store.create({
      username: "leen_test",
      password: "123",
    });
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have an authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });

  it("create method should add a user", async () => {
    const result = await store.create({
      username: "leen2",
      password: "123",
    } as User);

    expect(result.username).toEqual("leen2");
  });

  it("authenticate method should return the user", async () => {
    const result = await store.authenticate("leen_test", "123");

    expect(result).not.toBeNull();
    expect(result?.username).toEqual("leen_test");
  });

  it("authenticate method should fail with wrong password", async () => {
    const result = await store.authenticate("leen_test", "wrong");

    expect(result).toBeNull();
  });
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have an update method", () => {
    expect(store.update).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });
  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return the correct user", async () => {
    const users = await store.index();
    const result = await store.show(users[0].id);

    expect(result.username).toBeDefined();
  });

  it("update method should update a user", async () => {
    const users = await store.index();
    const result = await store.update(users[0].id, {
      username: "updated_user",
      password: "456",
    });

    expect(result.username).toEqual("updated_user");
  });

  it("delete method should delete a user", async () => {
    const created = await store.create({
      username: "delete_me",
      password: "123",
    });

    const result = await store.delete(created.id as number);

    expect(result.username).toEqual("delete_me");
  });
});
