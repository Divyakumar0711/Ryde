import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo, useRef } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Map from "@/components/Map";
import { data, icons } from "@/constants";

const RideLayout = ({
  title,
  snapPoints,
  children,
}: {
  title: string;
  snapPoints?: string[];
  children: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Ensure snapPoints allow for full extension
  const memoizedSnapPoints = useMemo(
    () => snapPoints || ["50%", "100%"],
    [snapPoints]
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flex: 1, backgroundColor: "blue" }}>
            <View
              style={{
                position: "absolute",
                top: 30,
                zIndex: 10,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "white",
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={icons.backArrow}
                    resizeMode="contain"
                    style={{ width: 24, height: 24 }}
                  />
                </View>
              </TouchableOpacity>
              <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "600" }}>
                {title || "Go Back"}
              </Text>
            </View>
            <Map />
          </View>

          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={memoizedSnapPoints}
            index={1} // Start at the fully extended state
            enablePanDownToClose
            keyboardBehavior="interactive"
          >
            {title === "Choose a Rider" ? (
              <BottomSheetView
                style={{
                  flex: 1,
                  padding: 20,
                }}
              >
                {children}
              </BottomSheetView>
            ) : (
              <BottomSheetScrollView
                style={{
                  flex: 1,
                  padding: 20,
                }}
              >
                {children}
              </BottomSheetScrollView>
            )}
          </BottomSheet>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
