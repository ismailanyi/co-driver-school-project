import { ThemedView } from "./themed-view";
import { ThemedButton } from "@/components/themed-button";
import { globalStyles } from "@/constants/globalStyles";

interface submitAnswerProps {
    selectedId: string | number | null;
    isSubmitted: boolean;
    isCorrect: boolean | null | undefined;
    onPress: () => void;
}

const SubmitAnswer = ({selectedId, onPress, isSubmitted, isCorrect }: submitAnswerProps) => {
    return (
        <ThemedView style={globalStyles.submitContainer}>
            <ThemedButton
                style={[
                    globalStyles.submitButton,
                    !selectedId && globalStyles.disabledButton,
                    isSubmitted && (isCorrect ? globalStyles.correctAnswerButton : globalStyles.incorrectAnswerButton) ]}
                text={isSubmitted ? isCorrect ? 'CORRECT' : 'GOT IT' : 'CHECK'}
                loading={!selectedId}
                onPress={onPress}
                textStyle={[globalStyles.submitButtonText]}
            />
        </ThemedView>
        
    );
};

export default SubmitAnswer;