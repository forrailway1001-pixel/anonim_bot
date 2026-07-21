export declare class UserService {
    findOrCreateUser(telegramId: number, fullName: string, username?: string): Promise<{
        user: any;
        isNew: boolean;
    }>;
    processReferral(newUserTelegramId: number, referralCode: string): Promise<boolean>;
    verifyAndRewardReferral(newUserTelegramId: number): Promise<number | null>;
}
export declare const userService: UserService;
//# sourceMappingURL=UserService.d.ts.map