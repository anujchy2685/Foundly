// itemsService.js — lost/found item calls in one place.
import { api, httpError } from "./api";

const toList = (data) =>
  Array.isArray(data) ? data : data?.items || data?.data || [];

export async function getLostItems() {
  try {
    const { data } = await api.get("/lost-items");
    return toList(data);
  } catch (err) {
    throw httpError(err);
  }
}

export async function getFoundItems() {
  try {
    const { data } = await api.get("/found-items");
    return toList(data);
  } catch (err) {
    throw httpError(err);
  }
}

export async function getLostItem(id) {
  try {
    const { data } = await api.get(`/lost-items/${id}`);
    return data?.item || data?.data || data;
  } catch (err) {
    throw httpError(err);
  }
}

export async function getFoundItem(id) {
  try {
    const { data } = await api.get(`/found-items/${id}`);
    return data?.item || data?.data || data;
  } catch (err) {
    throw httpError(err);
  }
}

export async function reportItem(type, formData) {
  try {
    const { data } = await api.post(`/${type}-items`, formData);
    return data;
  } catch (err) {
    throw httpError(err, `Failed to report ${type} item`);
  }
}
