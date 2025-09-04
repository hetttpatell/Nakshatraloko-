import { get, post, put, del } from "./http";

export const UsersAPI = {
  list: () => get("/users"),
  byId: (id) => get(`/users/${id}`),
  create: (data) => post("/users", data),
  update: (id, data) => put(`/users/${id}`, data),
  remove: (id) => del(`/users/${id}`),
};
