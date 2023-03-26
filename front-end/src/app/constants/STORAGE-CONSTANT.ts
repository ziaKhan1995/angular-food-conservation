export const STORAGE_CONSTANTS = {
    LOCAL_STORAGE_ACCOUNT_KEY: "fcwr-account",
    LOCAL_STORAGE_TOKEN_KEY: "id_token",
}
export const STORAGE_ROUTE_HEADING = {
    LOCAL_STORAGE_FROM_PAGE: "from_page",
}
export const STORAGE_AUCTIONS = {
    LOCAL_STORAGE_AUCTION_KEY_HOME: "home_auction",
    LOCAL_STORAGE_AUCTION_KEY_PROFILE: "profile_auction",
}

export function getUserCityByCode(key): any {
    var code = key;
    if (typeof key == "number") {
        code = code?.toString();
    }
    if (code == "1") {
        return "Islamabad";
    }
    if (code == "2") {
        return "Rawalpindi";
    }
    if (code == "3") {
        return "Peshawar";
    }
    if (code == "4") {
        return "Lahore";
    }
    if (code == "5") {
        return "Quetta";
    }
    if (code == "6") {
        return "Multan";
    }
    if (code == "7") {
        return "Chitral";
    }
}