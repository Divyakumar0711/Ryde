import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  return (
    <MapView
      // provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      // tintColor="black"
      // mapType="mutedStandard"
      // showsPointsOfInterest={false}
      // showsUserLocation={true}
      // userInterfaceStyle="light"
      tintColor="black"
      userInterfaceStyle="light"
      showsUserLocation={true}
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <View className="h-full w-full bg-transparent">
        <Text>
          dmdkmfdmfdcdkckdokcodkcodckodcokodkockdokcodkcodkockdomodocdokcodk
        </Text>
      </View>
    </MapView>
  );
};

export default Map;
