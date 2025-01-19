export type TokenPayload = {
  exp: number; // Expiration time as a UNIX timestamp
  iat: number; // Issued at time as a UNIX timestamp
  auth_time: number; // Authentication time as a UNIX timestamp
  jti: string; // JWT ID
  iss: string; // Issuer URL
  aud: string; // Audience
  sub: string; // Subject identifier
  typ: string; // Token type, e.g., "Bearer"
  azp: string; // Authorized party
  session_state: string; // Session state identifier
  acr: string; // Authentication context class reference
  'allowed-origins': string[]; // Array of allowed origins
  realm_access: {
    roles: string[]; // Roles within the realm
  };
  resource_access: {
    account: {
      roles: string[]; // Roles associated with the account resource
    };
  };
  scope: string; // Space-separated list of scopes
  sid: string; // Session ID
  email_verified: boolean; // Whether the email is verified
  name: string; // Full name of the user
  preferred_username: string; // Preferred username
  locale: string; // Locale, e.g., "de" for German
  given_name: string; // First name
  family_name: string; // Last name
  email: string; // Email address
};
