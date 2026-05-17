import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, UserStore } from "../models/user";
import verifyAuthToken from "../middleware/auth";

dotenv.config();

const store = new UserStore();
const tokenSecret = process.env.TOKEN_SECRET as string;

const create = async (req: Request, res: Response) => {
  try {
    const user = await store.create(req.body);

    const token = jwt.sign(
      { id: user.id, username: user.username },
      tokenSecret,
    );

    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(Number(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const updatedUser = await store.update(Number(req.params.id), req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deletedUser = await store.delete(Number(req.params.id));
    res.json(deletedUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const authenticate = async (req: Request, res: Response) => {
  try {
    const user = await store.authenticate(req.body.username, req.body.password);

    if (!user) {
      return res.status(401).json("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      tokenSecret,
    );

    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.post("/users", create);
  app.post("/users/authenticate", authenticate);
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.put("/users/:id", verifyAuthToken, update);
  app.delete("/users/:id", verifyAuthToken, destroy);
};

export default userRoutes;
