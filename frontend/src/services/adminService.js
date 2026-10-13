// adminService.js — admin dashboard calls in one place.
import { api, httpError } from "./api";

async function call(promise, fallback) {
  try {
    const { data } = await promise;
    return data?.data ?? data;
  } catch (err) {
    throw httpError(err, fallback);
  }
}

export const getOverview = () =>
  call(api.get("/admin/overview"), "Unable to load dashboard");

export const getAdminUsers = () =>
  call(api.get("/admin/users"), "Unable to load users");

export const toggleAdminUserStatus = (id) =>
  call(api.patch(`/admin/users/${id}/status`, {}), "Unable to update user");

export const deleteAdminUser = (id) =>
  call(api.delete(`/admin/users/${id}`), "Unable to delete user");

export const getAdminItems = () =>
  call(api.get("/admin/items"), "Unable to load items");

export const updateAdminItem = (itemType, id, payload) =>
  call(
    api.patch(`/admin/items/${itemType}/${id}`, payload),
    "Unable to update item"
  );

export const deleteAdminItem = (itemType, id) =>
  call(api.delete(`/admin/items/${itemType}/${id}`), "Unable to delete item");

export const getContentReports = () =>
  call(api.get("/admin/reports"), "Unable to load reports");

export const reviewContentReport = (id, status) =>
  call(
    api.patch(`/admin/reports/${id}/review`, { status }),
    "Unable to update report"
  );
