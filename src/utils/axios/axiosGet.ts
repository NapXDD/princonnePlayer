import { AxiosResponse } from "axios";
import axiosClient, { axiosFileClient } from "./axiosClient";
import { charactersType } from "../../types/character";

export function getClassMap(
  url: string
): Promise<AxiosResponse<charactersType, charactersType>> {
  return axiosClient.get(url);
}

export function getBinaryFile(
  url: string
): Promise<AxiosResponse<ArrayBuffer, ArrayBuffer>> {
  return axiosFileClient.get(url, { responseType: "arraybuffer" });
}

export function getBlobFile(url: string): Promise<AxiosResponse<Blob, Blob>> {
  return axiosFileClient.get(url, { responseType: "blob" });
}
