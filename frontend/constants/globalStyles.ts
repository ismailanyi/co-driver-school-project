import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: '1%',
        position: "relative",
    },
    submitContainer: {
        paddingTop: 10,
        width: '100%',
        height: '30%',
        marginBottom: 0,
        justifyContent: "flex-end",
        flex: 1
    },
    textcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    forgotPasswordContainer: {
        backgroundColor: 'transparent',
        elevation: 0,
        boxShadow: 'none',
        marginTop: 10,
    },
    questionContainer: {
        width: '100%',
        flex: 6
    },
    questionScreenContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 20,
        // alignItems: "flex-start",
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        padding: 0,
        width: '100%'
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    signImageSize: {
        height: '80%',
        width: '80%',
    },
    selectedCard: {
        borderColor: '#84D8FF',
        backgroundColor: '#DDF4FF'
    },
    signsCard: {
        width: '48%',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
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
    button: {
        backgroundColor: '#1cb0f6',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#1899d6',
    },
    homeButtonsStyles: {
        flex: 1,
        backgroundColor: '#EFBF04'
    },
    disabledButton: {
        backgroundColor: "#e5e5e5",
        borderBottomColor: "#cccccc",
        elevation: 0,
        boxShadow: 'none',
        opacity: 0.7,
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#58CC02',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: '#58A700',
    },
    correctAnswerButton: {
        backgroundColor: '#58CC02',
        borderBottomColor: '#58A700',
    },
    incorrectAnswerButton: {
        backgroundColor: '#ff4b4b',
        borderBottomColor: '#ea2b2b',
    }, 
    title: {
        color: 'green',
        alignItems: 'center'
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    homeTextStyle: {
        fontSize: 20,
        color: '#000000'
    },
    errorText: {
        color: 'red',
    },
    submitButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
        color: '#FFFFFF',
    },
    theoryOptionText: {
        fontSize: 16,
        color: '#4b4b4b',
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
    forgotPasswordText: {
        color: '#00BFFF',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center'
    },

    MTB: {

    }
})