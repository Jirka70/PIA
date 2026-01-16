import { describe, it, expect } from "vitest";

import { makeFakeDb } from "@/test/helpers/db";
import { makeTestCtx } from "@/test/helpers/ctx";
import { reviewRouter } from "@/trpc/routers/review-router";
import { TRPCError } from "@trpc/server";

describe("publishTranslatorReviewUnauthorized", () => {
  it("throws UNAUTHORIZED if user is not project owner", async () => {
    const db = makeFakeDb({
        project: {
            id: "project-1",
            clientId: "client-1",
            translatorId: "translator-1",
        },
    });

    const ctx = makeTestCtx({
        db,
        user: {
            id: "someone-else",
            name: "Roman",
            role: "user",
        },
        session: {
            userId: "user-1"
        }
    });

    const caller = reviewRouter.createCaller(ctx);

    try {
      await caller.publishTranslatorReview({
        projectId: "project-1",
        reviewData: {
          translatorName: "John Doe",
          qualityRating: 5,
          communicationRating: 5,
          punctualityRating: 5,
          overallRating: 5,
          title: "Test",
          comment: "Test pepa zetek",
        },
      })

      expect.fail("Expected TRPCError")
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError)

      const err = e as TRPCError
      expect(err.code).toBe("UNAUTHORIZED")
    }
  });
});

describe("publishTranslatorReviewHappyDayScenario", () => {
  it("Will publish a translator review with correct user-id", async () => {

    const expectedTranslatorReview = {
      id: "translator-review-id",
      translatorId: "client-1",
      createdAt: new Date()  
    }
    const db = makeFakeDb({
        project: {
            id: "project-1",
            clientId: "client-1",
            translatorId: "translator-1",
        },
        insertedTranslatorReview: expectedTranslatorReview
    });

    const ctx = makeTestCtx({
        db,
        user: {
            id: "client-1",
            name: "Roman",
            role: "user",
        },
        session: {
            userId: "client-1"
        }
    });

    const caller = reviewRouter.createCaller(ctx)
    
    const actual = await caller.publishTranslatorReview({
      projectId: "project-1",
      reviewData: {
          translatorName: "John Doe",
          qualityRating: 5,
          communicationRating: 5,
          punctualityRating: 5,
          overallRating: 5,
          title: "Test",
          comment: "Test pepa zetek",
        },
    }) 

    const actualReview = actual.translatorReview;
    
    expect(actualReview).toMatchObject(expectedTranslatorReview)
  });
})