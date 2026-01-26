'use client';

import CookieConsent from "react-cookie-consent";

export default function CookieConsentWrapper() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All Cookies"
      cookieName="IPdenCookieConsent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ 
        color: "#4e503b", 
        backgroundColor: "#fff", 
        fontSize: "13px", 
        borderRadius: "4px", 
        padding: "10px 20px" 
      }}
      expires={150}
    >
      This website uses cookies to enhance the user experience and provide analytics. 
      By using our website, you consent to all cookies in accordance with our cookie policy.{" "}
      <span style={{ fontSize: "12px" }}>
        <a 
          href="/terms-of-service"
          style={{ textDecoration: "underline", cursor: "pointer", color: "inherit" }}
        >
          Learn more
        </a>
      </span>
    </CookieConsent>
  );
}