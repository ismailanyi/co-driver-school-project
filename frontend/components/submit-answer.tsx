import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { TouchableOpacity } from "react-native";
import { globalStyles } from "@/constants/globalStyles";

interface submitAnswerProps {
    selectedId: number | null;
    isSubmitted: boolean;
    isCorrect: boolean | null;
    onPress: () => void;
}

const SubmitAnswer = ({selectedId, onPress, isSubmitted, isCorrect }: submitAnswerProps) => {
    return (
        <ThemedView>
            <TouchableOpacity
                style={[globalStyles.submitButton, !selectedId ? globalStyles.disabledButton : isSubmitted && !isCorrect && globalStyles.incorrectAnswer]}
                disabled={!selectedId}
                onPress={onPress}
            >
                <ThemedText style={[globalStyles.submitText]}
                >
                    {isSubmitted ? isCorrect ? 'CONTINUE' : 'GOT IT' : 'CHECK'} 
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
        
    );
};

export default SubmitAnswer;