import { TRPCError } from "@trpc/server";
import { expect } from "vitest";

export async function expectTrpcError(
    promise: Promise<any>,
    opts: {
        code: string, messageIncludes?: string
    }) {
        try {
            await promise;
            expect.fail("Expected TRPCError")

        } catch (e) {
            expect(e).toBeInstanceOf(TRPCError)
            const err = e as TRPCError;
            expect(err.code).toBe(opts.code)
            if (opts.messageIncludes) {
                expect(err.message).toContain(opts.messageIncludes)
            }
        }
}   
