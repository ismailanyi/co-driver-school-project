import React, { useEffect, useState } from "react";
import { FlatList, Image } from "react-native";
import { Stack } from "expo-router";
import { Shell } from "@/components/shell";
import { Container } from "@/components/container";
import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import { useTheme } from "@/context/theme";
import api from "@/lib/api";
import { MobileTabsBar } from "@/components/layouts/mobile-tabs-bar";
import { courseConfig } from "@/config/course";
import { useAuthStore } from "@/store/useAuthStore";
import { useLeaderboardStore, LeaderboardUser } from "@/store/useLeaderboardStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/icons";
import { FontAwesome5 } from '@expo/vector-icons';
import { useBreakpoint } from "@/context/breakpoints";

export default function LeaderboardScreen() {
  const { users, fetchLeaderboard, isLoading } = useLeaderboardStore();
  const { foreground, background, border, muted } = useTheme();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const breakpoint = useBreakpoint();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const renderItem = ({ item, index }: { item: LeaderboardUser; index: number }) => {
    const isCurrentUser = item.id === user?.id;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: layouts.padding,
          marginHorizontal: layouts.padding,
          marginBottom: layouts.padding,
          borderRadius: layouts.padding,
          backgroundColor: isCurrentUser ? border : background,
        }}
      >
        <View style={{ width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
          {index === 0 ? (
            <FontAwesome5 name="medal" size={20} color="#FFD700" />
          ) : index === 1 ? (
            <FontAwesome5 name="medal" size={20} color="#C0C0C0" />
          ) : index === 2 ? (
            <FontAwesome5 name="medal" size={20} color="#58CC02" />
          ) : (
            <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}>
              {index + 1}
            </Text>
          )}
        </View>
        <View style={{ marginLeft: layouts.padding, marginRight: layouts.padding, backgroundColor: 'transparent' }}>
          {item.profile_picture ? (
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${item.profile_picture}` }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: muted,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: foreground }}>
                {item.first_name?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {item.first_name} {item.last_name}
          </Text>
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#1cb0f6" }}>
          {item.total_xp} XP
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitleAlign: "center",
          headerTitle: () => (
            <Text style={{ fontFamily: 'Nunito', fontSize: 18, color: '#9ca3af', fontWeight: '600' }}>
              Leaderboard
            </Text>
          ),
        }}
      />
      <View
        style={{
          flex: 1,
          paddingTop: layouts.padding,
        }}
      >
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      {breakpoint === "sm" && (
        <MobileTabsBar navItems={courseConfig.mobileNavItems} />
      )}
    </>
  );
}
