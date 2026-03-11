import QuestionScreen from "@/components/question-screen";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    title: {
        color: 'green',
        alignItems: 'center'
    },
    textcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorText: {
        color: 'red',
    },
    container: {
        position: "relative",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    homeButtonsStyles: {
        flex: 1,
        backgroundColor: '#EFBF04'
    },
    homeTextStyle: {
        fontSize: 20,
        color: '#000000'
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    text: {
            color: '#FFFFFF',
            fontSize: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    forgotPasswordContainer: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        marginTop: 10,
    },
    forgotPasswordText: {
        color: '#00BFFF',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center'
    },
    questionScreenContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 20,
        // alignItems: "flex-start",
    },
    questionContainer: {
        width: '100%',
        flex: 6
    },
    promptText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    targetText: {
        fontSize: 24,
        color: '#1CB0F6',
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        padding: 0,
        width: '100%'
    },
    signsCard: {
        width: '40%',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCard: {
        borderColor: '#84D8FF',
        backgroundColor: '#DDF4FF'
    },
    signImageSize: {
        height: '80%',
        width: '80%',
    },
    submitContainer: {
        paddingTop: 10,
        width: '100%',
        height: '30%',
        marginBottom: 0,
        justifyContent: "flex-end",
        flex: 1
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#EFBF04',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    correctAnswerButton: {
        borderRadius: 15,
        backgroundColor: '#58CC02'
    },
    incorrectAnswerButton: {
        borderRadius: 15,
        borderColor: '#ff0000',
        backgroundColor: '#ff0000'
    }, 
    theoryOptionCard: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#e5e5e5',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#ffffff',
    },
    theoryOptionText: {
        fontSize: 16,
        color: '#4b4b4b',
    },
    button: {
        backgroundColor: '#EFBF04',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4
    },
    disabledButton: {
        backgroundColor: "#e5e5e5",
        elevation: 0,
        shadowOpacity: 0,
        opacity: 0.7,
    },
})