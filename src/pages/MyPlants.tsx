import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Alert } from "react-native";
import { Header } from "../components/Header";
import colors from "../styles/colors";
import waterdrop from "../assets/waterdrop.png";
import { FlatList } from "react-native-gesture-handler";
import {
  loadPlant,
  PlantProps,
  removePlant,
  StoragePlantProps,
} from "../libs/storage";
import { pt } from "date-fns/locale";
import { formatDistance } from "date-fns";
import fonts from "../styles/fonts";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import { Load } from "../components/Load";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatering, setNextWatering] = useState<string>();

  function handleRemove(plant: PlantProps) {
    Alert.alert("Remover", `Deseja remover ${plant.name}?`, [
      {
        text: "Não 🙏",
        style: "cancel",
      },
      {
        text: "Sim 😢",
        onPress: async () => {
          try {
            await removePlant(plant.id);

            setMyPlants((oldData) =>
              oldData.filter((item) => item.id !== plant.id)
            );
          } catch (error) {
            Alert.alert("Não foi possível remover! 😓");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    async function loadStorageData() {
      const plantsStored = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantsStored[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );

      setNextWatering(
        `Não esqueça de regar a ${plantsStored[0].name} às ${nextTime} horas.`
      );

      setMyPlants(plantsStored);
      setLoading(false);
    }

    loadStorageData();
  }, []);

  if (loading) return <Load />;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImg} />
        <Text style={styles.spotlightText}>{nextWatering}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => {
                handleRemove(item);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },

  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  spotlightImg: {
    width: 60,
    height: 60,
  },

  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },

  plants: {
    flex: 1,
    width: "100%",
  },

  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
