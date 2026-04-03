import "dotenv/config";
import env from "env-var";

export const envs = {
	SECRET_KEY: env.get("SECRET_KEY").required().asString(),
	DB_MONGO: env.get("DB_MONGO").required().asString(),
	PORT: env.get("PORT").default("4000").asPortNumber(),
};
