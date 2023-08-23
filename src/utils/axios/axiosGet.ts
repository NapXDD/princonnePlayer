import { AxiosResponse } from "axios";
import axiosClient from "./axiosClient";
import { response } from "../../types/character";

export function getClassMap(
  url: string
): Promise<AxiosResponse<response, response>> {
  return axiosClient.get(url);
}
