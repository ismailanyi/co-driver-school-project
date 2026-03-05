import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import Questions from "@/components/questions";
import SubmitAnswer from "@/components/submit-answer";
import axios from "axios";

export const theory = async () => {
  const quesions = await axios.get("");
};

