import { globalStyles } from "@/constants/globalStyles";
import { PropsWithChildren } from "react";
import { ThemedButton } from "@/components/themed-button";
import { type StyleProp, type TextStyle } from "react-native";

type QuestionsProps = PropsWithChildren<{
  question_type: string;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  isSelected: boolean;
  onPress: () => void;
}>;

const QuestionsSection = ({
  question_type,
  text,
  textStyle,
  isSelected,
  onPress,
  children,
}: QuestionsProps) => {
  return (
    <ThemedButton
      text={text}
      textStyle={textStyle}
      style={[question_type === 'theory' ? globalStyles.theoryOptionCard :globalStyles.signsCard, isSelected && globalStyles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </ThemedButton>
  );
};

export default QuestionsSection;
