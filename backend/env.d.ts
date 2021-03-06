/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test" | "debug"

    /**
     * Server root directory. The default value depends on the environment. Please don't change this manually.
     */
    readonly SERVER_ROOT: string

    /**
     * The port server will listen on
     */
    readonly SERVER_PORT: string

    /**
     * Server address
     */
    readonly SERVER_ADDRESS: string

    /**
     * Web client address
     */
    readonly CLIENT_ADDRESS: string

    /**
     * Database server hostname
     */
    readonly DATABASE_HOST: string

    /**
     * Database server port
     */
    readonly DATABASE_PORT: string

    /**
     * Name of a user to use in database connection
     */
    readonly DATABASE_USER: string

    /**
     * Password for database connection
     */
    readonly DATABASE_PASSWORD: string

    /**
     * Name of the database. Defaults to `twi`
     */
    readonly DATABASE_NAME: string

    readonly DATABASE_ENTITIES: string

    readonly DATABASE_SUBSCRIBERS: string

    /**
     * Server-wide secret key
     */
    readonly SERVER_AUTH_SESSION_SECRET: string

    readonly GRAPHQL_RESOLVERS: string
  }
}
