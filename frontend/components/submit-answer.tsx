import { ThemedView } from "./themed-view";
import { ThemedButton } from "@/components/themed-button";
import { globalStyles } from "@/constants/globalStyles";
import { Text, View } from "react-native";

interface submitAnswerProps {
    selectedId: string | number | null;
    isSubmitted: boolean;
    isCorrect: boolean | null | undefined;
    onPress: () => void;
    correctAnswer?: string;
}

const SubmitAnswer = ({selectedId, onPress, isSubmitted, isCorrect, correctAnswer }: submitAnswerProps) => {
    return (
        <View style={{ width: '100%', flex: 1, justifyContent: 'flex-end' }}>
            {isSubmitted && (
                <View style={{
                    padding: 20,
                    backgroundColor: isCorrect ? '#d7ffb8' : '#ffdfe0',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    width: 'auto',
                    marginLeft: -20,
                    marginRight: -20,
                    marginBottom: -20,
                    paddingBottom: 20
                }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: isCorrect ? '#58a700' : '#ea2b2b',
                        marginBottom: isCorrect ? 0 : 10
                    }}>
                        {isCorrect ? 'Nice job!' : 'Incorrect'}
                    </Text>
                    {!isCorrect && correctAnswer && (
                        <View>
                            <Text style={{ fontSize: 16, color: '#ea2b2b', fontWeight: 'bold' }}>Correct answer:</Text>
                            <Text style={{ fontSize: 16, color: '#ea2b2b' }}>{correctAnswer}</Text>
                        </View>
                    )}
                    <ThemedButton
                        style={[
                            globalStyles.submitButton,
                            isCorrect ? globalStyles.correctAnswerButton : globalStyles.incorrectAnswerButton,
                            { marginTop: 20 }
                        ]}
                        text="CONTINUE"
                        onPress={onPress}
                        textStyle={[globalStyles.submitButtonText]}
                    />
                </View>
            )}

            {!isSubmitted && (
                <View style={{ width: '100%' }}>
                    <ThemedButton
                        style={[
                            globalStyles.submitButton,
                            !selectedId && globalStyles.disabledButton,
                        ]}
                        text="CHECK"
                        loading={!selectedId}
                        onPress={onPress}
                        textStyle={[globalStyles.submitButtonText]}
                    />
                </View>
            )}
        </View>
    );
};

export default SubmitAnswer;