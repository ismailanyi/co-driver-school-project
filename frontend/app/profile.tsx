import { View } from "@/components/themed"
import { Text, ScrollView, Image, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from "@/components/themed-view";
import { MobileTabsBar } from "@/components/layouts/mobile-tabs-bar";
import { courseConfig } from "@/config/course";
import { useBreakpoint } from "@/context/breakpoints";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/context/theme";

const XPGraph = ({ history }: { history: { date: string, total_xp: string }[] }) => {
    const { background, foreground, border, mutedForeground, muted, primary } = useTheme();
    // Fill last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
        return { date: `${year}-${month}-${day}`, dayName };
    });

    const dataMap = new Map(history.map(item => [item.date.split('T')[0], parseInt(item.total_xp, 10)]));
    
    const chartData = last7Days.map(item => ({
        day: item.dayName,
        xp: dataMap.get(item.date) || 0
    }));

    const maxXP = Math.max(...chartData.map(d => d.xp)) || 1; 

    return (
        <View style={{ marginTop: 20, backgroundColor: background, padding: 20, borderRadius: 15, borderWidth: 2, borderColor: border }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: foreground, marginBottom: 15, fontFamily: 'Nunito-Black' }}>XP History</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, backgroundColor: 'transparent' }}>
                {chartData.map((data, index) => {
                    const barHeight = data.xp === 0 ? 4 : Math.max(15, (data.xp / maxXP) * 100);
                    return (
                        <View key={index} style={{ alignItems: 'center', flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', height: '100%' }}>
                            <Text style={{ fontSize: 10, color: mutedForeground, marginBottom: 5 }}>{data.xp > 0 ? data.xp : ''}</Text>
                            <View style={{ width: 24, height: barHeight, backgroundColor: data.xp > 0 ? primary : border, borderRadius: 4 }} />
                            <Text style={{ fontSize: 12, color: mutedForeground, marginTop: 10, fontWeight: 'bold' }}>{data.day}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const Profile = () => {
    const breakpoint = useBreakpoint();
    const { background, foreground, border, mutedForeground, muted, primary } = useTheme();
    const { user: userData } = useAuthStore();
    const fetchUserData = useProfileStore(state => state.fetchUserData);
    const fetchXpHistory = useProfileStore(state => state.fetchXpHistory);
    const xpHistory = useProfileStore(state => state.xpHistory);
    const [heartsCountdown, setHeartsCountdown] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData();
        fetchXpHistory();
    }, [fetchUserData, fetchXpHistory]);

    useEffect(() => {
        if (!userData || userData.hearts === undefined || userData.hearts >= 5 || userData.hearts === -1 || !userData.last_heart_refill) {
            setHeartsCountdown(null);
            return;
        }

        const updateCountdown = () => {
            const now = new Date().getTime();
            const lastRefill = new Date(userData.last_heart_refill!).getTime();
            const heartsNeeded = 5 - userData.hearts!;
            const fullRefillTime = lastRefill + heartsNeeded * 10 * 60 * 1000;
            const diff = fullRefillTime - now;

            if (diff <= 0) {
                setHeartsCountdown("Full");
            } else {
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                if (h > 0) {
                    setHeartsCountdown(`Full in ${h}h ${m}m`);
                } else {
                    setHeartsCountdown(`Full in ${m}m ${s}s`);
                }
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [userData?.hearts, userData?.last_heart_refill]);

    const joinedDate = userData?.created_at ? new Date(userData.created_at) : null;
    const joinedMonthYear = joinedDate ? joinedDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Unknown';

    const displayUsername = userData?.username ? `@${userData.username}` : null;

    return(
        <>
          <Stack.Screen 
            options={{
              headerShown: true,
              headerBackVisible: false,
              headerLeft: () => null,
              headerTitleAlign: "center",
              headerTitle: () => (
                <Text className="text-gray-400 text-lg font-semibold" style={{ fontFamily: 'Nunito' }}>
                  Profile
                </Text>
              ),
              headerRight: () => (
                <Pressable onPress={() => router.push('/settings')} style={{ marginRight: 15 }}>
                    <Ionicons name="settings-sharp" size={24} color="#1cb0f6" />
                </Pressable>
              )
            }}
          />
          <ThemedView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
                <View style={{ width: '100%', maxWidth: 500, alignSelf: 'center', backgroundColor: 'transparent' }}>
                    
                    {/* Header Section */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, backgroundColor: 'transparent' }}>
                        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: primary, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                            {userData?.profile_picture ? (
                                <Image 
                                    source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${userData.profile_picture}` }} 
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text style={{ fontSize: 32, color: '#fff', fontWeight: 'bold' }}>
                                    {(userData?.first_name || '')[0] || ''}{(userData?.last_name || '')[0] || ''}
                                </Text>
                            )}
                        </View>
                        <View style={{ marginLeft: 20, backgroundColor: 'transparent', flex: 1 }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: foreground, fontFamily: 'Nunito-Black' }}>
                                {userData?.first_name || 'Student'} {userData?.last_name || ''}
                            </Text>
                            {displayUsername && (
                                <Text style={{ fontSize: 16, color: mutedForeground, marginTop: 4 }}>
                                    {displayUsername}
                                </Text>
                            )}
                            <Text style={{ fontSize: 14, color: mutedForeground, marginTop: 4 }}>
                                Joined {joinedMonthYear}
                            </Text>
                        </View>
                    </View>

                    {/* Stats Section */}
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: foreground, marginBottom: 15, fontFamily: 'Nunito-Black' }}>Statistics</Text>
                    
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, backgroundColor: 'transparent' }}>
                        
                        <View style={{ flex: 1, minWidth: '45%', backgroundColor: background, padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#ff9600', flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome5 name="fire" size={24} color="#ff9600" />
                            <View style={{ marginLeft: 15, backgroundColor: 'transparent' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: foreground }}>{userData?.streak_count || 0}</Text>
                                <Text style={{ fontSize: 14, color: mutedForeground }}>Day Streak</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, minWidth: '45%', backgroundColor: background, padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#ff4b4b', flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome5 name="heart" size={24} color="#ff4b4b" />
                            <View style={{ marginLeft: 15, backgroundColor: 'transparent' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: foreground }}>{userData?.hearts === -1 ? '∞' : (userData?.hearts || 0)}</Text>
                                <Text style={{ fontSize: 14, color: mutedForeground }}>Hearts</Text>
                                {heartsCountdown && (
                                    <Text style={{ fontSize: 11, color: '#ff4b4b', fontWeight: 'bold', marginTop: 2 }}>{heartsCountdown}</Text>
                                )}
                            </View>
                        </View>

                        <View style={{ flex: 1, minWidth: '45%', backgroundColor: background, padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#facc15', flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome5 name="bolt" size={24} color="#facc15" />
                            <View style={{ marginLeft: 15, backgroundColor: 'transparent' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: foreground }}>{userData?.total_xp || 0}</Text>
                                <Text style={{ fontSize: 14, color: mutedForeground }}>Total XP</Text>
                            </View>
                        </View>

                    </View>

                    <XPGraph history={xpHistory} />

                </View>
            </ScrollView>
          </ThemedView>
          {breakpoint === "sm" && (
            <MobileTabsBar navItems={courseConfig.mobileNavItems} />
          )}
        </>
    )
}

export default Profile;