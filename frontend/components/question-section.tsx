import { globalStyles } from "@/constants/globalStyles";
import { PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";

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
    <TouchableOpacity
      style={[globalStyles.card, isSelected && globalStyles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

export default QuestionsSection;
