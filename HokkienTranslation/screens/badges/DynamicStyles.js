import {StyleSheet} from "react-native";

export const createDynamicStyles = (colors, rarityColors, isEarned) => StyleSheet.create({
    badgeCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 24,
        margin: 8,
        shadowColor: colors.onSurface,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        width: 300,
        alignItems: 'center',
    },

    earnedCard: {
        backgroundColor: colors.surface,
        borderColor: colors.buttonBorder,
    },

    unearnedCard: {
        opacity: 0.6,
        backgroundColor: colors.categoriesContainer,
    },

    // Badge Icon Styles
    badgeIconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },

    badgeIconOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },

    badgeIconGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    badgeIconInner: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },

    badgeIcon: {
        fontSize: 48,
    },

    grayscaleFilter: {
        opacity: 0.4,
    },

    grayscaleText: {
        opacity: 0.3,
    },

    // Content Styles
    badgeContent: {
        alignItems: 'center',
        width: '100%',
    },

    badgeName: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.onSurface,
        textAlign: 'center',
        marginBottom: 8,
    },

    badgeDescription: {
        fontSize: 15,
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 12,
    },

    // Progress Styles
    progressSection: {
        width: '100%',
        marginVertical: 12,
    },

    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: colors.outlineVariant,
        borderRadius: 4,
        marginBottom: 8,
    },

    progressFill: {
        height: '100%',
        borderRadius: 4,
    },

    progressText: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        fontWeight: '600',
        textAlign: 'center',
    },

    rarityText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    mutedText: {
        color: colors.onSurfaceVariant,
        opacity: 0.6,
    },

    // Earned Date Styles
    earnedDateContainer: {
        marginTop: 8,
        marginBottom: 12,
    },

    earnedDateText: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        textAlign: 'center',
    },

    // Status Styles
    statusContainer: {
        alignItems: 'center',
        width: '100%',
    },

    statusEarned: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },

    statusEarnedText: {
        fontSize: 13,
        fontWeight: '600',
    },

    statusLocked: {
        backgroundColor: colors.categoriesContainer,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
    },

    statusLockedText: {
        color: colors.onSurfaceVariant,
        fontSize: 13,
        fontWeight: '600',
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: colors.surface || '#ffffff',
    },

    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
        marginBottom: 16,
    },

    retryButton: {
        backgroundColor: colors.primaryContainer || '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },

    retryButtonText: {
        color: colors.onPrimaryContainer || '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});
