import {useEffect, useState} from "react";
import {useTheme, View} from "native-base";
import getCurrentUser from "../../backend/database/GetCurrentUser";
import {getUserLevel, getUserPoints} from "../../backend/database/LeitnerSystemHelpers";
import {StyleSheet} from "react-native"
import * as Progress from "react-native-progress"
import {auth} from "../../backend/database/Firebase"


export const LevelProgress = () => {
    const [loading, setLoading] = useState(true);
    const [userLevel, setUserLevel] = useState(null);
    const [userPoints, setUserPoints] = useState(null);
    const [levelProgress, setLevelProgress] = useState(0);
    const {themes, theme} = useTheme();
    const colors = themes[theme];
    const pointsPerLevel = 100;

    useEffect(() => {
        const fetchUserLevelData = async () => {
            try {
                const user = await getCurrentUser();
                const level = await getUserLevel(user, pointsPerLevel);
                const points = await getUserPoints(user);

                setUserLevel(level);
                setUserPoints(points);
                setLevelProgress((points - ((level - 1) * 100)) / 100);
            } catch (error) {
                console.error("Error fetching user level:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUserLevelData();
    }, []);

    if (!auth.currentUser) {
        return null
    }

    if (loading) {
        return (
            <View style={styles.levelContainer}>
                <Text style={[styles.levelText, {color: colors.onSurface}]}>
                    Loading...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.levelContainer}>
            <Text style={[styles.levelText, {color: colors.onSurface}]}>
                Level {userLevel || "..."}
            </Text>
            <Progress.Bar
                progress={levelProgress || 0}
                width={80}
                height={3}
                color={colors.primary}
                unfilledColor={colors.surface}
                borderWidth={0}
            />
            <Text style={[styles.pointsText, {color: colors.onSurface}]}>
                {userPoints || 0}/{(userLevel || 1) * 100}
            </Text>
        </View>
    );
};


const styles = StyleSheet.create({
    levelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    pointsText: {
        fontSize: 10,
        marginTop: 1,
        opacity: 0.8,
    },

})
