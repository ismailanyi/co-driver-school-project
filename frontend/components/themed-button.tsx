import { ThemedText } from "@/components/themed-text";
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps, type StyleProp, type TextStyle } from "react-native";

type ThemedButtonProps = TouchableOpacityProps & {
    title: string;
    loading?: boolean;
    textStyle?: StyleProp<TextStyle>;
};

export const ThemedButton = ({ 
    title, 
    loading, 
    style, 
    textStyle,
    ...otherprops
    }: ThemedButtonProps) => {
    const isDisabled = loading || otherprops.disabled;
    return (
        <TouchableOpacity 
            style={[styles.button, isDisabled && styles.disabled,style]} 
            disabled={loading || otherprops.disabled}
            {...otherprops}
        >
            <ThemedText type="defaultSemiBold" style={[styles.text, textStyle]}>
                {title}
            </ThemedText>

            </TouchableOpacity>
    )
}

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
        backgroundColor: "#e5e5e5",
        elevation: 0,
        shadowOpacity: 0,
        opacity: 0.7,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    }
})