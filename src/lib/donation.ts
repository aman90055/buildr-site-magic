/** Single source for the donation recipient; the on-screen QR is generated from DONATION_UPI_LINK. */
export const DONATION_UPI_ID = "Docu2026@nyes";
export const DONATION_RECIPIENT = "AMAN VISHWAKARMA";
export const DONATION_UPI_LINK = `upi://pay?pa=${DONATION_UPI_ID}&pn=${encodeURIComponent(DONATION_RECIPIENT)}&cu=INR`;
