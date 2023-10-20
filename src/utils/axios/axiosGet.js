import axiosClient, { axiosFileClient } from "./axiosClient";

export function getClassMap(url) {
  return axiosClient.get(url);
}

export function getBinaryFile(url) {
  return axiosFileClient.get(url, { responseType: "arraybuffer" });
}

export function getBlobFile(url) {
  return axiosFileClient.get(url, { responseType: "blob" });
}
