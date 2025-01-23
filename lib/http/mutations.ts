import { API_ROUTES } from "@/constants/ApiRoutes";
import { api } from "../axios/axios";

export async function postLogin({uid}: {uid: string}) {
  const res = await api.post(API_ROUTES.AUTH.LOGIN, {uid});
  return res.data;
}


export async function addVisitedLocation({locationId, date, userLatitude, userLongitude}: {locationId: number, date: string, userLatitude: number, userLongitude: number}) {
  const res = await api.post(API_ROUTES.LOCATION.CREATE_VISITED_LOCATION, { locationId, date, userLatitude, userLongitude });
  return res.data;
}
