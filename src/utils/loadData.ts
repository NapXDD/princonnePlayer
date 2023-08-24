import { AxiosResponse } from "axios";

type CallbackFunction<T> = (response: T) => void;

export default async function loadData<T>(
  axiosRequest: Promise<AxiosResponse<T, T>>,
  callBack: CallbackFunction<T>
) {
  try {
    const response = await axiosRequest;
    if (response.status === 200) {
      callBack(response.data);
    }
  } catch (e) {
    console.error(e);
  }
}
