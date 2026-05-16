import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";

const ChangePass = () => {
    const [formData, setFormData] = useState({
        old_password: '',
        password: '',
        confirm_password: '',
    })

    const [touched, setTouched] = useState({
        old_password: false,
        password: false, 
        confirm_password: false, 
    })

    const updateField = (key: string, value: string) => {
        setFormData((prev)=> ({...prev, [key]: value}) )
        if(key === 'password') {
            setTouched((prev) => ({...prev, confirm_password: false}))
        } else if (key === 'confirm_password') {
          setTouched((prev) => ({...prev, password: false}))
        }
    };

    const passStartMatch = formData.password.startsWith(formData.confirm_password);
    const passMatch = formData.password === formData.confirm_password;
    const confirmPassEmpty = formData.confirm_password.length === 0;
    const isFinalError = (touched.confirm_password || touched.password) && !passMatch;
    const showError = !confirmPassEmpty && (!passStartMatch || isFinalError);

    return (
        <ThemedView>
            <ThemedView>
                <ThemedView style={{gap: 10}}>
                    <ThemedText>
                        Old Password
                    </ThemedText>
                    <ThemedTextInput
                        placeholder='password'
                        value={formData.password}
                        onChangeText={(text) => updateField('old_password', text)}
                        onBlur={() => setTouched({...touched, password: true})}
                        secureTextEntry
                    />
               {/*  <ThemedView style={{gap: 10}}>
                </ThemedView> */}
                    <ThemedText>
                        New Password
                    </ThemedText>
                    <ThemedTextInput
                        value={formData.password}
                        onChangeText={(text) => updateField('password', text)}
                        onBlur={() => setTouched({...touched, password: true})}
                        secureTextEntry
                    />
                    {showError ? <ThemedText>{"Passwords Don't Match"}</ThemedText> : null}
                    <ThemedText>
                        Confirm password
                    </ThemedText>
                    <ThemedTextInput
                        value={formData.confirm_password}
                        onChangeText={(text) => updateField('confirm_password', text)}
                        onBlur={() => setTouched({...touched, confirm_password: true})}
                        secureTextEntry
                    />
                    {showError ? <ThemedText>{"Passwords Don't Match"}</ThemedText>: null}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )

}

export default ChangePass;