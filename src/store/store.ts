import { AuthTypes } from "../enums/Enums"
import {create} from "zustand";
import { PagesEnum } from "../enums/Enums"
import { UserProfile, token } from "../types/Types";
import { api } from "../axios/api";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

interface AuthStore {
    authType: AuthTypes;
    setAuthType: (authType: AuthTypes) => void;
}

interface PageStore {
    page: PagesEnum;
    setPage: (page: PagesEnum) => void;
}

interface DriveStore{
    currentDrive: number;
    setCurrentDrive: (currentDrive: number) => void;
}


interface UserStore {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
}

interface PhoneStore {
    phone: string;
    setPhone: (phone: string) => void;
}


export const usePhone = create<PhoneStore>((set) => ({
    phone: "",
    setPhone: (phone) => {
        localStorage.setItem("phone", phone)
        set({phone})
    },
}));

export const useUser = create<UserStore>((set) => ({
    user: {} as UserProfile,
    setUser: (_user: UserProfile) => set({ user: _user }),
}));


export const useAuthStore = create<AuthStore>((set) => ({
    authType: AuthTypes.NONE,
    setAuthType: (_authType) => set(() => ({ authType: _authType })),
}));


export const usePage = create<PageStore>((set) => ({
    page: PagesEnum.HOME,
    setPage: (page) => set({ page }),
}));

export const useDrive = create<DriveStore>((set) => ({
    currentDrive: 0,
    setCurrentDrive: (currentDrive) => set({ currentDrive }),
}))