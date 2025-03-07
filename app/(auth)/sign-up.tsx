import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Link } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verification, setVerfication] = useState({
    state: "default",
    code: "",
    error: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerfication({ ...verification, state: "pending" });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        //create db user
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            fullname: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerfication({ ...verification, state: "success" });
      } else {
        setVerfication({
          ...verification,
          state: "failed",
          error: "Verfication failed",
        });
      }
    } catch (err: any) {
      setVerfication({
        ...verification,
        state: "failed",
        error: err.errors[0].longMessage,
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-white h-full"
    >
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="w-full h-[250px] " />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
            labelStyle=""
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text> Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>

          {/* Verfication modal */}
          <Modal
            isVisible={verification.state === "pending"}
            onModalHide={() => {
              if (verification.state === "success") setShowSuccessModal(true);
            }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="font-JakartaExtraBold text-2xl mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {form.email}.
              </Text>

              <InputField
                label="Code"
                icon={icons.lock}
                placeholder="12345"
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code) =>
                  setVerfication({ ...verification, code })
                }
              />
              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}
              <CustomButton
                title="Verify Email"
                onPress={onVerifyPress}
                className="mt-5 bg-success-500"
              />
            </View>
          </Modal>
          <Modal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-JakartaBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2 	">
                You have successfully verified your account.
              </Text>
              <CustomButton
                title="Browse Home"
                onPress={() => {
                  setShowSuccessModal(false);
                  router.push(`/(root)/(tabs)/home`);
                }}
                className="mt-5"
              />
            </View>
          </Modal>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
