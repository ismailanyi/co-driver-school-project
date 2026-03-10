import { globalStyles } from "@/constants/globalStyles";
import { PropsWithChildren } from "react";
import { ThemedButton } from "@/components/themed-button";

type QuestionsProps = PropsWithChildren<{
  quesion: {
    id: number;
  };
  isSelected: boolean;
  onPress: () => void;
}>;

const QuestionsSection = ({
  quesion,
  isSelected,
  onPress,
  children,
}: QuestionsProps) => {
  return (
    <ThemedButton
      style={[globalStyles.signsCard, isSelected && globalStyles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}

    </ThemedButton>
  );
};

export default QuestionsSection;
