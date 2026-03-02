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
    normal: {
        color: 'gray'
    },
    textcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorText: {
        color: 'red',
    },
    buttonContainer: {
    // We will define the layout here
    }, 
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    text: {
            color: '#FFFFFF',
            fontSize: 20,
        },
        inputtext: {
            color: '#1e1f20'
        },
        titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
    },
    forgotPasswordText: {
        color: '#00BFFF',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center'
    },
    forgotPasswordContainer: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        marginTop: 10,
    },
    checker: {
        alignSelf: 'stretch'
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
    img: {
        width: '20%',
        aspectRatio: 1,
        backgroundColor: '#e5e5e5',
        borderRadius: 15,
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        padding: 0,
        width: '100%'

    },
    card: {
        width: '40%',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    selectedCard: {
        borderColor: '#84D8FF',
        backgroundColor: '#DDF4FF'

    },
    signImage: {
        height: '80%',
        width: '80%',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#58CC02',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        // color: 'white',
        // fontWeight: 'bold',
        backgroundColor: '#e5e5e5'
    },
    submitText: {
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    incorrectAnswer: {
        borderRadius: 1,
        borderColor: '#ff0000'
    }, 
})