import { ThemedText } from "@/components/themed-text";
import { Theme } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from "react-native";

type ThemedButtonProps = TouchableOpacityProps & {
    title: string;
    loading: boolean;
};

const ThemedButton = ({ title, loading, style, ...otherprops}: ThemedButtonProps) => {
    return (
        <TouchableOpacity 
            style={[styles.button, loading && styles.disabled,style]} 
            disabled={loading || otherprops.disabled}
            {...otherprops}
        >
            <ThemedText type="defaultSemiBold" style={styles.text}>
                {title}
            </ThemedText>

        </TouchableOpacity>
    )
}
export default ThemedButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#58CC02',
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
    disabled: {
        opacity: 0.7,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    }
})