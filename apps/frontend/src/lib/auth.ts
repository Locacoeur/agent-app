import { betterAuth } from 'better-auth';
import { genericOAuth } from 'better-auth/plugins';
import { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET } from '$env/static/private';

export const auth = betterAuth({
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'Zoho',
					clientId: ZOHO_CLIENT_ID,
					clientSecret: ZOHO_CLIENT_SECRET,
					// discoveryUrl: 'https://accounts.zoho.eu/.well-known/openid-configuration',
					discoveryUrl: "https://locacoeur.zohocreatorportal.eu/",
					scopes: ["email", "profile"]
				}
			]
		})
	]
});
