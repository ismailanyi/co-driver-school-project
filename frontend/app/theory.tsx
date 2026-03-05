import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import Questions from "@/components/questions";
import SubmitAnswer from "@/components/submit-answer";
import axios from "axios";

export const theory = async () => {
  const api = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL
  })
  const response = await api.get(`/quiz/theory`)
  const { message } = response.data
};

