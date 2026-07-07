import { globalStyles } from "@/constants/globalStyles";
import { PropsWithChildren } from "react";
import { ThemedButton } from "@/components/themed-button";
import { type StyleProp, type TextStyle } from "react-native";
import { useTheme } from "@/context/theme";

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
  const { background, border, foreground, primary } = useTheme();

  return (
    <ThemedButton
      text={text}
      textStyle={[textStyle, { color: isSelected ? '#000000' : foreground }]}
      style={[
        question_type === 'theory' ? globalStyles.theoryOptionCard : globalStyles.signsCard,
        { backgroundColor: background, borderColor: border },
        isSelected && globalStyles.selectedCard
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </ThemedButton>
  );
};

export default QuestionsSection;
