import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/themed-button";
import { router } from 'expo-router'
import { Platform, ScrollView, useWindowDimensions} from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { globalStyles } from "@/constants/globalStyles";
import { Image } from "expo-image";

import { Container } from "@/components/container";
import { MAIN_HEADER_HEIGHT } from "@/components/layouts/main-header";
import { Metadata } from "@/components/metadata";
import { Text, View } from "@/components/themed";
import { Button } from "@/components/ui/button";
import { layouts } from "@/constants/layouts";

import { useBreakpoint } from "@/context/breakpoints";

const HomeScreen = () => {
    const breakpoint = useBreakpoint();
    const [ isChecking, setisChecking ] = useState(true);
    const { height } = useWindowDimensions()

    useEffect(() => {
        const checkUserToken = async () => {
            let token = null;
            
            if (Platform.OS === 'web') {
                token = await localStorage.getItem('userToken')
            } else {
                token = await SecureStore.getItemAsync('userToken')
            }

            if(token) {
                router.replace('/learn')
            } else {
                setisChecking(false)
            }

        }
        checkUserToken();
    }, [])
    
    if (isChecking) {
        return <ThemedView style={globalStyles.container}/>
    }
    return (
<>
      <Metadata />
      <View style={{ flex: 1 }}>
        <Container>
          <ScrollView
            contentContainerStyle={{
              minHeight: height - MAIN_HEADER_HEIGHT,
              padding: breakpoint === "sm" ? layouts.padding : layouts.padding * 2,
            }}
            showsVerticalScrollIndicator={false}
          >
            {breakpoint === "sm" ? (
              <View style={{ flex: 1, gap: layouts.padding * 2 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <View>
                  <Text
                  style={{
                      fontSize: 32,
                      fontWeight: "800",
                      textAlign: "center",
                    }}
                  >
                    Co-Driver
                  </Text>
                    <Image
                      source="https://www.svgrepo.com/show/493482/drive.svg"
                      alt="driving"
                      contentFit="contain"
                      style={{ width: "100%", aspectRatio: 1 }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: "800",
                      textAlign: "center",
                    }}
                  >Skip the manual, Pass the driving test.
                  </Text>
                </View>
                <View
                  style={{
                    gap: layouts.padding,
                  }}
                >
                  <Button onPress={() => router.push("/signup")}>
                    get started
                  </Button>
                  <Button variant="outline" onPress={() => router.push("/signin")}>
                    I already have an account
                  </Button>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  gap: layouts.padding * 2,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <View>
                    <Image
                      source="https://www.svgrepo.com/show/493482/drive.svg"
                      alt="Learning language"
                      contentFit="contain"
                      style={{ width: "100%", aspectRatio: 1 }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <View style={{ gap: layouts.padding * 2 }}>
                    <Text
                      style={{
                        fontSize: 32,
                        fontWeight: "800",
                        textAlign: "center",
                      }}
                    >
                      An interactive system for NTSA road safety compliance.
                    </Text>
                    <View
                      style={{
                        gap: layouts.padding,
                        width: breakpoint === "md" ? "100%" : 300,
                        marginHorizontal: "auto",
                      }}
                    >
                      <Button onPress={() => router.push("/signup")}>
                        Get Started
                      </Button>
                      <Button variant="outline" onPress={() => router.push("/signin")}>
                        I Already have an account
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </Container>
      </View>
    </>
    )
}

export default HomeScreen;