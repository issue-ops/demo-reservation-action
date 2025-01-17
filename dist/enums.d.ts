/** Allowed Activities for the Action */
export declare enum AllowedActions {
    /** Confirm the Reservation Request */
    RESERVE = "reserve",
    /** Cancel the Reservation Request */
    CANCEL = "cancel",
    /** Expire the Reservation Request */
    EXPIRE = "expire"
}
/** Allowed Triggers for the Action */
export declare enum AllowedTriggers {
    /** Issue Events */
    ISSUES = "issues",
    /** Issue Comment Events */
    ISSUE_COMMENT = "issue_comment",
    /** Schedule Events */
    SCHEDULE = "schedule"
}
/** Project Column Names */
export declare enum ProjectColumnNames {
    /** New Reservations */
    NEW = "New Reservations",
    /** Confirmed Reservations */
    CONFIRMED = "Confirmed Reservations",
    /** Expired Reservations */
    EXPIRED = "Expired Reservations",
    /** Cancelled Reservations */
    CANCELLED = "Cancelled Reservations"
}
/** Issue and Comment Reaction Options */
export declare enum Reaction {
    /** Thumbs Up */
    THUMBS_UP = "+1",
    /** Thumbs Down */
    THUMBS_DOWN = "-1",
    /** Laugh */
    LAUGH = "laugh",
    /** Confused */
    CONFUSED = "confused",
    /** Heart */
    HEART = "heart",
    /** Hooray */
    HOORAY = "hooray",
    /** Rocket */
    ROCKET = "rocket",
    /** Eyes */
    EYES = "eyes"
}
/** Available Room Types */
export declare enum RoomType {
    /** Single Queen Room */
    SINGLE = "Single Queen",
    /** Double Queen Room */
    DOUBLE = "Double Queen",
    /** King Suite */
    SUITE = "King Suite"
}
/** Available Room Amenities */
export declare enum RoomAmenity {
    /** Breakfast Included */
    BREAKFAST = "Breakfast",
    /** Lunch Included */
    LUNCH = "Lunch",
    /** Dinner Included */
    DINNER = "Dinner",
    /** Wi-Fi Included */
    WIFI = "Wi-Fi",
    /** Hot Tub */
    HOT_TUB = "Hot Tub"
}
