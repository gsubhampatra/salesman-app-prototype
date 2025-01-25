import ScannedList from '@/components/ScannedList';
import { API_ROUTES } from '@/constants/ApiRoutes';
import { primary } from '@/constants/Colors';
import { useRefreshOnFocus } from '@/hook/useRefetchOnFocus';
import { api } from '@/lib/axios/axios';
import { useUserStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { CloudArrowUp, CloudCheck, GpsFix, Scan } from 'phosphor-react-native';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VisitedLocationData {
  visitedLocation: ({
    Location: {
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
  } & {
    id: number;
    date: Date;
    locationId: number;
    UserLatitude: number;
    UserLongitude: number;
    scanDistance: number;
    visitCount: number;
    salesManId: number;
    createdAt: Date;
    updatedAt: Date;
  })[]
}

async function getVisitedLocations(): Promise<VisitedLocationData> {
  const res = await api.get(API_ROUTES.LOCATION.GET_VISITED_LOCATIONS);
  return res.data;
}

export default function TabTwoScreen() {
  const router = useRouter();
  const { userDetails } = useUserStore();
  const visitedLocationsQuery = useQuery({
    queryKey: ['visitedLocations'],
    queryFn: getVisitedLocations
  })
  const refetch = visitedLocationsQuery.refetch;
  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (visitedLocationsQuery.isError) {
      console.log(visitedLocationsQuery.error);
    }
    if (visitedLocationsQuery.isSuccess) {
      console.log(visitedLocationsQuery.data);
    }
  })

  return (
    <View style={{ padding: 30, backgroundColor: "white", minHeight: "100%", position: 'relative', alignItems: 'center' }}>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome</Text>
          <Text style={{ fontSize: 16 }}>{userDetails?.name}</Text>
        </View>
        <View>
          <TouchableOpacity>
            <CloudArrowUp size={32} color={primary} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.push("/(modals)/scanQr")} style={{ position: 'absolute', bottom: 30, padding: 10, borderRadius: 999 }}>
        <Scan size={52} color={`${primary}`} />
      </TouchableOpacity>

      <View style={{ marginTop: 30, width: "100%" }}>


        {
          visitedLocationsQuery.isSuccess && visitedLocationsQuery.data?.visitedLocation.map((location, index) => {
            const truncate = (text: string, maxLength: number) =>
              text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

            const trimmedName = truncate(location.Location.name, 20);
            const trimmedAddress = truncate(location.Location.address, 30);

            return (
              <View
                key={location.id}
                style={{
                  paddingVertical: 10,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative"
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <GpsFix size={32} weight="duotone" color={primary} duotoneColor={primary} />
                  <View>
                    {/* Truncated Name */}
                    <Text style={{ fontWeight: "500", fontSize: 18 }}>{trimmedName}</Text>
                    {/* Full Multiline Address */}
                    <Text style={{ color: "#555", flexWrap: "wrap" }}>{trimmedAddress}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 0,
                    padding: 10,
                    backgroundColor: "#dcffdb",
                    borderRadius: 10
                  }}

                >
                  <CloudCheck size={32} color="green" />
                </TouchableOpacity>
              </View>
            );
          })
        }
        {
          visitedLocationsQuery.isFetching && <ActivityIndicator size="large" color={primary} />
        }
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

});