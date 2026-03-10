import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, type TouchableOpacityProps, type StyleProp, type TextStyle } from "react-native";
import { globalStyles } from "@/constants/globalStyles";

type ThemedButtonProps = TouchableOpacityProps & {
    text?: string;
    loading?: boolean;
    textStyle?: StyleProp<TextStyle>;
    onPress?: () => void;
};

export const ThemedButton = ({
    text,
    loading,
    style,
    textStyle,
    onPress,
    ...otherprops
    }: ThemedButtonProps) => {
    const isDisabled = loading || otherprops.disabled;
    return (
        <TouchableOpacity
            style={[globalStyles.button, isDisabled && globalStyles.disabledButton,style]}
            disabled={loading || otherprops.disabled}
            {...otherprops}
        >
            <ThemedText type="defaultSemiBold" style={[globalStyles.text, textStyle]}>
                {text}
            </ThemedText>

        </TouchableOpacity>
    )
}
