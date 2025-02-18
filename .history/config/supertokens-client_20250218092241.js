import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
  appInfo: {
    appName: "DigiNews",
    apiDomain: process.env.NEXT_PUBLIC_APP_API_DOMAIN || "http://localhost:3000",
    websiteDomain: process.env.NEXT_PUBLIC_APP_WEBSITE_DOMAIN || "http://localhost:3000",
    apiBasePath: "/api/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    EmailPassword.init(),
    Session.init()
  ]
});
