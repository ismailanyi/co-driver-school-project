import { TextInput, type TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "@/context/theme";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
}

export function ThemedTextInput({style, lightColor, darkColor, ...otherProps}: ThemedTextInputProps) {
    const { background, border, foreground, mutedForeground } = useTheme();

    return <TextInput 
        style={[styles.default, {color: foreground, borderColor: border, backgroundColor: background}, style]}
        placeholderTextColor={mutedForeground}
        {...otherProps}
    />
}


const styles = StyleSheet.create({
    default: {
        height: 50,
        borderWidth: 2,
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    }
})