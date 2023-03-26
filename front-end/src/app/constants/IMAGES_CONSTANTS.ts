export const VISA_IMAGE = "assets/pay-icons/visa.PNG";
export const MASTER_CARD_IMAGE = "assets/pay-icons/mc.PNG";
export const AMERICAN_EXPRESS_IMAGE = "assets/pay-icons/amex.PNG";
export const DINERS_CLUB_IMAGE = "assets/pay-icons/dc.PNG";
export const DISCOVER_IMAGE = "assets/pay-icons/discover.PNG";
export const JCB_IMAGE = "assets/pay-icons/jcb.PNG";
export const UNIONPAY_IMAGE = "assets/pay-icons/unipay.PNG";


export const IMAGE_CONSTANTS = {
    APPLICATION_ID: '2',
    /**
     * 1 TO 4 IN BITPOS UNI, THAT'S WHY START FROM 5
     */
    MEDIA_TYPES: {
        PHOTO: '1',
        VIDEO: '2'
    },
    ENTITY_TYPES: {
        AUCTION: '5',
        USER: '6'
    },
    MEDIA_PURPOSE_TYPES: {
        PHOTO1: '10',
        PHOTO2: '11',
        PROFILE: '12',
    }
}

export function getImage(key: string) {
    if (!key) {
        return "";
    }
    var cardTitle = key?.toUpperCase();
    console.log('creditCardType getImage.code==', cardTitle);
    if (cardTitle == "VISA") {
        return VISA_IMAGE;
    }
    if (cardTitle == "MASTERCARD") {
        return MASTER_CARD_IMAGE;
    }
    if (cardTitle == "AMERICAN EXPRESS") {
        return AMERICAN_EXPRESS_IMAGE;
    }
    if (cardTitle == "JCB") {
        return JCB_IMAGE;
    }
    if (cardTitle == "UNIONPAY") {
        return UNIONPAY_IMAGE;
    }
    if (cardTitle == "DISCOVER") {
        return DISCOVER_IMAGE;
    }
    if (cardTitle == "DINER CLUB") {
        return DINERS_CLUB_IMAGE;
    }
    return "";
}