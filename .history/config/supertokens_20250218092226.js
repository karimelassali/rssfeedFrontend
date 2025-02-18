import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";

SuperTokens.init({
  framework: "express",
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: "DigiNews",
    apiDomain: process.env.APP_API_DOMAIN || "http://localhost:3000",
    websiteDomain: process.env.APP_WEBSITE_DOMAIN || "http://localhost:3000",
    apiBasePath: "/api/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    EmailPassword.init(),
    Session.init()
  ]
});