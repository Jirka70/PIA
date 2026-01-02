import { ZodError } from "zod";

export type BadPayloadType = {
    ok: false;
    error: ZodError;
};
